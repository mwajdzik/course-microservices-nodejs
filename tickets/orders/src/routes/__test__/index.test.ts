import request from 'supertest';
import {Ticket} from "../../models/ticket";
import {app} from "../../app";


const buildTicket = async () => {
    const ticket = Ticket.build({title: 'concert', price: 20});
    await ticket.save();
    return ticket;
};

it('fetches orders for an particular user', async () => {
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    const userOne = global.signIn();
    const userTwo = global.signIn();

    await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ticketId: ticketOne.id})
        .expect(201);

    const {body: orderOne} = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ticketId: ticketTwo.id})
        .expect(201);

    const {body: orderTwo} = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ticketId: ticketThree.id})
        .expect(201);

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .expect(200);


    expect(response.body[0]).toMatchObject({
        'id': orderOne.id, 'status': 'created',
        'ticket': {'id': ticketTwo.id, 'price': 20, 'title': 'concert'}
    })

    expect(response.body[1]).toMatchObject({
        'id': orderTwo.id, 'status': 'created',
        'ticket': {'__v': 0, 'id': ticketThree.id, 'price': 20, 'title': 'concert'}
    });
});
