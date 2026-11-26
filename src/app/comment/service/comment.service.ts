import commentRepository from "../repository/comment.repository";
import postRepository from "../../post/repository/post.repository";
import { CreateCommentDto, UpdateCommentDto } from "../dto/comment.dto";
import { PostNotFound } from "../../post/error";
import { CommentNotFound, NotCommentOrPostOwner, NotCommentOwner } from "../error";

export class CommentService {
    private readonly commentRepository = commentRepository;
    private readonly postRepository = postRepository;

    async createComment(postId: string, userId: string, dto: CreateCommentDto) {
        const post = await this.postRepository.findActiveById(postId);
        if (!post) throw PostNotFound;

        return this.commentRepository.create({
            content: dto.content,
            post: postId,
            author: userId,
        });
    }

    async getPostComments(postId: string) {
        const post = await this.postRepository.findActiveById(postId);
        if (!post) throw PostNotFound;

        return this.commentRepository.findByPostId(postId);
    }

    async getCommentById(commentId: string) {
        const comment = await this.commentRepository.findActiveById(commentId);
        if (!comment) throw CommentNotFound;
        return comment;
    }

    async updateComment(commentId: string, userId: string, dto: UpdateCommentDto) {
        const comment = await this.commentRepository.findActiveById(commentId);
        if (!comment) throw CommentNotFound;

        if (comment.author.toString() !== userId.toString()) {
            throw NotCommentOwner;
        }

        return this.commentRepository.update({ _id: commentId }, { content: dto.content }, { new: true });
    }

    async deleteComment(commentId: string, userId: string) {
        const comment = await this.commentRepository.findActiveById(commentId);
        if (!comment) throw CommentNotFound;

        const post = await this.postRepository.findActiveById(comment.post.toString());
        const isCommentOwner = comment.author.toString() === userId.toString();
        const isPostOwner = post ? post.author.toString() === userId.toString() : false;

        if (!isCommentOwner && !isPostOwner) {
            throw NotCommentOrPostOwner;
        }

        return this.commentRepository.update({ _id: commentId }, { isDeleted: true }, { new: true });
    }
}

export default new CommentService();