import { NextFunction, Request, Response } from "express";
import commentService, { CommentService } from "../service/comment.service";
import { IUserPayload } from "../../../lib/interface/userPayload.interface";

class CommentController {
    private readonly commentService: CommentService = commentService;

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
            const postId = this.getParamId(req.params.postId) || String(req.body.postId ?? "");
            const comment = await this.commentService.createComment(postId, userId, req.body);
            res.status(201).json({ message: "Comment created successfully", success: true, data: comment });
        } catch (error) {
            next(error);
        }
    };

    getPostComments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const postId = this.getParamId(req.params.postId);
            const comments = await this.commentService.getPostComments(postId);
            res.status(200).json({ message: "Comments retrieved successfully", success: true, data: comments });
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = this.getParamId(req.params.id);
            const comment = await this.commentService.getCommentById(id);
            res.status(200).json({ message: "Comment retrieved successfully", success: true, data: comment });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = this.getUserId(req);
            const id = this.getParamId(req.params.id);
            const updated = await this.commentService.updateComment(id, userId, req.body);
            res.status(200).json({ message: "Comment updated successfully", success: true, data: updated });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = this.getUserId(req);
            const id = this.getParamId(req.params.id);
            await this.commentService.deleteComment(id, userId);
            res.status(200).json({ message: "Comment deleted successfully", success: true });
        } catch (error) {
            next(error);
        }
    };
}

export default new CommentController();