import {buildSchema, GraphQLSchema} from 'graphql';

const postSchema: GraphQLSchema = buildSchema(`
  type Query {
    hello: String
  }
`);

export default postSchema;