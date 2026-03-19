const express = require("express");
const { body } = require("express-validator");
const CartController = require("../controllers/CartController");
const requireAuth = require("../middleware/authMiddleware");
const handleValidation = require("../middleware/validationMiddleware");

const router = express.Router();

router.get("/", requireAuth, CartController.getCart);
router.post(
  "/items",
  requireAuth,
  [
    body("productId").notEmpty().withMessage("productId is required."),
    body("quantity").optional().isInt({ min: 1 }).withMessage("quantity must be >= 1."),
    handleValidation
  ],
  CartController.addToCart
);
router.delete("/items/:productId", requireAuth, CartController.removeFromCart);

module.exports = router;
