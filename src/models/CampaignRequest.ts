import {model, Schema, Document} from 'mongoose';

interface IEntity {
    title: string;
    requestedAmount: number;
    availedAmount?: number;
}
export type CampaignRequestModel = Document & {
    creatorId: Schema.Types.ObjectId;
    supporterIds?: [Schema.Types.ObjectId];
    title: string;
    subTitle?: string;
    entities?: [IEntity];
    status?: string,
};

const campaignRequestSchema: Schema = new Schema({
    creatorId: {
        type: Schema.Types.ObjectId, // Using token userId is extracted
        ref: 'User',
        required: true,
    },
    supporterIds: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: [],
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
    status: {
        type: String,
        default: '',
    },
}, {timestamps: true});

const CampaignRequest = model<CampaignRequestModel>('CampaignRequest', campaignRequestSchema);

export default CampaignRequest;
