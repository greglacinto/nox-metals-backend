"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const zod_1 = require("zod");
const updateRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(['admin', 'user'])
});
const idParamSchema = zod_1.z.object({
    id: zod_1.z.string().transform((val) => parseInt(val, 10)).pipe(zod_1.z.number().int().positive())
});
class UserController {
    static async getAllUsers(req, res) {
        try {
            const users = await User_1.default.findAll();
            return res.json({
                success: true,
                message: 'Users retrieved successfully',
                data: {
                    users
                }
            });
        }
        catch (error) {
            console.error('Error getting users:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to retrieve users',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const userId = parseInt(id, 10);
            if (isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user ID'
                });
            }
            const user = await User_1.default.findById(userId);
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
        }
        catch (error) {
            console.error('Error getting user:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to retrieve user',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    static async updateUserRole(req, res) {
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
            const validation = updateRoleSchema.safeParse({ role });
            if (!validation.success) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role. Must be "admin" or "user"'
                });
            }
            const user = await User_1.default.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            if (user.id === req.user?.userId && role === 'user') {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot remove your own admin role'
                });
            }
            const updatedUser = await User_1.default.updateRole(userId, role);
            return res.json({
                success: true,
                message: 'User role updated successfully',
                data: {
                    user: updatedUser
                }
            });
        }
        catch (error) {
            console.error('Error updating user role:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update user role',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const userId = parseInt(id, 10);
            if (isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user ID'
                });
            }
            const user = await User_1.default.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            if (user.id === req.user?.userId) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete your own account'
                });
            }
            await User_1.default.softDelete(userId);
            return res.json({
                success: true,
                message: 'User deleted successfully'
            });
        }
        catch (error) {
            console.error('Error deleting user:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to delete user',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}
exports.default = UserController;
//# sourceMappingURL=userController.js.map