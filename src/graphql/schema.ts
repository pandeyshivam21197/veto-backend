import inputTypes from '@Graphql/types/inputTypes';
import responseTypes from '@Graphql/types/responseTypes';
import {buildSchema, GraphQLSchema} from 'graphql';

const {UserInput} = inputTypes;
const {User} = responseTypes;

// post Schema - create the data and post to data base (POST, PUT , DELETE, PATCH)
const source = `
${UserInput}
${User}

type AuthResponse {
token: String!
userId: String!
}

input loginInput {
email: String!
password: String!
}

 type RootMutation {
    singIn(userInput: UserInput!): User!
    login(loginInput: loginInput!): AuthResponse!
    }

    type RootQuery {
    getUserData: User!
    getAuthConfirmation: Boolean!
    }

schema {
        query: RootQuery
        mutation: RootMutation
    }
`;
const schema: GraphQLSchema = buildSchema(source);

export default schema;
