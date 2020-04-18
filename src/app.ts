import express, {Request, Response, NextFunction, ErrorRequestHandler} from 'express';
import {config} from 'dotenv';
// @ts-ignore
import graphqlHTTP from 'express-graphql';

import getSchema from '@Graphql/schemas/getSchema';
import postSchema from '@Graphql/schemas/postSchema';

import getResolver from '@Graphql/resolvers/getResolver'
import postResolver from '@Graphql/resolvers/postResolver'

import bodyParser from 'body-parser';
import Auth from './middlewares/Auth';

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

// check for authentication and set isAuth and userId(object id)
app.use(Auth);

app.post(
    '/graphql',
    graphqlHTTP({
        schema: postSchema,
        rootValue: getResolver,
        graphiql: false,
    }),
);


app.get(
    '/graphql',
    graphqlHTTP({
        schema: getSchema,
        rootValue: getResolver,
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

app.listen(port, hostname, (error: string) => {
    if (error) {
        // tslint:disable-next-line:no-console
        return console.log(error)
    }
    // tslint:disable-next-line:no-console
    return console.log(`server is listening on ${port}`)
});
