const UserInput: string = `
input UserInput {
    name: String!
    username: String!
    email: String!
    password: String!
    location: String!
    idProofType: String!
    contactNumber: String!
    idProofImageUrl: String!
    DOB: String!
}
`;

const EntityInput: string = `
input EntityInput {
    title: String!
    requestedAmount: Int!
    availedAmount: Int
    }
`;

// require entity Input
const RequestInput: string = `
input RequestInput {
    title: String!
    subTitle: String
    entities: [EntityInput]
}
`;

const DonationEntityInput: string = `
input DonationEntityInput {
    title: String!
    amount: Int!
}
`;

const ThumbnailsInput: string = `
input ThumbnailsInput{
    url: String!
    type: String!
    }
`;

const inputTypes = {UserInput, RequestInput, EntityInput, DonationEntityInput, ThumbnailsInput};

export default inputTypes;
