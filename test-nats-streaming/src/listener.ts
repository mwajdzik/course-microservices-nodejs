import nats, {Message} from 'node-nats-streaming';
import {randomBytes} from "crypto";

const clientId = randomBytes(4).toString('hex');
const stan = nats.connect('ticketing', clientId, {url: 'http://localhost:4222'});

stan.on('connect', () => {
    console.clear();
    console.log(`Listener ${clientId} connected to NATS`);
    
    stan.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
    });

    const channel = 'ticket:created';
    const queueGroup = 'orders-service-queue-group';
    const options = stan.subscriptionOptions()
        .setDeliverAllAvailable()
        .setDurableName('ticket-service')
        .setManualAckMode(true);

    const subscription = stan.subscribe(channel, queueGroup, options);

    subscription.on('message', (msg: Message) => {
        const data = msg.getData();

        if (typeof data === 'string') {
            console.log('Message received on the channel', msg.getSubject(), msg.getSequence(), JSON.parse(data));
        }

        msg.ack();
    });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
