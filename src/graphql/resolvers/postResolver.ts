import {Request} from 'express';

// TODO: add types
const singIn = ({userInput}: {userInput: any}, req: Request) => {
    const {} = userInput;
};
const postCampaign = ({requestInput}: {requestInput: any}, req: Request) => {
    const {} = requestInput;

};
const postCampaignEntity = ({entityInput}: {entityInput: any}, req: Request) => {
    const {} = entityInput;

};


const postResolver = {singIn, postCampaign, postCampaignEntity};

export default postResolver;
