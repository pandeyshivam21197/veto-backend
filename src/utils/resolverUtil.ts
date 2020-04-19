import {IEntity} from '@Models/CampaignRequest';

export const isEntitiesValid = (entities: IEntity[]): boolean => {
    let isValid: boolean = true;
    entities.forEach((entity: IEntity) => {
        if(entity.requestedAmount <= 0) {
            isValid = false;
        }
    })

    return isValid;
};

export const getEntities = (oldEntities: IEntity[], newEntities: IEntity[]): IEntity[] => {
    oldEntities.forEach((entity: IEntity, index: number) => {
        const foundIndex = newEntities.findIndex((newEntity: IEntity) => newEntity.title.toLowerCase() === entity.title.toLowerCase());
        if(index >= 0) {
            const oldAmount = oldEntities[index].requestedAmount;
            const additionAmount = newEntities[foundIndex].requestedAmount;
            oldEntities[index].requestedAmount = oldAmount + additionAmount;
            newEntities.splice(foundIndex, 1);
        }
    });
    return [...oldEntities, ...newEntities];
}
