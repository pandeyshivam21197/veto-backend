import {
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

        if (index >= 0) {
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
    const foundIndex = entities.findIndex((entity: IEntity) => entity.title === title);
    if (foundIndex > -1) {
        const foundEntity: IEntity = entities[foundIndex];
        const {availedAmount, requestedAmount} = foundEntity;
        if (availedAmount === requestedAmount) {
            error(campaignRequestError.BAD_REQUEST, 403, {message: `entity ${title} is already availed.`});
        }
        const updatedEntity: IEntity = {...foundEntity, availedAmount: availedAmount + amount};
        if (updatedEntity.availedAmount === updatedEntity.requestedAmount) {
            updatedEntity.status = entityStatus.AVAILED;
        }
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

export const getCampaignStatus = (CampaignRequest: CampaignRequestModel): string => {
    const {entities, status} = CampaignRequest;
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
    const updatedCampaign = await campaignRequest.save();
    const {createdAt, updatedAt, _id} = updatedCampaign;

    return {
        // @ts-ignore
        ...updatedCampaign._doc,
        createdAt: createdAt.toString(),
        updatedAt: updatedAt.toString(),
        _id: _id.toString(),
    };
};

export const getUpdatedUserResponse = async (user: UserModel) => {
    const updatedUser = await user.save();
    const {createdAt, updatedAt, _id} = updatedUser;

    return {
        // @ts-ignore
        ...updatedUser._doc,
        createdAt: createdAt.toString(),
        updatedAt: updatedAt.toString(),
        _id: _id.toString(),
    };
};
