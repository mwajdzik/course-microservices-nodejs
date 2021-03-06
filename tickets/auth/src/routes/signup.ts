import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import {User} from "../models/user";
import jwt from 'jsonwebtoken';
import {validateRequest, BadRequestError} from "@mwtickets/common";

const router = express.Router()

const validations = [
    body('email').isEmail()
        .withMessage('email must be valid'),
    body('password').trim().isLength({min: 4, max: 20})
        .withMessage('password must be between 4 and 20 characters')
];

router.post('/api/users/signup', validations, validateRequest, async (req: Request, res: Response) => {
    const {email, password} = req.body;
    const userExists = await User.findOne({email});

    if (userExists) {
        throw new BadRequestError('User already exists');
    }

    const user = User.build({email, password});
    await user.save()

    const userJwt = jwt.sign({id: user.id, email: user.email}, process.env.JWT_KEY!);
    req.session = {jwt: userJwt};

    res.status(201).send(user);
});

export {router as signUpRouter};
