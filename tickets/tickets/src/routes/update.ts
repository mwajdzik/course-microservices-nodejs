import express, {Request, Response} from 'express';
import {Ticket} from "../models/ticket";
import {NotAuthorizedError, NotFoundError, requireAuth, validateRequest} from "@mwtickets/common";
import {body} from "express-validator";
import {TicketCreatedPublisher} from "../events/publishers/ticket-created-publisher";
import {natsWrapper} from "../nats-wrapper";
import {TicketUpdatedPublisher} from "../events/publishers/ticket-updated-publisher";

const router = express.Router()

const validations = [
    body('title').not().isEmpty()
        .withMessage('title must be supplied'),
    body('price').isFloat({gt: 0})
        .withMessage('price must be valid')
];

router.put('/api/tickets/:id', requireAuth, validations, validateRequest, async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        throw new NotFoundError();
    }

    if (ticket.userId != req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price
    })

    await ticket.save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
    });

    res.status(200).send(ticket);
});

export {router as updateRouter};
