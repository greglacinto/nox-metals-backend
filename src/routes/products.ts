import { Router } from 'express';
import { validateBody, validateQuery, validateParams } from '../middleware/validation';
import { authenticateToken, requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/roleCheck';
import { 
  createProductSchema, 
  updateProductSchema, 
  productFiltersSchema
} from '../utils/validation';
import { idParamSchema } from '../middleware/validation';
import ProductController from '../controllers/productController';

const router: Router = Router();

// Public routes (with optional auth for enhanced features)
router.get('/', validateQuery(productFiltersSchema), ProductController.getAllProducts);
router.get('/:id', validateParams(idParamSchema), ProductController.getProductById);

// Protected routes (require authentication)
router.use(authenticateToken, requireAuth);

// Admin-only routes
router.post('/', requireAdmin, validateBody(createProductSchema), ProductController.createProduct);
router.put('/:id', requireAdmin, validateParams(idParamSchema), validateBody(updateProductSchema), ProductController.updateProduct);
router.delete('/:id', requireAdmin, validateParams(idParamSchema), ProductController.deleteProduct);
router.patch('/:id/restore', requireAdmin, validateParams(idParamSchema), ProductController.restoreProduct);

// Additional admin routes
router.get('/admin/deleted', requireAdmin, ProductController.getDeletedProducts);
router.get('/admin/search/:name', requireAdmin, ProductController.searchProductsByName);

export default router; 