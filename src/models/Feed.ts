import {Document, model, Schema, Types} from 'mongoose';

export interface IThumbnail {
    url: string;
    type: string;
}

interface ISupporters {
    groupMemberIds: [Types.ObjectId];
    donerIds: [Types.ObjectId];
}

export type FeedModel = Document & {
    title: string;
    description: string;
    creatorId: Types.ObjectId;
    campaignId: Types.ObjectId;
    supporters: ISupporters;
    thumbnails: IThumbnail[];
};

export const imageTypes = ['jpeg', 'jpg', 'png', 'gif', 'tiff'];

export const thumbnailType = {
    IMAGE: 'Image',
    VIDEO: 'Video',
}

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

const supporterIds = {
    groupMemberIds: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
    donerIds: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
}

const feedSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    creatorId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    campaignId: {
        type: Schema.Types.ObjectId,
        default: '',
    },
    supporters: {
        type: supporterIds,
    },
    thumbnails: {
        type: [thumbnail],
        default: [],
    },
}, {timestamps: true});

const Feed = model<FeedModel>('Feed', feedSchema);

export default Feed;
