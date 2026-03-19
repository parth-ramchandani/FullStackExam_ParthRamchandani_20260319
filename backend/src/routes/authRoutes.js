const express = require("express");
const { body } = require("express-validator");
const AuthController = require("../controllers/AuthController");
const handleValidation = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("email").isEmail().withMessage("Valid email is required."),
    body("password")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/)
      .withMessage(
        "Password must be at least 8 characters and include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
      ),
    handleValidation
  ],
  AuthController.register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required."),
    body("password").notEmpty().withMessage("Password is required."),
    handleValidation
  ],
  AuthController.login
);

module.exports = router;
