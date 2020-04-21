import {Document, model, Schema, Types} from 'mongoose';

interface IDonationHistory {
    campaignRequestId: Types.ObjectId;
    donationAmount: number;
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
    rewardPoints: number;
    campaignRequestIds: Types.ObjectId[];
    joinedCampaignIds: Types.ObjectId[];
    donationHistory: IDonationHistory[];
    maxDistance: number;
    createdAt: string;
    updatedAt: string;
};

const campaignRef = {
    type: Schema.Types.ObjectId,
    ref: 'CampaignRequest',
};

const donationHistory = {
    campaignRequestId: campaignRef,
    donationAmount: {
        type: Number,
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
        type: [campaignRef],
        default: [],
    },
    joinedCampaignIds: {
        type: [campaignRef],
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
