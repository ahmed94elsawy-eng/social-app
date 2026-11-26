import postRepository from "../repository/post.repository";
import { CreatePostDto, UpdatePostDto } from "../dto/post.dto";
import { NotPostOwner, PostNotFound } from "../error";

export class PostService {
    private readonly postRepository = postRepository;

    async createPost(userId: string, dto: CreatePostDto) {
        return this.postRepository.create({
            ...dto,
            author: userId,
        });
    }

    async getMyPosts(userId: string) {
        return this.postRepository.findByAuthor(userId);
    }

    async getPostById(postId: string) {
        const post = await this.postRepository.findActiveById(postId);
        if (!post) throw PostNotFound;
        return post;
    }

    async updatePost(postId: string, userId: string, dto: UpdatePostDto) {
        const post = await this.postRepository.findActiveById(postId);
        if (!post) throw PostNotFound;

        if (post.author.toString() !== userId.toString()) {
            throw NotPostOwner;
        }

        return this.postRepository.update(
            { _id: postId },
            {
                ...(dto.title !== undefined && { title: dto.title }),
                ...(dto.content !== undefined && { content: dto.content }),
            },
            { new: true }
        );
    }

    async deletePost(postId: string, userId: string) {
        const post = await this.postRepository.findActiveById(postId);
        if (!post) throw PostNotFound;

        if (post.author.toString() !== userId.toString()) {
            throw NotPostOwner;
        }

        return this.postRepository.update({ _id: postId }, { isDeleted: true }, { new: true });
    }
}

export default new PostService();