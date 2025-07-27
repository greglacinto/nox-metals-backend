"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const roleCheck_1 = require("../middleware/roleCheck");
const validation_2 = require("../utils/validation");
const validation_3 = require("../middleware/validation");
const auditController_1 = __importDefault(require("../controllers/auditController"));
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken, auth_1.requireAuth, roleCheck_1.requireAdmin);
router.get('/', (0, validation_1.validateQuery)(validation_2.auditLogFiltersSchema), auditController_1.default.getAllLogs);
router.get('/product/:id', (0, validation_1.validateParams)(validation_3.idParamSchema), auditController_1.default.getLogsByProduct);
router.get('/user/:id', (0, validation_1.validateParams)(validation_3.idParamSchema), auditController_1.default.getLogsByUser);
router.get('/action/:action', auditController_1.default.getLogsByAction);
router.get('/recent', auditController_1.default.getRecentLogs);
router.get('/summary', auditController_1.default.getLogsSummary);
router.get('/date-range', auditController_1.default.getLogsByDateRange);
exports.default = router;
//# sourceMappingURL=audit.js.map