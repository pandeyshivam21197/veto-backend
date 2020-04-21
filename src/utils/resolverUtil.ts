import CampaignRequest, {
    CampaignRequestModel,
    campaignRequestStatus,
    entityStatus,
    IDonationEntity,
    IEntity,
    imageTypes,
    IThumbnail,
    thumbnailType,
} from '@Models/CampaignRequest';
import User, {UserModel} from '@Models/User';
import {campaignRequestError, error, throwUserNotFoundError} from '@Utils/errorUtil';
import {Types} from 'mongoose';

export const isEntitiesValid = (entities: IEntity[]): boolean => {
    let isValid: boolean = true;
    entities.forEach((entity: IEntity) => {
        if (entity.requestedAmount <= 0) {
            isValid = false;
        }
    })

    return isValid;
};

export const getUpdatedEntities = (oldEntities: IEntity[], newEntities: IEntity[]): IEntity[] => {
    oldEntities.forEach((entity: IEntity, index: number) => {
        const foundIndex: number =
            newEntities
                .findIndex(
                    (newEntity: IEntity) => newEntity.title.toLowerCase() === entity.title.toLowerCase(),
                );

        if (foundIndex >= 0) {
            const oldAmount = oldEntities[index].requestedAmount;
            const additionAmount = newEntities[foundIndex].requestedAmount;
            oldEntities[index].requestedAmount = oldAmount + additionAmount;
            newEntities.splice(foundIndex, 1);
        }
    });
    return [...oldEntities, ...newEntities];
};

export const updateEntityAmount = (donationEntity: IDonationEntity, entities: IEntity[]): IEntity[] => {
    const {title, amount} = donationEntity;
    const foundIndex: number = entities.findIndex((entity: IEntity) => {
        return entity.title.trim().toLowerCase() === title.trim().toLowerCase();
    });
    if (foundIndex > -1) {
        // @ts-ignore
        const foundEntity: IEntity = entities[foundIndex]._doc;
        const {availedAmount, requestedAmount, status} = foundEntity;
        // check if its already availed or not
        if (availedAmount === requestedAmount || status === entityStatus.AVAILED) {
            error(campaignRequestError.BAD_REQUEST, 403, {message: `entity ${title} is already availed.`});
        }
        // set availed amount
        const updatedEntity: IEntity = {...foundEntity, availedAmount: availedAmount + amount};
        // after setting entity availed again is it now availed or not
        if (updatedEntity.availedAmount === updatedEntity.requestedAmount) {
            updatedEntity.status = entityStatus.AVAILED;
        }
        // replace the updated entity
        entities.splice(foundIndex, 1, updatedEntity);
    }
    return entities;
};

export const setThumbnailsType = (oldThumbnails: IThumbnail[], newThumbnails: IThumbnail[]): IThumbnail[] => {
    newThumbnails.forEach((thumbnail: IThumbnail) => {
        const type = thumbnail.url.split('.').pop();
        if (type && imageTypes.includes(type.trim().toLowerCase())) {
            thumbnail.type = thumbnailType.IMAGE;
        } else {
            thumbnail.type = thumbnailType.VIDEO;
        }
    });
    return [...oldThumbnails, ...newThumbnails];
};

export const getCampaignStatus = (campaignRequest: CampaignRequestModel): string => {
    const {entities, status} = campaignRequest;
    const isAllEntitiesAvailed: boolean = entities.every((entity: IEntity) => entity.status === entityStatus.AVAILED);

    return isAllEntitiesAvailed ? campaignRequestStatus.AVAILED : status;
}

export const updateUserProperty = async (property = {}, userId: Types.ObjectId | undefined) => {
    let user: UserModel | null = await User.findOne({_id: userId});
    throwUserNotFoundError(user);
    // @ts-ignore
    user = {...user, ...property};
    if (user) {
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

}

export const getUpdatedCampaignResponse = async (campaignRequest: CampaignRequestModel) => {
    const {createdAt, updatedAt, _id} = campaignRequest;

    return {
        // @ts-ignore
        ...campaignRequest._doc,
        createdAt: createdAt.toString(),
        updatedAt: updatedAt.toString(),
        _id: _id.toString(),
    };
};

export const getUpdatedUserResponse = async (user: UserModel) => {
    const {createdAt, updatedAt, _id} = user;

    return {
        // @ts-ignore
        ...user._doc,
        createdAt: createdAt.toString(),
        updatedAt: updatedAt.toString(),
        _id: _id.toString(),
    };
};

// TODO: add lookup similar to populate
export const getStatusSortedCampaigns = () => {
    const {COMPLETED, INITIATED, AVAILED} = campaignRequestStatus;
    return CampaignRequest.aggregate([
        {$group: {$match: {status: COMPLETED}, $sort: {createdAt: -1}}},
        {$group: {$match: {status: AVAILED}, $sort: {createdAt: -1}}},
        {$group: {$match: {status: INITIATED}, $sort: {createdAt: -1}}},
    ])
};

export const isUserAlreadyJoined = (userIds: Types.ObjectId[], newUserId: Types.ObjectId) => {
    return userIds.find((userId: Types.ObjectId) => userId.toString() === newUserId.toString());
};
