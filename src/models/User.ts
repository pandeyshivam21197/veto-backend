import {Document, model, Schema} from 'mongoose';

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
    maxDistance?: number;
    createdAt: string;
    updatedAt: string;
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
        ref: 'Request',
        default: [],
    },
    maxDistance: {
        type: Number,
        default: 0,
    },
}, {timestamps: true});

const User = model<UserModel>('User', userSchema);

export default User;
