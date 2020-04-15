import {buildSchema, GraphQLSchema} from 'graphql';

const getSchema: GraphQLSchema = buildSchema(`
  type Query {
    hello: String
  }
`);

export default getSchema;