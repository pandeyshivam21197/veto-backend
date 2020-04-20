import {IRequest} from '@Middleware/Auth';
import CampaignRequest, {IDonationEntity} from '@Models/CampaignRequest';
import {CampaignRequestModel, campaignRequestStatus, IEntity, IThumbnail} from '@Models/CampaignRequest';
import User, {UserModel} from '@Models/User';
import {
    error,
    IMessage,
    throwCampaignNotFoundError,
    throwUserNotAuthorized,
    throwUserNotFoundError,
    userErrors,
} from '@Utils/errorUtil';
import {
    getCampaignStatus,
    getUpdatedCampaignResponse, getUpdatedEntities,
    getUpdatedUserResponse,
    isEntitiesValid,
    setThumbnailsType,
    updateEntityAmount, updateUserProperty,
} from '@Utils/resolverUtil';
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

interface ISingIn {
    userInput: UserModel;
}

interface ILogin {
    loginInput: LoginInput;
}

interface IPostCampaign {
    requestInput: CampaignRequestModel;
}

interface IPostCampaignEntity {
    entityInput: IEntity[];
    campaignRequestId: string;
}

interface IPostCampaignDonation {
    campaignRequestId: string;
    entity: IDonationEntity;
}

interface IPostUserRewards {
    points: number;
}

interface IThumbnails {
    thumbnails: IThumbnail[];
}

interface IPostCampaignThumbnails extends IThumbnails {
    campaignRequestId: string;
}

const singIn = async ({userInput}: ISingIn): Promise<UserModel | undefined> => {
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
        return await getUpdatedUserResponse(user);
    } catch (e) {
        error(e.message, e.code, e.data);
    }
};

const login = async ({loginInput}: ILogin): Promise<ILoginResponse | void> => {
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

const postCampaign = async ({requestInput}: IPostCampaign, req: IRequest): Promise<CampaignRequestModel | undefined> => {
    try {
        const {userId} = req;
        throwUserNotAuthorized(req);
        const {title, subTitle, entities} = requestInput;

        const request = new CampaignRequest({title, subTitle, entities});
        const createdRequest = await request.save();

        const {createdAt, updatedAt, _id} = createdRequest;

        const user: UserModel | null = await User.findOne({_id: userId});
        throwUserNotFoundError(user);
        if (user) {
            user.campaignRequestIds.push(_id);
            return await getUpdatedUserResponse(user);
        }
    } catch (e) {
        error(e.message, e.code, e.data);
    }
};
const postCampaignEntity =
    async ({entityInput, campaignRequestId}: IPostCampaignEntity, req: IRequest): Promise<CampaignRequestModel | undefined> => {
        try {
            throwUserNotAuthorized(req);
            const campaignRequest: CampaignRequestModel | null = await CampaignRequest.findOne({_id: Types.ObjectId(campaignRequestId)});
            throwCampaignNotFoundError(campaignRequest);
            if (campaignRequest) {
                if (isEntitiesValid(entityInput)) {
                    const {entities} = campaignRequest;
                    let newEntities = [];
                    if (entities && entities.length > 0) {
                        newEntities = getUpdatedEntities(entities, entityInput)
                    } else {
                        newEntities.push(...entityInput);
                    }

                    campaignRequest.entities = newEntities;
                    return await getUpdatedCampaignResponse(campaignRequest);
                }
            } else {
                error(userErrors.BAD_REQUEST, 400, {message: 'Please add valid requestedAmount'});
            }
        } catch (e) {
            error(e.message, e.code, e.data);
        }
    };

const postCampaignDonation =
    async ({campaignRequestId, entity}: IPostCampaignDonation, req: IRequest): Promise<CampaignRequestModel | undefined> => {
        try {
            const {userId} = req;
            throwUserNotAuthorized(req);
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

                const campaignRequest: CampaignRequestModel | null = await CampaignRequest.findOne({_id: Types.ObjectId(campaignRequestId)});
                throwCampaignNotFoundError(campaignRequest);
                if (campaignRequest) {
                    const {donerIds, entities} = campaignRequest;
                    const donerId = Types.ObjectId(user._id);

                    // Decrease Campaign entity amount and set status if done
                    campaignRequest.entities = updateEntityAmount(entity, entities);
                    // Sets doners id to campaign request
                    campaignRequest.donerIds = [...donerIds, donerId];
                    // Sets campaign status if done
                    campaignRequest.status = getCampaignStatus(campaignRequest);

                    return await getUpdatedCampaignResponse(campaignRequest);
                }
            }
        } catch (e) {
            error(e.message, e.code, e.data);
        }
    }

const postUserRewards = async ({points}: IPostUserRewards, req: IRequest): Promise<UserModel | undefined> => {
    const {userId} = req;
    try {
        throwUserNotAuthorized(req);
        return await updateUserProperty({rewardPoints: points}, userId);
    } catch (e) {
        error(e.message, e.code, e.data);
    }
};

const postCampaignThumbnails = async ({campaignRequestId, thumbnails}: IPostCampaignThumbnails, req: IRequest) => {
    try {
        throwUserNotAuthorized(req);
        const campaignRequest: CampaignRequestModel | null = await CampaignRequest.findOne({_id: Types.ObjectId(campaignRequestId)});
        throwCampaignNotFoundError(campaignRequest);
        if (campaignRequest) {
            campaignRequest.thumbnails = setThumbnailsType(campaignRequest.thumbnails, thumbnails);

            return await getUpdatedCampaignResponse(campaignRequest);
        }
    } catch (e) {
        error(e.message, e.code, e.data);
    }
};

const postUserMaxDistance = async ({distance}: { distance: number }, req: IRequest): Promise<UserModel | undefined> => {
    try {
        const {userId} = req;
        throwUserNotAuthorized(req);
        return await updateUserProperty({maxDistance: distance}, userId);
    } catch (e) {
        error(e.message, e.code, e.data);
    }
}

const addOtherCampaignGroupMember = async ({campaignRequestId}: { campaignRequestId: string }, req: IRequest) => {
    try {
        const {userId} = req;
        throwUserNotAuthorized(req);
        const campaignRequest: CampaignRequestModel | null = await CampaignRequest.findOne({_id: Types.ObjectId(campaignRequestId)});
        if (campaignRequest && userId) {
            campaignRequest.groupMemberIds.push(userId);

            const user: UserModel | null = await User.findOne({_id: userId});
            throwUserNotFoundError(user);
            if (user) {
                user.otherCampaignRequestIds.push(campaignRequest._id);
                return await getUpdatedUserResponse(user);
            }
        }
    } catch (e) {
        error(e.message, e.code, e.data);
    }
}


const resolver = {
    singIn,
    login,
    postCampaign,
    postCampaignEntity,
    postCampaignDonation,
    postUserRewards,
    postCampaignThumbnails,
    postUserMaxDistance,
    addOtherCampaignGroupMember,
};

export default resolver;
