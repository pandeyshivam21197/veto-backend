import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {userErrors, error} from '@Utils/errorUtil';
import User, {UserModel} from '@Models/User';

const login = async ({email, password}: { email: string, password: string }) => {
    const user: UserModel | null = await User.findOne({email});
    if (!user) {
        error(userErrors.USER_NOT_FOUND, 401)
        return;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
        error(userErrors.INCORRECT_PASSWORD, 401);
        return;
    }
    const token = jwt.sign(
        {
            userId: user._id.toString(),
            email: user.email,
        },
        'superSecret',
        {expiresIn: '1h'},
    );
    return {token, userId: user._id.toString()};
}

module.exports = {
    login,
};
