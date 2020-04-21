import CampaignRequest, {
    CampaignRequestModel,
    campaignRequestStatus,
    IDonationEntity,
    IEntity,
    IThumbnail
} from '@Models/CampaignRequest';
import User, {UserModel} from '@Models/User';
import {
    error,
    IMessage,
    IRequest,
    throwCampaignNotFoundError,
    throwUserNotAuthorized,
    throwUserNotFoundError,
    userErrors,
} from '@Utils/errorUtil';
import {
    getCampaignStatus,
    getUpdatedCampaignResponse,
    getUpdatedEntities,
    getUpdatedUserResponse,
    isEntitiesValid,
    isUserAlreadyJoined,
    setThumbnailsType,
    updateEntityAmount,
    updateUserProperty,
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

interface IPostCampaignEntity extends ICampaignRequestId {
    entityInput: IEntity[];
}

interface IPostCampaignDonation extends ICampaignRequestId {
    entity: IDonationEntity;
}

interface IPostUserRewards {
    points: number;
}

interface IThumbnails {
    thumbnails: IThumbnail[];
}

interface ICampaignRequestId {
    campaignRequestId: string;
}

interface IPostCampaignDescription extends ICampaignRequestId {
    description: string;
}

interface IPostCampaignThumbnails extends IThumbnails, ICampaignRequestId {
}

const pageLimit: number = 10;

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

        const existedUser: UserModel | null = await User.findOne({$or: [{email}, {username: email}]});

        if (existedUser) {
            error(userErrors.USER_ALREADY_EXISTED, 401, {message: 'please use different username or email'});
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
        await user.save();

        return getUpdatedUserResponse(user);
    } catch (e) {
        error(e.message, e.code, e.data);
    }
};

const login = async ({loginInput}: ILogin): Promise<ILoginResponse | void> => {
    try {
        const {email, password} = loginInput;
        const user: UserModel | null = await User.findOne({$or: [{email}, {username: email}]});
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

const postCampaign =
    async ({requestInput}: IPostCampaign, req: IRequest): Promise<CampaignRequestModel | undefined> => {
        try {
            const {userId} = req;
            throwUserNotAuthorized(req);
            const {title, subTitle, entities} = requestInput;

            const request = new CampaignRequest({title, subTitle, entities});
            const createdRequest = await request.save();

            const {_id} = createdRequest;

            const user: UserModel | null = await User.findOne({_id: userId});
            throwUserNotFoundError(user);
            if (user) {
                user.campaignRequestIds.push(_id);
                createdRequest.creatorId = user._id;
                const updatedCampaign = await createdRequest.save();
                // populates the creator id
                await updatedCampaign.populate('creatorId').execPopulate();

                return getUpdatedCampaignResponse(updatedCampaign);
            }
        } catch (e) {
            error(e.message, e.code, e.data);
        }
    };
const postCampaignEntity =
    async (
        {entityInput, campaignRequestId}: IPostCampaignEntity,
        req: IRequest,
    ): Promise<CampaignRequestModel | undefined> => {
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
                    const updatedCampaign = await campaignRequest.save();

                    return getUpdatedCampaignResponse(updatedCampaign);
                }
            } else {
                error(userErrors.BAD_REQUEST, 400, {message: 'Please add valid requestedAmount'});
            }
        } catch (e) {
            error(e.message, e.code, e.data);
        }
    };

const postCampaignDonation =
    async (
        {campaignRequestId, entity}: IPostCampaignDonation,
        req: IRequest,
    ): Promise<CampaignRequestModel | undefined> => {
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

                const campaignRequest: CampaignRequestModel | null =
                    await CampaignRequest.findOne({_id: Types.ObjectId(campaignRequestId)});

                throwCampaignNotFoundError(campaignRequest);
                if (campaignRequest) {
                    const {donerIds, entities} = campaignRequest;
                    // Decrease Campaign entity amount and set status if done
                    campaignRequest.entities = updateEntityAmount(entity, entities);
                    // Sets doners id to campaign request
                    campaignRequest.donerIds = [...donerIds, user._id];
                    // Sets campaign status if done
                    campaignRequest.status = getCampaignStatus(campaignRequest);
                    const updatedCampaign = await campaignRequest.save();

                    return getUpdatedCampaignResponse(updatedCampaign);
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
        return await updateUserProperty({rewardPoints: points}, userId, true);
    } catch (e) {
        error(e.message, e.code, e.data);
    }
};

