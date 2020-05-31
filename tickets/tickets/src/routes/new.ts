import express, {Request, Response} from 'express';
import {requireAuth, validateRequest} from '@mwtickets/common';
import {body} from 'express-validator';
import {Ticket} from "../models/ticket";

const router = express.Router()

const validations = [
    body('title').not().isEmpty()
        .withMessage('title must be supplied'),
    body('price').isFloat({gt: 0})
        .withMessage('price must be valid')
];

router.post('/api/tickets', requireAuth, validations, validateRequest, async (req: Request, res: Response) => {
    const {title, price} = req.body;
    const ticket = await Ticket
        .build({title, price, userId: req.currentUser!.id})
        .save()

    res.status(201).send(ticket);
});

export {router as newRouter};

