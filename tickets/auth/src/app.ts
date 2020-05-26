import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import {currentUserRouter} from "./routes/current-user";
import {signUpRouter} from "./routes/signup";
import {signInRouter} from "./routes/signin";
import {signOutRouter} from "./routes/signout";
import {errorHandler} from "./middlewares/error-handler";
import {NotFoundError} from "./errors/not-found-error";
import cookiesession from "cookie-session";

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(cookiesession({
    signed: false,
    secure: true
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
