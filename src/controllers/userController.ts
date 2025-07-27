import { Request, Response } from 'express';
import UserModel from '../models/User';
import { validateBody, validateParams } from '../middleware/validation';
import { z } from 'zod';

// Extend Request interface to include user
interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: string;
  };
}

const updateRoleSchema = z.object({
  role: z.enum(['admin', 'user'])
});

const idParamSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().positive())
});

class UserController {
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserModel.findAll();
      
      return res.json({
        success: true,
        message: 'Users retrieved successfully',
        data: {
          users
        }
      });
    } catch (error: any) {
      console.error('Error getting users:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve users',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = parseInt(id, 10);

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
      }

      const user = await UserModel.findById(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      return res.json({
        success: true,
        message: 'User retrieved successfully',
        data: {
          user
        }
      });
    } catch (error: any) {
      console.error('Error getting user:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve user',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async updateUserRole(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = parseInt(id, 10);
      const { role } = req.body;

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
      }

      // Validate role
      const validation = updateRoleSchema.safeParse({ role });
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role. Must be "admin" or "user"'
        });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Prevent admin from removing their own admin role
      if (user.id === req.user?.userId && role === 'user') {
        return res.status(400).json({
          success: false,
          message: 'Cannot remove your own admin role'
        });
      }

      const updatedUser = await UserModel.updateRole(userId, role);
      
      return res.json({
        success: true,
        message: 'User role updated successfully',
        data: {
          user: updatedUser
        }
      });
    } catch (error: any) {
      console.error('Error updating user role:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update user role',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async deleteUser(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = parseInt(id, 10);

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Prevent admin from deleting themselves
      if (user.id === req.user?.userId) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete your own account'
        });
      }

      await UserModel.softDelete(userId);
      
      return res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error: any) {
      console.error('Error deleting user:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete user',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

export default UserController; 