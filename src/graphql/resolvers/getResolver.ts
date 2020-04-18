import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {userErrors, error} from '@Utils/errorUtil';
import User, {UserModel} from '@Models/User';

interface ILoginResponse {
    token: string;
    userId: string;
}

const login = async ({email, password}: { email: string, password: string }): Promise<ILoginResponse | void> => {
    const user: UserModel | null = await User.findOne({email} || {username: email});
    if (!user) {
        error(userErrors.USER_NOT_FOUND, 401);
        return;
    }
    const isEqual: boolean = await bcrypt.compare(password, user.password);
    if (!isEqual) {
        error(userErrors.INCORRECT_PASSWORD, 401);
        return;
    }
    const secretKey: string | undefined = process.env.JWT_SECRET;
    const tokenExpiry: string | undefined = process.env.TOKEN_EXPIRY;

    if (!secretKey) {
        error(userErrors.SECRET_KEY_ERROR, 500);
        return;
    }
    const token: string = jwt.sign(
        {
            userId: user._id.toString(),
            email: user.email,
        },
        secretKey,
        {expiresIn: tokenExpiry || '1d'},
    );
    return {token, userId: user._id.toString()};
};

const getResolver = {login};

export default getResolver;
