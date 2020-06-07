import mongoose from 'mongoose';
import {app} from './app';
import {natsWrapper} from "./nats-wrapper";

const ensureEnv = (name: string) => {
    if (!process.env[name]) {
        throw new Error(`${name} must be defined`);
    }
}

const start = async () => {
    ['JWT_KEY', 'MONGO_URI', 'NATS_CLUSTER_ID', 'NATS_CLIENT_ID', 'NATS_URL']
        .forEach(ensureEnv);

    try {
        // ticketing - clusterId used in tickets/infra/k8s/nats-depl.yaml
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID!, process.env.NATS_URL!);

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        });

        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        await mongoose.connect(process.env.MONGO_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
    } catch (err) {
        console.error(err);
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000!');
    });
}

start()
    .then(r => console.log(r));

