import { NextFunction, Request, Response } from "express";
import postService, { PostService } from "../service/post.service";
import { IUserPayload } from "../../../lib/interface/userPayload.interface";

class PostController {
    private readonly postService: PostService = postService;

    private getUserId(req: Request): string {
        const user = req.user as IUserPayload | undefined;
        const id = (user as any)?.id || (user as any)?._id || user?.sub;
        return String(id);
    }

    private getParamId(param: string | string[] | undefined): string {
        return Array.isArray(param) ? param[0] : String(param ?? "");
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = this.getUserId(req);
            const post = await this.postService.createPost(userId, req.body);
            res.status(201).json({ message: "Post created successfully", success: true, data: post });
        } catch (error) {
            next(error);
        }
    };

    getMyPosts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = this.getUserId(req);
            const posts = await this.postService.getMyPosts(userId);
            res.status(200).json({ message: "Posts retrieved successfully", success: true, data: posts });
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = this.getParamId(req.params.id);
            const post = await this.postService.getPostById(id);
            res.status(200).json({ message: "Post retrieved successfully", success: true, data: post });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = this.getUserId(req);
            const id = this.getParamId(req.params.id);
            const updated = await this.postService.updatePost(id, userId, req.body);
            res.status(200).json({ message: "Post updated successfully", success: true, data: updated });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = this.getUserId(req);
            const id = this.getParamId(req.params.id);
            await this.postService.deletePost(id, userId);
            res.status(200).json({ message: "Post deleted successfully", success: true });
        } catch (error) {
            next(error);
        }
    };
}

export default new PostController();