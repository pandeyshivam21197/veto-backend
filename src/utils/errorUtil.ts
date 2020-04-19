export const userErrors = {
    USER_NOT_FOUND: 'User not found.',
    INCORRECT_PASSWORD: 'Password is incorrect.',
    SECRET_KEY_ERROR: 'Secret key not found.',
    BAD_REQUEST: 'Bad request.',
    REQUEST_NOT_FOUND: 'Requested data not found. Please check params.',
};

export interface ErrorType extends Error{
    code?: number,
    data?: [IMessage] | IMessage
}

interface IMessage {
    message: string;
}

export const error = (message: string, code = 500, data?: [IMessage] | IMessage): void => {
    const err: ErrorType = new Error(message);
    err.code = code;
    if(data) {
        err.data = data;
    }
    throw err;
};