const postCampaignThumbnails = async ({campaignRequestId, thumbnails}: IPostCampaignThumbnails, req: IRequest) => {
    try {
        throwUserNotAuthorized(req);
        const campaignRequest: CampaignRequestModel | null =
            await CampaignRequest.findOne({_id: Types.ObjectId(campaignRequestId)});

        throwCampaignNotFoundError(campaignRequest);
        if (campaignRequest) {
            campaignRequest.thumbnails = setThumbnailsType(campaignRequest.thumbnails, thumbnails);
            const updatedCampaign = await campaignRequest.save();

            return getUpdatedCampaignResponse(updatedCampaign);
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

const addCampaignGroupMember =
    async ({campaignRequestId}: ICampaignRequestId, req: IRequest): Promise<CampaignRequestModel | undefined> => {
// other people wants to join someone else campaign.
        try {
            const {userId} = req;
            throwUserNotAuthorized(req);
            const campaignRequest: CampaignRequestModel | null =
                await CampaignRequest.findOne({_id: Types.ObjectId(campaignRequestId)});
            throwCampaignNotFoundError(campaignRequest);
            if (campaignRequest && userId) {
                // creator cant be the joined member of campaign
                if (campaignRequest.creatorId === userId) {
                    error(userErrors.USER_CANT_BE_MEMBER, 400);
                }

                const {_id, groupMemberIds} = campaignRequest;
                if (isUserAlreadyJoined(groupMemberIds, userId)) {
                    error(userErrors.USER_ALREADY_EXISTED, 400, {message: 'user already joined the group'});
                }

                // push the userId of joined members
                campaignRequest.groupMemberIds = [...groupMemberIds, userId];
                const user: UserModel | null = await User.findOne({_id: userId});
                throwUserNotFoundError(user);
                if (user) {
                    // update the joined member the campaign he/she joined
                    user.joinedCampaignIds.push(_id);
                    await user.save();
                }
                const updatedCampaign = await campaignRequest.save();
                await updatedCampaign.populate('groupMemberIds').execPopulate();
                console.log(updatedCampaign, 'updatedCampaign$$$');

                return getUpdatedCampaignResponse(updatedCampaign);
            }
        } catch (e) {
            error(e.message, e.code, e.data);
        }
    }

const postCampaignCompletionDescription =
    async (
        {campaignRequestId, description}: IPostCampaignDescription,
        req: IRequest,
    ): Promise<CampaignRequestModel | undefined> => {

        const {userId} = req;
        try {
            throwUserNotAuthorized(req);

            const campaignRequest: CampaignRequestModel | null =
                await CampaignRequest.findOne({_id: Types.ObjectId(campaignRequestId)});
            throwCampaignNotFoundError(campaignRequest);
            // check is the campaign creator allowed
            if (campaignRequest && userId && campaignRequest.creatorId.toString() === userId.toString()) {
                campaignRequest.status = campaignRequestStatus.COMPLETED;
                campaignRequest.description = description;

                const updatedCampaign = await campaignRequest.save();
                await updatedCampaign.populate('groupMemberIds').execPopulate();

                return getUpdatedCampaignResponse(updatedCampaign);
            } else {
                error(userErrors.USR_NOT_AUTHORIZED, 403, {message: 'Only campaign creator allowed.'})
            }
        } catch (e) {
            error(e.message, e.code, e.data);
        }
    }

const getCampaignRequests = async ({page}: { page: number }, req: IRequest) => {
    try {
        // TODO: add lookup similar to populate
        throwUserNotAuthorized(req);
        return CampaignRequest
            .aggregate([
                {$sort: {createdAt: -1}},
            ]);
    } catch (e) {
        error(e.message, e.code, e.data);
    }
}

const getUserData = async (args: any, req: IRequest) => {
    try {
        const {userId} = req;

        const user: UserModel | null = await User.findOne({_id: userId});
        throwUserNotFoundError(user);
        if (user) {
            // TODO add populate
            return getUpdatedUserResponse(user);
        }
    } catch (e) {
        error(e.message, e.code, e.data);
    }
}

const getRequestedCampaign =
    async ({campaignRequestId}: ICampaignRequestId, req: IRequest): Promise<CampaignRequestModel | undefined> => {

        try {
            throwUserNotAuthorized(req);
            const campaignRequest: CampaignRequestModel | null =
                await CampaignRequest.findOne({_id: Types.ObjectId(campaignRequestId)});
            throwCampaignNotFoundError(campaignRequest);

            if (campaignRequest) {
                const updatedCampaign = await campaignRequest.save();

                return getUpdatedCampaignResponse(updatedCampaign);
            }
        } catch (e) {
            error(e.message, e.code, e.data);

        }
    }
// TODO: add populate to all the resolver

const resolver = {
    singIn,
    login,
    postCampaign,
    postCampaignEntity,
    postCampaignDonation,
    postUserRewards,
    postCampaignThumbnails,
    postUserMaxDistance,
    addCampaignGroupMember,
    postCampaignCompletionDescription,
    getCampaignRequests,
    getUserData,
    getRequestedCampaign,
};

export default resolver;
