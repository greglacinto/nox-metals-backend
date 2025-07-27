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
const productController_1 = __importDefault(require("../controllers/productController"));
const router = (0, express_1.Router)();
router.get('/', (0, validation_1.validateQuery)(validation_2.productFiltersSchema), productController_1.default.getAllProducts);
router.get('/:id', (0, validation_1.validateParams)(validation_3.idParamSchema), productController_1.default.getProductById);
router.use(auth_1.authenticateToken, auth_1.requireAuth);
router.post('/', roleCheck_1.requireAdmin, (0, validation_1.validateBody)(validation_2.createProductSchema), productController_1.default.createProduct);
router.put('/:id', roleCheck_1.requireAdmin, (0, validation_1.validateParams)(validation_3.idParamSchema), (0, validation_1.validateBody)(validation_2.updateProductSchema), productController_1.default.updateProduct);
router.delete('/:id', roleCheck_1.requireAdmin, (0, validation_1.validateParams)(validation_3.idParamSchema), productController_1.default.deleteProduct);
router.patch('/:id/restore', roleCheck_1.requireAdmin, (0, validation_1.validateParams)(validation_3.idParamSchema), productController_1.default.restoreProduct);
router.get('/admin/deleted', roleCheck_1.requireAdmin, productController_1.default.getDeletedProducts);
router.get('/admin/search/:name', roleCheck_1.requireAdmin, productController_1.default.searchProductsByName);
exports.default = router;
//# sourceMappingURL=products.js.map