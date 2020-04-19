const timeStamp: string = `
    createdAt: String!
    updatedAt: String!
`;

// Requires entity Type
const CampaignRequest: string = `
type CampaignRequest {
     _id: ID!
    title: String!
    subTitle: String
    entities: [entity]
    status: String
    ${timeStamp}
    }
`;

// Requires CampaignRequest Type
const User: string = `
type User {
    _id: ID!
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
