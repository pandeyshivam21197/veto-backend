import {buildSchema, GraphQLSchema} from 'graphql';

const postSchema: GraphQLSchema = buildSchema(`
type AuthResponse {
token: String
userId: String!
}
  type Query {
    login(email: String!, password: String!): AuthResponse!
  }
`);

export default postSchema;
