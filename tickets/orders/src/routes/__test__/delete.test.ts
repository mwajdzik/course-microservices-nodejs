import request from 'supertest';
import {Ticket} from "../../models/ticket";
import {app} from "../../app";
import {Order} from "../../models/order";
import {OrderStatus} from "@mwtickets/common";
import {natsWrapper} from "../../nats-wrapper";

it('marks an order as cancelled', async () => {
    const ticket = Ticket.build({title: 'concert', price: 20});
    await ticket.save();

    const user = global.signIn();

    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
