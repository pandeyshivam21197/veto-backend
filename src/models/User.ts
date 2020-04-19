import {Document, model, Schema} from 'mongoose';

interface IDonationHistory {
    requestId: Schema.Types.ObjectId;
    donationAmount: string;
}

export type UserModel = Document & {
    name: string;
    username: string;
    email: string;
    password: string;
    location: string;
    idProofType: string;
    idProofImageUrl: string;
    DOB: string;
    contactNumber: string;
    rewardPoints?: number;
    campaignRequestIds?: [Schema.Types.ObjectId];
    donationHistory?: IDonationHistory[];
    maxDistance?: number;
    createdAt: string;
    updatedAt: string;
};

const donationHistory = {
    campaignRequestId: {
        type: Schema.Types.ObjectId,
        ref: 'CampaignRequest',
    },
    donationAmount: {
        type: String,
        required: true,
    },
};

const userSchema: Schema = new Schema({
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
    contactNumber: {
        type: String,
        required: true,
    },
    rewardPoints: {
        type: Number,
        default: 0,
    },
    campaignRequestIds: {
        type: [Schema.Types.ObjectId],
        ref: 'CampaignRequest',
        default: [],
    },
    donationHistory: {
        type: [donationHistory],
        default: [],
    },
    maxDistance: {
        type: Number,
        default: 0,
    },
}, {timestamps: true});

const User = model<UserModel>('User', userSchema);

export default User;
