const timeStamp: string = `
    createdAt: String!
    updatedAt: String!
`;

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
    userImage: String!
    ${timeStamp}
}
`;

const responseTypes = {User};

export default responseTypes;
