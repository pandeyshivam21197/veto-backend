import {CampaignRequestModel} from '@Models/CampaignRequest';
import {UserModel} from '@Models/User';
import {Request} from 'express';
import {Types} from 'mongoose';

export interface IRequest extends Request {
    isAuth?: boolean;
    userId?: Types.ObjectId;
}

export const userErrors = {
    USER_NOT_FOUND: 'User not found.',
    USER_ALREADY_EXISTED: 'User already exist.',
    USER_CANT_BE_MEMBER: 'User cant be the member of its own campaign.',
    USR_NOT_AUTHORIZED: 'User is not authorized',
    INCORRECT_PASSWORD: 'Password is incorrect.',
    SECRET_KEY_ERROR: 'Secret key not found.',
    BAD_REQUEST: 'Bad request.',
    REQUEST_NOT_FOUND: 'Requested data not found. Please check params.',
    INVALID_EMAIL: 'Please provide proper email address',
    INVALID_PASSWORD: 'Please provide password min length of 5',
};

export const campaignRequestError = {
    BAD_REQUEST: 'Unable to set, please check params',
}

export interface ErrorType extends Error {
    code?: number,
    data?: IMessage[] | IMessage
}

export interface IMessage {
    message: string;
}

export const error = (message: string, code = 500, data?: IMessage[] | IMessage): void => {
    const err: ErrorType = new Error(message);
    err.code = code;
    if (data) {
        err.data = data;
    }
    throw err;
};

export const throwUserNotFoundError = (user: UserModel | null): void => {
    if (!user) {
        const {USER_NOT_FOUND} = userErrors;
        error(USER_NOT_FOUND, 401);
        return;
    }
}

export const throwCampaignNotFoundError = (campaign: CampaignRequestModel | null): void => {
    if (!campaign) {
        const {BAD_REQUEST, REQUEST_NOT_FOUND} = userErrors;
        error(BAD_REQUEST + REQUEST_NOT_FOUND, 400, {message: 'wrong campaignRequestId'});
        return;
    }
};

export const throwUserNotAuthorized = (req: IRequest): void => {
    const {isAuth} = req;
    if (!isAuth) {
        error(userErrors.USR_NOT_AUTHORIZED, 401);
    }
};
