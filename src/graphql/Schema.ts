import {buildSchema, GraphQLSchema} from 'graphql';
import inputTypes from '@Graphql/types/inputTypes';
import responseTypes from '@Graphql/types/responseTypes';
import {entity} from '@Graphql/types/commonTypes';


const {userInput, requestInput, entityInput} = inputTypes;
const {CampaignRequest, User} = responseTypes;

// post Schema - create the data and post to data base (POST, PUT , DELETE, PATCH)
const schema: GraphQLSchema = buildSchema(`
${entity}
${userInput}
${User}
${requestInput}
${CampaignRequest}
${entityInput}

type AuthResponse {
token: String!
userId: String!
}

input loginInput {
email: String!
password: String!
}

 type RootMutation {
    singIn(userInput: userInput!): User!
    login(loginInput: loginInput!): AuthResponse!
    postCampaign(requestInput: requestInput!): CampaignRequest!
    postCampaignEntity(entityInput: [entityInput]!): CampaignRequest!
    }

schema {
        mutation: RootMutation
    }
`);

export default schema;
