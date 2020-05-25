import express, {Request, Response} from 'express';
import {body, validationResult} from 'express-validator';
import {RequestValidationError} from "../errors/request-validation-error";
import {User} from "../models/user";
import {BadRequestError} from "../errors/bad-request-error";
import jwt from 'jsonwebtoken';

const router = express.Router()

const validations = [
    body('email').isEmail()
        .withMessage('email must be valid'),
    body('password').trim().isLength({min: 4, max: 20})
        .withMessage('password must be between 4 and 20 characters')
];

router.post('/api/users/signup', validations, async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }

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
