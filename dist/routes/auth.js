"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const validation_2 = require("../utils/validation");
const authController_1 = __importDefault(require("../controllers/authController"));
const router = (0, express_1.Router)();
router.post('/signup', (0, validation_1.validateBody)(validation_2.signupSchema), authController_1.default.signup);
router.post('/login', (0, validation_1.validateBody)(validation_2.loginSchema), authController_1.default.login);
router.post('/logout', auth_1.authenticateToken, auth_1.requireAuth, authController_1.default.logout);
router.get('/me', auth_1.authenticateToken, auth_1.requireAuth, authController_1.default.getCurrentUser);
exports.default = router;
//# sourceMappingURL=auth.js.map