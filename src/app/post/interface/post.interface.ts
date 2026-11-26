import { Types } from "mongoose";

export interface IPost {
    _id?: Types.ObjectId | string;
    title?: string;
    content: string;
    author: Types.ObjectId | string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}