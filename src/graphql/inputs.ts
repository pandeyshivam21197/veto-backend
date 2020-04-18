import {entity} from '@Graphql/./commonTypes';

const userInput: string = `
input userInput {
    name: String!
    username: String!
    email: String!
    password: String!
    location: String!
    idProofType: String!
    idProofImageUrl: String!
    DOB: String!
}
`;

const entityInput: string = `
input entityInput {
    title: String!
    requestedAmount: Int!
    availedAmount: Int
    }
`;

// require entity
const requestInput: string = `
input requestInput {
    title: String!
    subTitle: String
    entities: [entity]
}
`;

const inputs = {userInput, requestInput, entityInput};

export default inputs;
