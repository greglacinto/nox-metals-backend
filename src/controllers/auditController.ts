import { Request, Response } from 'express';
import { AuditLogFilters } from '../types/audit';
import AuditLogModel from '../models/AuditLog';

class AuditController {
  static async getAllLogs(req: Request, res: Response): Promise<void> {
    try {
      const filters: AuditLogFilters = {
        user_id: req.query.user_id ? parseInt(req.query.user_id as string) : undefined,
        product_id: req.query.product_id ? parseInt(req.query.product_id as string) : undefined,
        action: req.query.action as any,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 50
      };

      const result = await AuditLogModel.findAll(filters);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch audit logs'
      });
    }
  }

  static async getLogsByProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const productId = parseInt(id);

      const logs = await AuditLogModel.getLogsByProduct(productId);

      res.json({
        success: true,
        data: { logs }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch product audit logs'
      });
    }
  }

  static async getLogsByUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = parseInt(id);

      const logs = await AuditLogModel.getLogsByUser(userId);

      res.json({
        success: true,
        data: { logs }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user audit logs'
      });
    }
  }

  static async getLogsByAction(req: Request, res: Response): Promise<void> {
    try {
      const { action } = req.params;

      const logs = await AuditLogModel.getLogsByAction(action as any);

      res.json({
        success: true,
        data: { logs }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch action audit logs'
      });
    }
  }

  static async getRecentLogs(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const logs = await AuditLogModel.getRecentLogs(limit);

      res.json({
        success: true,
        data: { logs }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch recent audit logs'
      });
    }
  }

  static async getLogsSummary(req: Request, res: Response): Promise<void> {
    try {
      const summary = await AuditLogModel.getLogsSummary();

      res.json({
        success: true,
        data: { summary }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch audit logs summary'
      });
    }
  }

  static async getLogsByDateRange(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        });
        return;
      }

      const logs = await AuditLogModel.getLogsByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.json({
        success: true,
        data: { logs }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch date range audit logs'
      });
    }
  }
}

export default AuditController; 