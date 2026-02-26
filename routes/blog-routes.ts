import { Router } from 'express';
import * as blogController from '../controllers/blog-controller.js';

const router = Router();

router.get('/', blogController.getAllBlogs);
router.post('/', blogController.createBlog);
router.get('/:id', blogController.getBlogById);
router.patch('/:id', blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);

export default router;