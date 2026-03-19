const express = require("express");
const ReportController = require("../controllers/ReportController");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", requireAuth, ReportController.getReports);

module.exports = router;
