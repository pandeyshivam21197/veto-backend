import {buildSchema, GraphQLSchema} from 'graphql';
import inputs from '@Graphql/inputs';
import responses from '@Graphql/responses';
import {entity} from '@Graphql/./commonTypes';


const {userInput, requestInput, entityInput} = inputs;
const {CampaignRequest, User} = responses;

// post Schema - create the data and post to data base (POST, PUT , DELETE, PATCH)
const postSchema: GraphQLSchema = buildSchema(`
${entity}
${userInput}
${User}
${requestInput}
${CampaignRequest}
${entityInput}

 type RootMutation {
    singIn(userInput: userInput): User
    postCampaign(requestInput: requestInput): CampaignRequest
    postCampaignEntity(entityInput: [entityInput]): CampaignRequest
    }

 schema {
          mutation: RootMutation
      }
`);

export default postSchema;
