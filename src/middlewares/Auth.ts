import jwt from 'jsonwebtoken';
import {Types} from 'mongoose';
import {NextFunction, Request, Response} from 'express';
import {error, userErrors} from '@Utils/errorUtil';

interface IRequest extends Request {
    isAuth?: boolean;
    userId?: Types.ObjectId;
}

interface IDecodedToken {
    email: string;
    userId: string;
}

const Auth = (req: IRequest, res: Response, next: NextFunction): void => {
    const authHeader: string | undefined = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token: string = authHeader.split(' ')[1];
    let decodedToken: IDecodedToken;

    try {
        const secretKey: string | undefined = process.env.JWT_SECRET;

        if (!secretKey) {
            // error gets catch by rest api error handler
            error(userErrors.SECRET_KEY_ERROR, 500);
            return;
        }
        // @ts-ignore
        decodedToken = jwt.verify(token, secretKey);
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }
    req.userId = Types.ObjectId(decodedToken.userId);
    req.isAuth = true;
    next();
};

export default Auth;
