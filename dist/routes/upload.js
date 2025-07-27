"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const roleCheck_1 = require("../middleware/roleCheck");
const upload_1 = require("../middleware/upload");
const uploadController_1 = __importDefault(require("../controllers/uploadController"));
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken, auth_1.requireAuth, roleCheck_1.requireAdmin);
router.post('/products/:id/image', upload_1.uploadSingle, upload_1.handleUploadError, uploadController_1.default.uploadProductImage);
router.post('/image', upload_1.uploadSingle, upload_1.handleUploadError, uploadController_1.default.uploadImage);
router.delete('/products/:id/image', uploadController_1.default.deleteProductImage);
exports.default = router;
//# sourceMappingURL=upload.js.map