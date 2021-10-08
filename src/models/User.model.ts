import { IUser } from '../interfaces/IUser';
import mongoose from 'mongoose';
import Joi, { string } from 'joi';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a full name'],
        index: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        index: true,
    },

    password: { type: String },

    phone: { type: String },

    address: {
        street: { type: String },
        city: { type: String },
        postCode: { type: String }
    },

    role: {
        roleName: { type: String, default: 'User' },
        roleDesc: { type: String, default: "Default role of 'User'" }
    },
    bots: [{ _id: false, botId: String, canEdit: Boolean }],
    verifiedEmail: { type: Boolean, default: false },
    verifiedPhone: { type: Boolean, default: false },
    created: { type: Date, required: true, default: Date.now },
    modified: { type: Date, required: true, default: Date.now },
    createdBy: { type: String },
    modifiedBy: { type: String },
    lastLogin: { type: Date },
    confirmCode: { type: String }
})
const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(user);
}
export const validate = validateUser;
export default mongoose.model<IUser>('User', userSchema);
