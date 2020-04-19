const timeStamp: string = `
    createdAt: String!
    updatedAt: String!
`;

// Requires entity
const CampaignRequest: string = `
type CampaignRequest {
    title: String!
    subTitle: String
    entities: [entity]
    status: String
    ${timeStamp}
    }
`;

// Requires CampaignRequest
const User: string = `
type User {
name: String!
    username: String!
    email: String!
    password: String!
    location: String!
    idProofType: String!
    idProofImageUrl: String!
    DOB: String!
    contactNumber: String!
    rewardPoints: Int!
    campaignRequestIds: [CampaignRequest]!
    maxDistance: Int!
    ${timeStamp}
}
`;

const responseTypes = {User, CampaignRequest};

export default responseTypes;
