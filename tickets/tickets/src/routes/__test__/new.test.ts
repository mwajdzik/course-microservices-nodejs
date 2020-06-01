import request from 'supertest';
import {app} from '../../app';
import {Ticket} from "../../models/ticket";

it('has a route handler listening to /api/tickets for post requests', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});

    expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
    await request(app)
        .post('/api/tickets')
        .send({})
        .expect(401, '{"errors":[{"message":"Not authorized"}]}');
});

it('returns a status other than 401 if the user is signed in', async () => {
    await global.signIn();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signIn())
        .send({});

    expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signIn())
        .send({title: '', price: 10})
        .expect(400, '{"errors":[{"message":"title must be supplied","field":"title"}]}');

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signIn())
        .send({price: 10})
        .expect(400, '{"errors":[{"message":"title must be supplied","field":"title"}]}');
});

it('returns an error if an invalid price is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signIn())
        .send({title: 'title', price: -10})
        .expect(400, '{"errors":[{"message":"price must be valid","field":"price"}]}');

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signIn())
        .send({title: 'title'})
        .expect(400, '{"errors":[{"message":"price must be valid","field":"price"}]}');
});

it('creates a ticket with valid inputs', async () => {
    const ticketsBefore = await Ticket.find({});
    expect(ticketsBefore.length).toEqual(0);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signIn())
        .send({title: 'title', price: 10})
        .expect(201);

    const ticketsAfter = await Ticket.find({});
    expect(ticketsAfter.length).toEqual(1);
});
