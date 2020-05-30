import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import {currentUserRouter} from "./routes/current-user";
import {signUpRouter} from "./routes/signup";
import {signInRouter} from "./routes/signin";
import {signOutRouter} from "./routes/signout";
import cookiesession from "cookie-session";
import {errorHandler, NotFoundError} from "@mwtickets/common";

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(cookiesession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);

app.all('*', () => {
    throw new NotFoundError();
})

app.use(errorHandler);

export {app}
