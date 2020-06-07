import request from 'supertest';
import {app} from '../../app';
import mongoose from "mongoose";
import {natsWrapper} from "../../nats-wrapper";

it('returns a 404 if the provided id does not exist', async () => {
    await request(app)
        .put(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
        .set('Cookie', global.signIn())
        .send({title: 'Title', price: 20})
        .expect(404, '{"errors":[{"message":"Not found"}]}');
});

it('returns a 401 if the user is not authenticated', async () => {
    await request(app)
        .put(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
        .send({title: 'Title', price: 20})
        .expect(401, '{"errors":[{"message":"Not authorized"}]}');
});

it('returns a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signIn())
        .send({title: 'Title', price: 20});

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signIn())
        .send({title: 'New Title', price: 25})
        .expect(401, '{"errors":[{"message":"Not authorized"}]}');
});

it('returns a 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signIn();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({title: 'Title', price: 20});

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({title: '', price: -10})
        .expect(400, '{"errors":[' +
            '{"message":"title must be supplied","field":"title"},' +
            '{"message":"price must be valid","field":"price"}' +
            ']}');
});

it('updates the ticket provided valid inputs', async () => {
    const cookie = global.signIn();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({title: 'Title', price: 20});

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({title: 'New Title', price: 25})
        .expect(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual('New Title');
    expect(ticketResponse.body.price).toEqual(25);
});

it('publishes an event', async () => {
    const cookie = global.signIn();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({title: 'Title', price: 20});

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({title: 'New Title', price: 25})
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
