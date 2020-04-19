import {IEntity} from '@Models/CampaignRequest';

export const isEntitiesValid = (entities: [IEntity]): boolean => {
    let isValid: boolean = true;
    entities.forEach((entity: IEntity) => {
        if(entity.requestedAmount <= 0) {
            isValid = false;
        }
    })

    return isValid;
};
