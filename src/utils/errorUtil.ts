export const userErrors = {
    USER_NOT_FOUND: 'User not found',
    INCORRECT_PASSWORD: 'Password is incorrect.',
    SECRET_KEY_ERROR: 'Secret key not found',
};

interface ErrorType extends Error{
    code?: number,
}

export const error = (message: string, code = 500): void => {
    const err: ErrorType = new Error(message);
    err.code = code;
    throw err;
};
