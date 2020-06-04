import nats from 'node-nats-streaming';
import {randomBytes} from "crypto";

const clientId = randomBytes(4).toString('hex');
const stan = nats.connect('ticketing', clientId, {url: 'http://localhost:4222'});

stan.on('connect', () => {
    console.clear();
    console.log(`Publisher ${clientId} connected to NATS`);

    const channel = 'ticket:created';
    const data = JSON.stringify({id: '123', title: 'concert', price: 20});

    stan.publish(channel, data, () => {
        console.log('Event published');
    });
});
