const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
  handleValidationErrors,
];

const validateUserLogin = [
  body("identifier").notEmpty().withMessage("Username or email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

// Blog post validation rules
const validateBlogPost = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title is required and must be less than 100 characters"),
  body("content")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Content is required and must be at least 10 characters"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("excerpt")
    .optional()
    .isLength({ max: 300 })
    .withMessage("Excerpt must be less than 300 characters"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("tags.*")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Each tag must be a string less than 50 characters"),
  handleValidationErrors,
];

// Product validation rules
const validateProduct = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(
      "Product name is required and must be less than 100 characters",
    ),
  body("description")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage(
      "Description is required and must be between 10 and 1000 characters",
    ),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("originalPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Original price must be a positive number"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("inventory.quantity")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer"),
  body("inventory.sku")
    .optional()
    .isAlphanumeric()
    .withMessage("SKU must be alphanumeric"),
  body("weight")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Weight must be a positive number"),
  body("seo.metaTitle")
    .optional()
    .isLength({ max: 60 })
    .withMessage("Meta title must be less than 60 characters"),
  body("seo.metaDescription")
    .optional()
    .isLength({ max: 160 })
    .withMessage("Meta description must be less than 160 characters"),
  handleValidationErrors,
];

// Comment validation
const validateComment = [
  body("content")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Comment is required and must be less than 500 characters"),
  handleValidationErrors,
];

// Review validation
const validateReview = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Review comment must be less than 500 characters"),
  handleValidationErrors,
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateBlogPost,
  validateProduct,
  validateComment,
  validateReview,
};
