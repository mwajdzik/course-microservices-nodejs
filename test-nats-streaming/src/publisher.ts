import nats from 'node-nats-streaming';
import {randomBytes} from "crypto";
import {TicketCreatedPublisher} from "./events/ticket-created-publisher";

const clientId = randomBytes(4).toString('hex');
const stan = nats.connect('ticketing', clientId, {url: 'http://localhost:4222'});

const ticketCreatedPublisher = new TicketCreatedPublisher(stan);

stan.on('connect', async () => {
    console.clear();
    console.log(`Publisher ${clientId} connected to NATS`);

    const data = {id: '123', title: 'concert', price: 20};
    await ticketCreatedPublisher.publish(data)
});
