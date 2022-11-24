import mongoose, { Schema, model, Model } from 'mongoose';
import { IUser } from '../interfaces';

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    role: {
        type: String,
        enum: {
            values: ['admin', 'client'],
            massage: '{VALUE} no es un rol valido',
        },
        default: 'client',
        require: true
    },
}, {
    timestamps: true,
})

const User: Model<IUser> = mongoose.models.User || model('User', userSchema);

export default User;