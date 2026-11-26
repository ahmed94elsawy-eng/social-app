import { AppError } from "../../lib/error/error";

export const PostNotFound = new AppError("Post not found", 404);
export const NotPostOwner = new AppError("You are not allowed to perform this action on this post", 403);