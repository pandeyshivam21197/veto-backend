import {Document, model, Schema, Types} from 'mongoose';

export interface IEntity {
    title: string;
    requestedAmount: number;
    availedAmount: number;
    currentPrice: string;
    status: string;
}

export interface IDonationEntity {
    title: string;
    amount: number;
}

export interface IThumbnail {
    url: string;
    type: string;
}

export type CampaignRequestModel = Document & {
    title: string;
    subTitle: string;
    entities: IEntity[];
    status: string,
    createdAt: string;
    updatedAt: string;
    donerIds: Types.ObjectId[];
    groupMemberIds: Types.ObjectId[];
    thumbnails: IThumbnail[];
};

export const entityStatus = {
    AVAILED: 'Availed',
};

export const thumbnailType = {
    IMAGE: 'Image',
    VIDEO: 'Video',
}

export const campaignRequestStatus = {
    COMPLETED: 'Completed',
    AVAILED: 'Availed',
};

export const imageTypes = ['jpeg', 'jpg', 'png', 'gif', 'tiff'];

export const thumbnail = {
    url: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: '',
    },
};

const entity = {
    title: {
        type: String,
        required: true,
    },
    requestedAmount: {
        type: Number,
        required: true,
    },
    availedAmount: {
        type: Number,
        default: 0,
    },
    currentPrice: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: '',
    },
};

const campaignRequestSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    subTitle: {
        type: String,
        default: '',
    },
    entities: {
        type: [entity],
        default: [],
    },
    status: {
        type: String,
        default: '',
    },
    donerIds: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
    groupMemberIds: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
    thumbnails: {
        type: [thumbnail],
        default: [],
    },
    description: {
        type: String!,
        default: '',
    },
}, {timestamps: true});

const CampaignRequest = model<CampaignRequestModel>('CampaignRequest', campaignRequestSchema);

export default CampaignRequest;
