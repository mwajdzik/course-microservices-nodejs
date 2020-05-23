import express, {Request, Response} from 'express';
import {body, validationResult} from 'express-validator';
import {RequestValidationError} from "../errors/request-validation-error";

const router = express.Router()

const validations = [
    body('email').isEmail()
        .withMessage('email must be valid'),
    body('password').trim().isLength({min: 4, max: 20})
        .withMessage('password must be between 4 and 20 characters')
];

router.post('/api/users/signup', validations, (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }

    const {email, password} = req.body;

    res.send({});
});

export {router as signUpRouter};
