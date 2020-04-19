import {entity} from '@Graphql/types/commonTypes';
import inputTypes from '@Graphql/types/inputTypes';
import responseTypes from '@Graphql/types/responseTypes';
import {buildSchema, GraphQLSchema} from 'graphql';

const {userInput, requestInput, entityInput} = inputTypes;
const {CampaignRequest, User, DonationHistory} = responseTypes;

// post Schema - create the data and post to data base (POST, PUT , DELETE, PATCH)
const source = `
${entity}
${userInput}
${CampaignRequest}
${DonationHistory}
${User}
${entityInput}
${requestInput}

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
    postCampaignEntity(campaignRequestId: String!, entityInput: [entityInput]!): CampaignRequest!
    postUserDonation(campaignRequestId: String!, amount: Int!): User!
    postUserRewards(points: Int!): User!
    }

    type RootQuery {
    hello: String!
    }

schema {
        query: RootQuery
        mutation: RootMutation
    }
`;
const schema: GraphQLSchema = buildSchema(source);

export default schema;
