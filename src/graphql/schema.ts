import inputTypes from '@Graphql/types/inputTypes';
import responseTypes from '@Graphql/types/responseTypes';
import {buildSchema, GraphQLSchema} from 'graphql';

const {UserInput, RequestInput, EntityInput, DonationEntityInput, ThumbnailsInput} = inputTypes;
const {CampaignRequest, User, DonationHistory, Entity, ThumbnailsType} = responseTypes;

// post Schema - create the data and post to data base (POST, PUT , DELETE, PATCH)
const source = `
${Entity}
${UserInput}
${ThumbnailsInput}
${ThumbnailsType}
${CampaignRequest}
${DonationHistory}
${User}
${EntityInput}
${RequestInput}
${DonationEntityInput}

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
    postCampaign(requestInput: RequestInput!): CampaignRequest!
    postCampaignEntity(campaignRequestId: String!, entityInput: [EntityInput]!): CampaignRequest!
    postCampaignDonation(campaignRequestId: String!, entity: DonationEntityInput!): CampaignRequest!
    postCampaignThumbnails(campaignRequestId: String!, thumbnails: [ThumbnailsInput]!): CampaignRequest!
    addCampaignGroupMember(campaignRequestId: String!): CampaignRequest!
    postCampaignCompletionDescription(campaignRequestId: String!, description: String!): CampaignRequest!
    postUserRewards(points: Int!): User!
    postUserMaxDistance(distance: Int!): User!
    getRequestedCampaign(campaignRequestId: String!): CampaignRequest!
    }

    type RootQuery {
    getCampaignRequests: [CampaignRequest]!
    getUserData: User!
    }

schema {
        query: RootQuery
        mutation: RootMutation
    }
`;
const schema: GraphQLSchema = buildSchema(source);

export default schema;
