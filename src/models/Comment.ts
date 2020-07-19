import { Schema, Document, Types, model } from "mongoose";

type commentModel = Document & ({
    user: Types.ObjectId;
    policy: Types.ObjectId;
    reply: [Types.ObjectId];
})

const commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    policy: {
        type: Schema.Types.ObjectId,
        ref: "Policy"
    },
    reply: {
        type: [Schema.Types.ObjectId],
        ref: 'Comment'
    }
}, {timestamps: true})

const Comment = model<commentModel>('Comment', commentSchema);

export default Comment;