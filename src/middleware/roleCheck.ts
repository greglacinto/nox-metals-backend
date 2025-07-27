import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth';

export const requireRole = (requiredRole: 'admin' | 'user') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
      return;
    }

    if (req.user.role !== requiredRole && req.user.role !== 'admin') {
      res.status(403).json({ 
        success: false, 
        message: `Access denied. ${requiredRole} role required.` 
      });
      return;
    }

    next();
  };
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin role required.' 
    });
    return;
  }

  next();
};

export const requireUser = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
    return;
  }

  next();
};

export const optionalRole = (requiredRole: 'admin' | 'user') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (req.user && req.user.role !== requiredRole && req.user.role !== 'admin') {
      res.status(403).json({ 
        success: false, 
        message: `Access denied. ${requiredRole} role required.` 
      });
      return;
    }

    next();
  };
}; 