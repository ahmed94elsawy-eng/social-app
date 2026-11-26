import { IComment } from "../interface/comment.interface";
import { Comment } from "../model/comment.model";
import { AbstractRepository } from "../../../lib/db/abstract.repository";

class CommentRepository extends AbstractRepository<IComment> {
    constructor() {
        super(Comment);
    }

    async findByPostId(postId: string) {
        return Comment.find({ post: postId, isDeleted: { $ne: true } }).sort({ createdAt: -1 });
    }

    async findActiveById(commentId: string) {
        return this.getOne({ _id: commentId, isDeleted: { $ne: true } });
    }
}

export default new CommentRepository();