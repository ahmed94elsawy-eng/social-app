import {model, Schema} from 'mongoose';
import {IUser} from "../interface/user.interface";
import {Gender, Provider} from "../enum/user.enum";

const schema = new Schema<IUser>({
    userName: {type: String, required: true, trim: true, minlength: 2, maxlength: 20},
    email: {type: String, required: true, trim: true, toLowerCase: true, unique: true},
    password: {
        type: String,
        required: function (this) {
            return this.provider === Provider.LOCAL;
        }
    },
    provider: {
        type: Number, default: Provider.LOCAL, enum: Provider
    },
    phoneNumber: {type: String},
    gender: {type: Number, enum: Gender, default: Gender.MALE},
    isVerified: {type: Boolean, default: false},
    isDeleted: {type: Boolean, default: false},
    profilePicturePath: {type: String},

}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
});

export const User = model<IUser>('User', schema)