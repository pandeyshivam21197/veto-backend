import {buildSchema, GraphQLSchema} from 'graphql';

// get Schema - check for any data queried for and simply returned it (GET)
const getSchema: GraphQLSchema = buildSchema(`
type AuthResponse {
token: String
userId: String!
}
  type RootQuery {
    login(email: String!, password: String!): AuthResponse!
  }

  schema {
          query: RootQuery

      }
`);

export default getSchema;
