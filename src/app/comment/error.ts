import { AppError } from "../../lib/error/error";

export const CommentNotFound = new AppError("Comment not found", 404);
export const NotCommentOwner = new AppError("Only the comment owner can update this comment", 403);
export const NotCommentOrPostOwner = new AppError(
    "Only the comment owner or the post owner can delete this comment",
    403
);