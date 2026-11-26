import { Router } from "express";
import commentController from "./controller/comment.controller";
import { authGuard } from "../../lib/auth/authGard";

export const commentRouter = Router();

commentRouter.post("/post/:postId", authGuard, commentController.create);
commentRouter.get("/post/:postId", authGuard, commentController.getPostComments);
commentRouter.get("/:id", authGuard, commentController.getById);
commentRouter.patch("/:id", authGuard, commentController.update);
commentRouter.delete("/:id", authGuard, commentController.delete);