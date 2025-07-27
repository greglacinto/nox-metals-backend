import { Router } from 'express';
import { authenticateToken, requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/roleCheck';
import UserController from '../controllers/userController';

const router: Router = Router();

// All user routes require authentication and admin role
router.use(authenticateToken, requireAuth, requireAdmin);

// Get all users
router.get('/', UserController.getAllUsers);

// Get user by ID
router.get('/:id', UserController.getUserById);

// Update user role
router.patch('/:id/role', UserController.updateUserRole);

// Delete user (soft delete)
router.delete('/:id', UserController.deleteUser);

export default router; 