import { Router } from 'express';

export const router = Router();

router.use('/auth');
router.use('/user');
router.use('/post');
router.use('/comment');