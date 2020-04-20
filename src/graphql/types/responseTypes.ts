const timeStamp: string = `
    createdAt: String!
    updatedAt: String!
`;

// require CampaignRequest type
const DonationHistory: string = `
type DonationHistory {
    campaignRequestId: CampaignRequest!
    donationAmount: String!
}
`;

const entity: string = `
type entity {
    title: String!
    requestedAmount: Int!
    availedAmount: Int!
    currentPrice: String!
    status: String!
    }
`;

const Thumbnails: string = `
type Thumbnails {
    url: String!
    type: String!
    }
`;

// Requires entity Type and User Type
const CampaignRequest: string = `
type CampaignRequest {
     _id: ID!
    title: String!
    subTitle: String!
    entities: [entity]!
    status: String!
    donerIds: [User]!
    groupMemberIds: [User]!
    thumbnails: [Thumbnails]!
    description: String!
    ${timeStamp}
    }
`;

// Requires CampaignRequest Type and Donation History Type
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
    otherCampaignRequestIds: [CampaignRequest]!
    donationHistory: [DonationHistory]!
    maxDistance: Int!
    ${timeStamp}
}
`;

const responseTypes = {User, CampaignRequest, DonationHistory, entity, Thumbnails};

export default responseTypes;
