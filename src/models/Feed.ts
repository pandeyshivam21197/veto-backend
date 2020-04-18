import {model, Schema, Document} from 'mongoose';

interface IThumbnail {
    url: string;
    type: string;
}

export type FeedModel = Document & {
    title: string;
    description?: string;
    creatorId: Schema.Types.ObjectId;
    supporterIds?: [Schema.Types.ObjectId];
    thumbnails?: [IThumbnail]
};

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
    supporterIds: {
        type: [Schema.Types.ObjectId],
        default: [],
    },
    thumbnails: {
        type: [
            {
                url: {
                    type: String,
                    required: true,
                },
                type: {
                    type: String,
                    required: true,
                },
            },
        ],
        default: [],
    },
}, {timestamps: true});

const Feed = model<FeedModel>('Feed', feedSchema);

export default Feed;
