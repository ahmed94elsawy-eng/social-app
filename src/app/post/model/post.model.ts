import {Schema, Types, model} from "mongoose";

export interface IPost {
    content: string;
    userId: Types.ObjectId;
    commentsCount: number;
    reactionsCount: number;
}

const schema = new Schema<IPost>({
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxLength: 200
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    reactionsCount: {
        type: Number,
        default: 0
    }
});


export const Post = model('Post', schema)