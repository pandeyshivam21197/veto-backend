import {model, Schema, Document} from 'mongoose';

export type UserModel = Document & {
    name: string;
    username: string;
    email: string;
    password: string;
    location: string;
    idProofType: string;
    idProofImageUrl: string;
    DOB: string;
    rewardPoints: number;
    campaignRequests: string;
    contactNumber: string;
    maxDistance: number;
    requestIds: [];
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
        type: String,
        default: 0,
    },
    campaignRequests: {
        type: String,
        default: [],
    },
    maxDistance: {
        type: Number,
        default: 0,
    },
    requestIds: {
        type: Array,
        default: [],
    },
});

const User = model<UserModel>('User', userSchema);

export default User;
