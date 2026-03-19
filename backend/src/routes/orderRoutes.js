const express = require("express");
const OrderController = require("../controllers/OrderController");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/checkout", requireAuth, OrderController.checkout);
router.get("/", requireAuth, OrderController.getOrderHistory);

module.exports = router;
