import { model, Schema } from "mongoose";
import { IPost } from "../interface/post.interface";

const postSchema = new Schema<IPost>(
    {
        title: { type: String, trim: true, maxlength: 150 },
        content: { type: String, required: true, trim: true },
        author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

export const Post = model<IPost>("Post", postSchema);