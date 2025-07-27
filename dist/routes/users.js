"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const roleCheck_1 = require("../middleware/roleCheck");
const userController_1 = __importDefault(require("../controllers/userController"));
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken, auth_1.requireAuth, roleCheck_1.requireAdmin);
router.get('/', userController_1.default.getAllUsers);
router.get('/:id', userController_1.default.getUserById);
router.patch('/:id/role', userController_1.default.updateUserRole);
router.delete('/:id', userController_1.default.deleteUser);
exports.default = router;
//# sourceMappingURL=users.js.map