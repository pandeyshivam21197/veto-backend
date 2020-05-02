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
    userImage: string;
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
    location: { // location of the user
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
    rewardPoints: { // On donatin or successful campaign he gets rewards
        type: Number,
        default: 0,
    },
    campaignRequestIds: { // campaign request hosted by the user.
        type: [campaignRef],
        default: [],
    },
    joinedCampaignIds: { // Other Campaigns user part of.
        type: [campaignRef],
        default: [],
    },
    donationHistory: { // Donation history of doner
        type: [donationHistory],
        default: [],
    },
    maxDistance: { // this is for Distributor, how much he is willing to travel
        type: Number,
        default: 0,
    },
    userImage: {
        type: String,
        default: '',
    }
}, {timestamps: true});

const User = model<UserModel>('User', userSchema);

export default User;
