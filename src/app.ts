import express from 'express';
import {config} from 'dotenv';
// @ts-ignore
import graphqlHTTP from 'express-graphql';
import getSchema from './graphql/schemas/getSchema';

import postSchema from './graphql/schemas/postSchema';

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
const port: number = Number(process.env['PORT']) || 3000;
const hostname: string = process.env['HOST'] || 'localhost';

app.listen(port, hostname,  (error: string) => {
    if (error) {
        return console.log(error)
    }
    return console.log(`server is listening on ${port}`)
});