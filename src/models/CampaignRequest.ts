import {model, Schema, Document} from 'mongoose';

interface IEntity {
    title: string,
    subTitle?: string,
    requestedAmount: number,
    availedAmount?: number,
}
export type CampaignRequestModel = Document & {
    userId: Schema.Types.ObjectId;
    title: string;
    subTitle?: string;
    entities?: [IEntity];
};

const campaignRequestSchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    subTitle: {
        type: String,
        default: '',
    },
    entities: {
        type: [
            {
                title: {
                    type: String,
                    required: true,
                },
                subTitle: {
                    type: String,
                    default: '',
                },
                requestedAmount: {
                    type: Number,
                    required: true,
                },
                availedAmount: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        default: [],
    },
}, {timestamps: true});

const CampaignRequest = model<CampaignRequestModel>('CampaignRequest', campaignRequestSchema);

export default CampaignRequest;
