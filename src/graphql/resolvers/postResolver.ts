import {Request} from 'express';
import bcrypt from 'bcryptjs';
import User, {UserModel} from '@Models/User';
import {CampaignRequestModel, IEntity} from '@Models/CampaignRequest';

const singIn = async ({userInput}: { userInput: UserModel }, req: Request) => {
    const {username, name, password, email, location, idProofImageUrl, idProofType, DOB, contactNumber} = userInput;
    const encodedPassword = await bcrypt.hash(password, 12);

    const user = new User(
        {
            username,
            name,
            password: encodedPassword,
            email,
            location,
            idProofImageUrl,
            idProofType,
            DOB,
            contactNumber,
        },
    );

    const createdUser: UserModel = await user.save();
    return {...createdUser._doc, }
};
const postCampaign = ({requestInput}: { requestInput: CampaignRequestModel }, req: Request) => {
    // TODO: add logic
    const {title, subTitle, entities} = requestInput;

};
const postCampaignEntity = ({entityInput}: { entityInput: [IEntity] }, req: Request) => {
    // TODO: add logic

};


const postResolver = {singIn, postCampaign, postCampaignEntity};

export default postResolver;
