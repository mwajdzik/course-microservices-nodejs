import express, {Request, Response} from 'express';
import {
    BadRequestError,
    currentUser,
    NotFoundError,
    OrderStatus,
    requireAuth,
    validateRequest
} from '@mwtickets/common';
import {body} from 'express-validator';
import {Ticket} from "../models/ticket";
import {Order} from "../models/order";
import {OrderCreatedPublisher} from "../events/publishers/order-created-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router()
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

const validations = [
    body('ticketId').not().isEmpty()
        .withMessage('ticketId must be supplied')
];

router.post('/api/orders', requireAuth, validations, validateRequest, currentUser, async (req: Request, res: Response) => {
    const {ticketId} = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new NotFoundError();
    }

    if (await ticket.isReserved()) {
        throw new BadRequestError('Ticket is already reserved');
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    })

    await order.save();

    await new OrderCreatedPublisher(natsWrapper.client)
        .publish({
            id: order.id,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            ticket: {id: ticket.id, price: ticket.price}
        })

    res.status(201).send(order);
});

export {router as newOrderRouter};

