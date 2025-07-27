import { Router } from 'express';
import { authenticateToken, requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/roleCheck';
import { uploadSingle, handleUploadError } from '../middleware/upload';
import UploadController from '../controllers/uploadController';

const router: Router = Router();

// All upload routes require authentication and admin role
router.use(authenticateToken, requireAuth, requireAdmin);

// Upload image for a specific product
router.post('/products/:id/image', uploadSingle, handleUploadError, UploadController.uploadProductImage);

// Upload image without associating with a product (for create product flow)
router.post('/image', uploadSingle, handleUploadError, UploadController.uploadImage);

// Delete product image
router.delete('/products/:id/image', UploadController.deleteProductImage);

export default router; 