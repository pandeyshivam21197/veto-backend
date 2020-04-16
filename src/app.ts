import express from 'express';
import {config} from 'dotenv';
// @ts-ignore
import graphqlHTTP from 'express-graphql';
import getSchema from '@Graphql/schemas/getSchema';

import postSchema from '@Graphql/schemas/postSchema';

import bodyParser from 'body-parser';

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.post(
    '/graphql',
    graphqlHTTP({
        schema: postSchema,
        graphiql: false,
    }),
);


app.get(
    '/graphql',
    graphqlHTTP({
        schema: getSchema,
        graphiql: true,
    }),
);

config();
const port: number = Number(process.env.PORT) || 3000;
const hostname: string = process.env.HOST || 'localhost';

app.listen(port, hostname,  (error: string) => {
    if (error) {
        // tslint:disable-next-line:no-console
        return console.log(error)
    }
    // tslint:disable-next-line:no-console
    return console.log(`server is listening on ${port}`)
});
