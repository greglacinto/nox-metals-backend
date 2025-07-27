import { Router } from 'express';
import { validateQuery, validateParams } from '../middleware/validation';
import { authenticateToken, requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/roleCheck';
import { auditLogFiltersSchema } from '../utils/validation';
import { idParamSchema } from '../middleware/validation';
import AuditController from '../controllers/auditController';

const router: Router = Router();

// All audit routes require admin authentication
router.use(authenticateToken, requireAuth, requireAdmin);

// Get all audit logs with filtering
router.get('/', validateQuery(auditLogFiltersSchema), AuditController.getAllLogs);

// Get logs for specific product
router.get('/product/:id', validateParams(idParamSchema), AuditController.getLogsByProduct);

// Get logs for specific user
router.get('/user/:id', validateParams(idParamSchema), AuditController.getLogsByUser);

// Get logs by action type
router.get('/action/:action', AuditController.getLogsByAction);

// Get recent logs
router.get('/recent', AuditController.getRecentLogs);

// Get audit summary
router.get('/summary', AuditController.getLogsSummary);

// Get logs by date range
router.get('/date-range', AuditController.getLogsByDateRange);

export default router; 