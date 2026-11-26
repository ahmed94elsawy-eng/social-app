import { IPost } from "../interface/post.interface";
import { Post } from "../model/post.model";
import { AbstractRepository } from "../../../lib/db/abstract.repository";

class PostRepository extends AbstractRepository<IPost> {
    constructor() {
        super(Post);
    }

    async findByAuthor(authorId: string) {
        return Post.find({ author: authorId, isDeleted: { $ne: true } }).sort({ createdAt: -1 });
    }

    async findActiveById(postId: string) {
        return this.getOne({ _id: postId, isDeleted: { $ne: true } });
    }
}

export default new PostRepository();