import {
    CampaignRequestModel,
    campaignRequestStatus,
    entityStatus,
    IDonationEntity,
    IEntity,
} from '@Models/CampaignRequest';
import {imageTypes, IThumbnail, thumbnailType} from '@Models/Feed';
import {campaignRequestError, error} from '@Utils/errorUtil';

export const isEntitiesValid = (entities: IEntity[]): boolean => {
    let isValid: boolean = true;
    entities.forEach((entity: IEntity) => {
        if (entity.requestedAmount <= 0) {
            isValid = false;
        }
    })

    return isValid;
};

export const getEntities = (oldEntities: IEntity[], newEntities: IEntity[]): IEntity[] => {
    oldEntities.forEach((entity: IEntity, index: number) => {
        const foundIndex = newEntities.findIndex((newEntity: IEntity) => newEntity.title.toLowerCase() === entity.title.toLowerCase());
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

    return isAllEntitiesAvailed ? campaignRequestStatus.COMPLETED : status;
}
