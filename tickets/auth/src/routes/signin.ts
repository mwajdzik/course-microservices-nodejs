import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import {User} from "../models/user";
import {BadRequestError} from "../errors/bad-request-error";
import jwt from 'jsonwebtoken';
import {validateRequest} from "../middlewares/validate-request";
import {PasswordManager} from "../services/password-manager";

const router = express.Router()

const validations = [
    body('email').isEmail()
        .withMessage('email must be valid'),
    body('password').trim().notEmpty()
        .withMessage('password must be supplied')
];

router.post('/api/users/signin', validations, validateRequest, async (req: Request, res: Response) => {
    const {email, password} = req.body;
    const existingUser = await User.findOne({email});

    if (!existingUser) {
        throw new BadRequestError('User does not exist');
    }

    const passwordsMatch = await PasswordManager.compare(existingUser.password, password);

    if (!passwordsMatch) {
        throw new BadRequestError('Invalid credentials');
    }

    const userJwt = jwt.sign({id: existingUser.id, email: existingUser.email}, process.env.JWT_KEY!);
    req.session = {jwt: userJwt};

    res.status(200).send(existingUser);
});

export {router as signInRouter};
