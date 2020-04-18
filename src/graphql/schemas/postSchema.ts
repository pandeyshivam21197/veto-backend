import {buildSchema, GraphQLSchema} from 'graphql';
import inputs from '@Graphql/inputs';

// post Schema - create the data and post to data base (POST, PUT , DELETE, PATCH)
const postSchema: GraphQLSchema = buildSchema(`
 type RootMutation {
    singIn(userInput: ${inputs.userInput}): any
    }

 schema {
          mutation: RootMutation
      }
`);

export default postSchema;
