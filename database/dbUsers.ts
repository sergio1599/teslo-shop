import bcrypt from 'bcryptjs';
import { User } from '../models';
import { database } from './';
import { disconnect } from './db';

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

/* La función crea o verifica el usuario de OAuth */
export const oAuthToDbUser = async (oAuthEmail: string, oAuthName: string) => {
    await database.connect();
    const user = await User.findOne({ email: oAuthEmail });

    if (user) {
        await database.disconnect();
        const { _id, name, email, role } = user;
        return { _id, name, email, role };
    }

    const newUser = new User({ email: oAuthEmail, name: oAuthEmail, password: '@', role: 'client' });
    await newUser.save();
    await database.disconnect();

    const { _id, name, email, role } = newUser;
    return { _id, name, email, role };
}

