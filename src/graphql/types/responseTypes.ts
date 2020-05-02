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

const Entity: string = `
type Entity {
    title: String!
    requestedAmount: Int!
    availedAmount: Int!
    unitType: String!
    currentPrice: String!
    currency: String!
    status: String!
    }
`;

// Requires entity Type and User Type
const CampaignRequest: string = `
type CampaignRequest {
     _id: ID!
    title: String!
    subTitle: String!
    entities: [Entity]!
    status: String!
    creatorId: User!
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
    joinedCampaignIds: [CampaignRequest]!
    donationHistory: [DonationHistory]!
    maxDistance: Int!
    ${timeStamp}
}
`;

const ThumbnailsType: string = `
type Thumbnails{
    url: String!
    type: String!
    }
`;

const responseTypes = {User, CampaignRequest, DonationHistory, Entity, ThumbnailsType};

export default responseTypes;
