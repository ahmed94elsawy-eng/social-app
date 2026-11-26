import { Router } from "express";
import postController from "./controller/post.controller";
import { authGuard } from "../../lib/auth/authGard";

export const postRouter = Router();

postRouter.post("/", authGuard, postController.create);
postRouter.get("/my-posts", authGuard, postController.getMyPosts);
postRouter.get("/:id", authGuard, postController.getById);
postRouter.patch("/:id", authGuard, postController.update);
postRouter.delete("/:id", authGuard, postController.delete);