import { Types } from "mongoose";

export interface IComment {
    _id?: Types.ObjectId | string;
    content: string;
    post: Types.ObjectId | string;
    author: Types.ObjectId | string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}