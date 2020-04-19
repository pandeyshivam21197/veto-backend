import User, {UserModel} from "@Models/User";
import {CampaignRequestModel} from "@Models/CampaignRequest";

export const userErrors = {
    USER_NOT_FOUND: 'User not found.',
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

export interface ErrorType extends Error{
    code?: number,
    data?: IMessage[] | IMessage
}

export interface IMessage {
    message: string;
}

export const error = (message: string, code = 500, data?: IMessage[] | IMessage): void => {
    const err: ErrorType = new Error(message);
    err.code = code;
    if(data) {
        err.data = data;
    }
    throw err;
};

export const throwUserNotFoundError = (user: UserModel | null) => {
    if (!user) {
        const {USER_NOT_FOUND} = userErrors;
        error(USER_NOT_FOUND, 401);
        return;
    }
}

export const throwCampaignNotFoundError = (campaign: CampaignRequestModel | null) => {
    if (!campaign) {
        const {BAD_REQUEST, REQUEST_NOT_FOUND} = userErrors;
        error(BAD_REQUEST + REQUEST_NOT_FOUND, 400, {message: 'wrong campaignRequestId'});
        return;
    }
};
