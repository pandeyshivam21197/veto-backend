import {model, Schema, Document} from 'mongoose';

export type UserModel = Document & {
    name: string;
    username: string;
    email: string;
};

const campaignRequestSchema: Schema = new Schema({
    name: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        require: true,
    },
    location: {
        type: String,
        required: true,
    },
    idProofType: {
        type: String,
        required: true,
    },
    idProofImageUrl: {
        type: String,
        required: true,
    },
    DOB: {
        type: String,
        required: true,
    },
    rewardPoints: {
        type: String,
        default: 0,
    },
    campaignRequests: {
        type: String,
        default: [],
    },
});

const CampaignRequest = model<UserModel>('CampaignRequest', campaignRequestSchema);

export default CampaignRequest;
