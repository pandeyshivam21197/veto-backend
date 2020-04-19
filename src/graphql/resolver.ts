import {Request} from 'express';
import bcrypt from 'bcryptjs';
import User, {UserModel} from '@Models/User';
import CampaignRequest from '@Models/CampaignRequest';
import {CampaignRequestModel, IEntity} from '@Models/CampaignRequest';
import {error, IMessage, userErrors} from '@Utils/errorUtil';
import jwt from 'jsonwebtoken';
import {Types} from 'mongoose';
import {getEntities, isEntitiesValid} from '@Utils/resolverUtil';
import validator from 'validator';

interface ILoginResponse {
    token: string;
    userId: string;
}

interface LoginInput {
    email: string;
    password: string;
}

const singIn = async ({userInput}: { userInput: UserModel }, req: Request) => {
    try {
        const {username, name, password, email, location, idProofImageUrl, idProofType, DOB, contactNumber} = userInput;
        const encodedPassword = await bcrypt.hash(password, 12);
        const errors: IMessage[] = [];

        if (!validator.isEmail(email)) {
            errors.push({message: userErrors.INVALID_EMAIL});
        }
        if (!validator.isEmail(email)) {
            errors.push({message: userErrors.INVALID_EMAIL});
        }
        if (validator.isEmpty(password) || !validator.isLength(password, {min: 5})) {
            errors.push({message: userErrors.INCORRECT_PASSWORD});
        }
        if (errors.length > 0) {
            error(userErrors.BAD_REQUEST, 400, errors);
        }

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
        const {createdAt, updatedAt, _id} = createdUser;

        return {
            ...createdUser._doc,
            createdAt: createdAt.toString,
            updatedAt: updatedAt.toString(),
            _id: _id.toString(),
        }
    } catch (e) {
        error(e.message, e.code, e.data);
    }
};

const login = async ({loginInput}: { loginInput: LoginInput }): Promise<ILoginResponse | void> => {
    try {
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
    } catch (e) {
        error(e.message, e.code, e.data);
    }
};

const postCampaign = async ({requestInput}: { requestInput: CampaignRequestModel }, req: Request) => {
    try {
        const {title, subTitle, entities} = requestInput;

        const request = new CampaignRequest({title, subTitle, entities});
        const createdRequest = await request.save();

        const {createdAt, updatedAt, _id} = createdRequest;

        return {
            // @ts-ignore
            ...createdRequest._doc,
            createdAt: createdAt.toString(),
            updatedAt: updatedAt.toString(),
            _id: _id.toString(),
        };
    } catch (e) {
        error(e.message, e.code, e.data);
    }
};
const postCampaignEntity =
    async ({entityInput, campaignRequestId}: { entityInput: IEntity[], campaignRequestId: string }, req: Request) => {
        const campaign: CampaignRequestModel | null = await CampaignRequest.findOne({_id: Types.ObjectId(campaignRequestId)});
        if (!campaign) {
            const {BAD_REQUEST, REQUEST_NOT_FOUND} = userErrors;
            error(BAD_REQUEST + REQUEST_NOT_FOUND, 400, {message: 'wrong campaignRequestId'});
            return;
        }
        if (isEntitiesValid(entityInput)) {
            const {entities} = campaign;
            let newEntities = [];
            if (entities && entities.length > 0) {
                newEntities = getEntities(entities, entityInput)
            } else {
                newEntities.push(...entityInput);
            }

            campaign.entities = newEntities;
            const updatedCampaign = await campaign.save();
            const {createdAt, updatedAt, _id} = updatedCampaign;

            return {
                // @ts-ignore
                ...updatedCampaign._doc,
                createdAt: createdAt.toString(),
                updatedAt: updatedAt.toString(),
                _id: _id.toString(),
            };
        } else {
            error(userErrors.BAD_REQUEST, 400, {message: 'Please add valid requestedAmount'});
        }
    };


const resolver = {singIn, login, postCampaign, postCampaignEntity};

export default resolver;
