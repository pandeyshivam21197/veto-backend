import inputTypes from '@Graphql/types/inputTypes';
import responseTypes from '@Graphql/types/responseTypes';
import {buildSchema, GraphQLSchema} from 'graphql';

const {userInput, requestInput, entityInput, donationEntityInput} = inputTypes;
const {CampaignRequest, User, DonationHistory, entity, Thumbnails} = responseTypes;

// post Schema - create the data and post to data base (POST, PUT , DELETE, PATCH)
const source = `
${entity}
${userInput}
${Thumbnails}
${CampaignRequest}
${DonationHistory}
${User}
${entityInput}
${requestInput}
${donationEntityInput}

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
    postCampaignDonation(campaignRequestId: String!, entity: DonationEntityInput!): CampaignRequest!
    postCampaignThumbnails(campaignRequestId: String!, thumbnails: Thumbnails): CampaignRequest!
    addOtherCampaignGroupMember(campaignRequestId: String!): User!
    postUserRewards(points: Int!): User!
    postUserMaxDistance(distance: Int!): User!
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
