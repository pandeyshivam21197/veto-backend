import {model, Schema, Document} from 'mongoose';

export type UserModel = Document & {
    name: string;
    username: string;
    email: string;
    password: string;
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
});

const User = model<UserModel>('User', userSchema);

export default User;
