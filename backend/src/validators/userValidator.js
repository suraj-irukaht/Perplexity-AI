import { body, oneOf } from "express-validator";

export const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .isAlphanumeric()
    .withMessage("Username must contain only letters and numbers"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*]/)
    .withMessage(
      "Password must contain at least one special character (!@#$%^&*)",
    ),
];

export const loginValidator = [
  oneOf(
    [
      body("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),

      body("username")
        .optional()
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be between 3 and 30 characters")
        .isAlphanumeric()
        .withMessage("Username must contain only letters and numbers"),
    ],
    "Provide either a valid email or a valid username",
  ),

  body("password").notEmpty().withMessage("Password is required"),
];

export const resendVerificationValidator = [
    body("email").isEmail().withMessage("Valid email is required"),
];
