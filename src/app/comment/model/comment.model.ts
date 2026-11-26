import { model, Schema } from "mongoose";
import { IComment } from "../interface/comment.interface";

const commentSchema = new Schema<IComment>(
    {
        content: { type: String, required: true, trim: true },
        post: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
        author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

export const Comment = model<IComment>("Comment", commentSchema);