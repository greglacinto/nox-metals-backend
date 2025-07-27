import { Router } from 'express';
import { validateBody } from '../middleware/validation';
import { authenticateToken, requireAuth } from '../middleware/auth';
import { loginSchema, signupSchema } from '../utils/validation';
import AuthController from '../controllers/authController';

const router: Router = Router();

// Public routes
router.post('/signup', validateBody(signupSchema), AuthController.signup);
router.post('/login', validateBody(loginSchema), AuthController.login);

// Protected routes
router.post('/logout', authenticateToken, requireAuth, AuthController.logout);
router.get('/me', authenticateToken, requireAuth, AuthController.getCurrentUser);

export default router; 