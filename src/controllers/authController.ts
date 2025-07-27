import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import UserModel from '../models/User';
import JWTService from '../utils/jwt';
import AuditLogModel from '../models/AuditLog';

class AuthController {
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, role = 'user' } = req.body;

      // Create user
      const user = await UserModel.create({ email, password, role });

      // Generate JWT token
      const token = JWTService.generateToken(user);

      // Log the signup action
      await AuditLogModel.create({
        user_id: user.id,
        user_email: user.email,
        action: 'LOGIN',
        details: { action: 'signup', role }
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          user,
          token
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to create user'
        });
      }
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Authenticate user
      const user = await UserModel.authenticate({ email, password });

      // Update last login
      await UserModel.updateLastLogin(user.id);

      // Generate JWT token
      const token = JWTService.generateToken(user);
      // Log the login action
      await AuditLogModel.create({
        user_id: user.id,
        user_email: user.email,
        action: 'LOGIN',
        details: { action: 'login' }
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user,
          token
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Login failed'
        });
      }
    }
  }

  static async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      // Log the logout action
      await AuditLogModel.create({
        user_id: req.user.id,
        user_email: req.user.email,
        action: 'LOGOUT',
        details: { action: 'logout' }
      });

      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }

  static async getCurrentUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          user: req.user
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get current user'
      });
    }
  }
}

export default AuthController; 