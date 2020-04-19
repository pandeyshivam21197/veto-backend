import {IRequest} from '@Middleware/Auth';
import CampaignRequest, {IDonationEntity} from '@Models/CampaignRequest';
import {CampaignRequestModel, IEntity} from '@Models/CampaignRequest';
import User, {UserModel} from '@Models/User';
import {error, IMessage, throwCampaignNotFoundError, throwUserNotFoundError, userErrors} from '@Utils/errorUtil';
import {getEntities, isEntitiesValid, updateEntityAmount} from '@Utils/resolverUtil';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {Types} from 'mongoose';
import validator from 'validator';

interface ILoginResponse {
    token: string;
    userId: string;
}

interface LoginInput {
    email: string;
    password: string;
}

const singIn = async ({userInput}: { userInput: UserModel }): Promise<UserModel | undefined> => {
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
            // @ts-ignore
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
        throwUserNotFoundError(user);
        if (user) {
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
        }
    } catch (e) {
        error(e.message, e.code, e.data);
    }
};

const postCampaign = async ({requestInput}: { requestInput: CampaignRequestModel }, req: IRequest): Promise<CampaignRequestModel | undefined> => {
    try {
        const {isAuth, userId} = req;
        if (isAuth) {
            const {title, subTitle, entities} = requestInput;

            const request = new CampaignRequest({title, subTitle, entities});
            const createdRequest = await request.save();

            const {createdAt, updatedAt, _id} = createdRequest;

            const user: UserModel | null = await User.findOne({_id: userId});
            throwUserNotFoundError(user);
            if (user) {
                if (user.campaignRequestIds) {
                    user.campaignRequestIds.push(_id);
                } else {
                    user.campaignRequestIds = [_id];
                }
            }

            return {
                // @ts-ignore
                ...createdRequest._doc,
                createdAt: createdAt.toString(),
                updatedAt: updatedAt.toString(),
                _id: _id.toString(),
            };
        } else {
            error(userErrors.USR_NOT_AUTHORIZED, 401);
        }
    } catch (e) {
        error(e.message, e.code, e.data);
    }
};
const postCampaignEntity =
    async ({entityInput, campaignRequestId}: { entityInput: IEntity[], campaignRequestId: string }, req: IRequest): Promise<CampaignRequestModel | undefined> => {
        try {
            const {isAuth} = req;
            if (isAuth) {
                const campaignRequest: CampaignRequestModel | null = await CampaignRequest.findOne({_id: Types.ObjectId(campaignRequestId)});
                throwCampaignNotFoundError(campaignRequest);
                if (campaignRequest) {
                    if (isEntitiesValid(entityInput)) {
                        const {entities} = campaignRequest;
                        let newEntities = [];
                        if (entities && entities.length > 0) {
                            newEntities = getEntities(entities, entityInput)
                        } else {
                            newEntities.push(...entityInput);
                        }

                        campaignRequest.entities = newEntities;
                        const updatedCampaign = await campaignRequest.save();
                        const {createdAt, updatedAt, _id} = updatedCampaign;

                        return {
                            // @ts-ignore
                            ...updatedCampaign._doc,
                            createdAt: createdAt.toString(),
                            updatedAt: updatedAt.toString(),
                            _id: _id.toString(),
                        };
                    }
                } else {
                    error(userErrors.BAD_REQUEST, 400, {message: 'Please add valid requestedAmount'});
                }
            } else {
                error(userErrors.USR_NOT_AUTHORIZED, 401);
            }
        } catch (e) {
            error(e.message, e.code, e.data);
        }
    };

const postCampaignDonation = async ({campaignRequestId, entity}: { campaignRequestId: string, entity: IDonationEntity }, req: IRequest): Promise<CampaignRequestModel | undefined> => {
    try {
        const {isAuth, userId} = req;
        if (isAuth) {
            const {amount} = entity;
            const user: UserModel | null = await User.findOne({_id: userId});
            throwUserNotFoundError(user);
            // Set user donation history to a particular Campaign Request
            if (user) {
                if (user.donationHistory) {
                    user.donationHistory.push({
                        campaignRequestId: Types.ObjectId(campaignRequestId),
                        donationAmount: amount,
                    })
                } else {
                    user.donationHistory = [{
                        campaignRequestId: Types.ObjectId(campaignRequestId),
                        donationAmount: amount,
                    }];
                }
                user.rewardPoints = user.rewardPoints + 1;
                await user.save();
            }
            // Decrease Campaign entity amount
            const campaignRequest = await CampaignRequest.findOne({_id: Types.ObjectId(campaignRequestId)});
            throwCampaignNotFoundError(campaignRequest);
            if (campaignRequest) {
                campaignRequest.entities = updateEntityAmount(entity, campaignRequest.entities);
                await campaignRequest.save();

                const {createdAt, updatedAt, _id} = campaignRequest;
                return {
                    // @ts-ignore
                    ...campaignRequest._doc,
                    createdAt: createdAt.toString(),
                    updatedAt: updatedAt.toString(),
                    _id: _id.toString(),
                }
            }
        } else {
            error(userErrors.USR_NOT_AUTHORIZED, 401);
        }
    } catch (e) {
        error(e.message, e.code, e.data);
    }
}

const postUserRewards = async ({points}: { points: number }, req: IRequest): Promise<UserModel | undefined> => {
    const {isAuth, userId} = req;
    if (isAuth) {
        const user: UserModel | null = await User.findOne({_id: userId});
        throwUserNotFoundError(user);
        if (user) {
            user.rewardPoints = points;
            const updatedUser = await user.save();

            const {createdAt, updatedAt, _id} = updatedUser;
            return {
                // @ts-ignore
                ...updatedUser._doc,
                createdAt: createdAt.toString(),
                updatedAt: updatedAt.toString(),
                _id: _id.toString(),
            }
        }
    } else {
        error(userErrors.USR_NOT_AUTHORIZED, 401);
    }
};


const resolver = {singIn, login, postCampaign, postCampaignEntity, postCampaignDonation, postUserRewards};

export default resolver;
