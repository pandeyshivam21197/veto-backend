import express, {Request, Response, NextFunction, ErrorRequestHandler} from 'express';
import {config} from 'dotenv';
import GraphHTTP from 'express-graphql';

import mongoose from 'mongoose';

import schema from '@Graphql/Schema';

import resolver from '@Graphql/Resolver'

import bodyParser from 'body-parser';
import Auth from '@Middleware/Auth';

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
    .connect(MONGODB_URI)
    .then(result => {
        app.listen(port, hostname);
    })
    .catch(err => {
        // tslint:disable-next-line:no-console
        console.log(err);
    });
