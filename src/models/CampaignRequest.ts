import {Document, model, Schema, Types} from 'mongoose';

export interface IEntity {
    title: string;
    requestedAmount: number;
    availedAmount?: number;
    currentPrice: string;
}

export type CampaignRequestModel = Document & {
    title: string;
    subTitle?: string;
    entities?: IEntity[];
    status?: string,
    createdAt: string;
    updatedAt: string;
    donerIds?: [Types.ObjectId];
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
}, {timestamps: true});

const CampaignRequest = model<CampaignRequestModel>('CampaignRequest', campaignRequestSchema);

export default CampaignRequest;
