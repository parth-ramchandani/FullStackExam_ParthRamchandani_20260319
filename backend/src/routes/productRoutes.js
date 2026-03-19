const express = require("express");
const { body } = require("express-validator");
const ProductController = require("../controllers/ProductController");
const requireAuth = require("../middleware/authMiddleware");
const handleValidation = require("../middleware/validationMiddleware");

const router = express.Router();

router.get("/", ProductController.listProducts);
router.get("/:id", ProductController.getProductById);

router.post(
  "/",
  requireAuth,
  [
    body("name").notEmpty().withMessage("Product name is required."),
    body("description").notEmpty().withMessage("Description is required."),
    body("category").notEmpty().withMessage("Category is required."),
    body("price").isFloat({ min: 0 }).withMessage("Price must be >= 0."),
    body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be >= 0."),
    handleValidation
  ],
  ProductController.createProduct
);

router.put(
  "/:id",
  requireAuth,
  [
    body("name").optional().notEmpty().withMessage("Product name cannot be empty."),
    body("description").optional().notEmpty().withMessage("Description cannot be empty."),
    body("category").optional().notEmpty().withMessage("Category cannot be empty."),
    body("price").optional().isFloat({ min: 0 }).withMessage("Price must be >= 0."),
    body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be >= 0."),
    handleValidation
  ],
  ProductController.updateProduct
);

router.delete("/:id", requireAuth, ProductController.deleteProduct);

module.exports = router;
