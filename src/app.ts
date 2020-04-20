import {config} from 'dotenv';
import express, {ErrorRequestHandler, NextFunction, Request, Response} from 'express';
// @ts-ignore
import GraphHTTP from 'express-graphql';

import mongoose from 'mongoose';

import schema from '@Graphql/schema';

import resolver from '@Graphql/resolver'

import Auth from '@Middleware/Auth';
import bodyParser from 'body-parser';

const MONGODB_URI =
    'mongodb+srv://shivam2:atria21197@cluster0-0drmr.mongodb.net/food?retryWrites=true&w=majority';

interface IMessage {
    message: string;
}

interface IRestError extends IMessage {
    statusCode: number;
    data: [IMessage] | IMessage;
}

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); // application/json


app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE',
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// check for authentication and set isAuth and userId(object id)
app.use(Auth);

app.use(
    '/graphql',
    GraphHTTP({
        schema,
        rootValue: resolver,
        graphiql: true,
        formatError(err: Error) {
            console.log(err, 'error##');
            if (!err.originalError) {
                return err;
            }
            const data = err.originalError.data;
            const message = err.message || 'An error occurred.';
            const code = err.originalError.code || 500;
            return { message, status: code, data };
        },
    }),
);

app.use((error: IRestError, req: Request, res: Response, next: NextFunction): void => {
    const status: number = error.statusCode || 500;
    const message: string = error.message;
    const data: IMessage | [IMessage] = error.data;
    res.status(status).json({message, data});
});

config();
const port: number = Number(process.env.PORT) || 3000;
const hostname: string = process.env.HOST || 'localhost';

mongoose
    .connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(result => {
        app.listen(port, hostname, () => {
            // tslint:disable-next-line:no-console
            console.log('connected on ' + port);
        });
    })
    .catch(err => {
        // tslint:disable-next-line:no-console
        console.log(err);
    });
