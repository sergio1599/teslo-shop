import bcrypt from 'bcryptjs';
import { User } from '../models';
import { database } from './';

export const checkUserEmailPassword = async (email: string, password: string) => {
    await database.connect();
    const user = await User.findOne({ email });
    await database.disconnect();

    if (!user) {
        return null;
    }

    /* hago match con la password de la database */
    if (!bcrypt.compareSync(password, user.password!)) {
        return null;
    }

    const { role, name, _id } = user;

    return {
        _id,
        email: email.toLowerCase(),
        role,
        name,
    }

}

