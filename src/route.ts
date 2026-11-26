import { Router } from 'express';
import { authRouter } from "./app/auth/route";
import { userRouter } from "./app/user/route";
import { postRouter } from "./app/post/route";
import { commentRouter } from "./app/comment/route";

export const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/post', postRouter);
router.use('/comment', commentRouter);