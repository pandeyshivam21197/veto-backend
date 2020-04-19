import {Request} from 'express';
import bcrypt from 'bcryptjs';
import User, {UserModel} from '@Models/User';
import CampaignRequest from '@Models/CampaignRequest';
import {CampaignRequestModel, IEntity} from '@Models/CampaignRequest';
import {error, userErrors} from '@Utils/errorUtil';
import jwt from 'jsonwebtoken';

interface ILoginResponse {
    token: string;
    userId: string;
}

interface LoginInput {
    email: string;
    password: string;
}

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
    const {createdAt, updatedAt} = createdUser;

    return {...createdUser._doc, createdAt: createdAt.toString, updatedAt: updatedAt.toString()}
};

const login = async ({loginInput}: {loginInput: LoginInput}): Promise<ILoginResponse | void> => {
    console.log('coming inside login!!!', loginInput);
    const {email, password} = loginInput;
    const user: UserModel | null = await User.findOne({email} || {username: email});
    if (!user) {
        error(userErrors.USER_NOT_FOUND, 401);
        return;
    }
    const isEqual: boolean = await bcrypt.compare(password, user.password);
    if (!isEqual) {
        error(userErrors.INCORRECT_PASSWORD, 401);
        return;
    }
    const secretKey: string | undefined = process.env.JWT_SECRET;
    const tokenExpiry: string | undefined = process.env.TOKEN_EXPIRY;

    if (!secretKey) {
        error(userErrors.SECRET_KEY_ERROR, 500);
        return;
    }
    const token: string = jwt.sign(
        {
            userId: user._id.toString(),
            email: user.email,
        },
        secretKey,
        {expiresIn: tokenExpiry || '1d'},
    );
    return {token, userId: user._id.toString()};
};

const postCampaign = async ({requestInput}: { requestInput: CampaignRequestModel }, req: Request) => {
    const {title, subTitle, entities} = requestInput;
    const  data: [any]= [title];
    if(subTitle) {
        data.push(subTitle);
    }
    if(entities) {
        data.push(entities)
    }

    const request = new CampaignRequest({...data});
    const createdRequest = await request.save();

    const {createdAt, updatedAt} = createdRequest;

    return {...createdRequest._doc, createdAt: createdAt.toString(), updatedAt: updatedAt.toString()};
};
const postCampaignEntity = ({entityInput}: { entityInput: [IEntity] }, req: Request) => {
    // TODO: add logic

};


const resolver = {singIn, login, postCampaign, postCampaignEntity};

export default resolver;
