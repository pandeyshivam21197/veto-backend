const CampaignRequest: string = `
type CampaignRequest {
    title: string
    subTitle?: string
    entities?: [IEntity]
    status?: string
    }
`;

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
    rewardPoints?: Number
    campaignRequestIds?: [${CampaignRequest}]
    maxDistance?: Number
}
`;

const responses = {User, CampaignRequest};

export default responses;
