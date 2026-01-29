const multer = require("multer");
const path = require("path");

// Use memory storage for Supabase upload
const memoryStorage = multer.memoryStorage();

// File filter for images
const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, PNG, GIF, WebP) are allowed!"), false);
  }
};

// Multer options
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB max file size
};

// Middleware for blog post image upload
const uploadBlogImage = multer({
  storage: memoryStorage,
  fileFilter: fileFilter,
  limits: limits,
}).single("image");

// Middleware for product images upload (multiple)
const uploadProductImages = multer({
  storage: memoryStorage,
  fileFilter: fileFilter,
  limits: limits,
}).array("images", 5); // Max 5 images per product

// Middleware for single product image
const uploadProductImage = multer({
  storage: memoryStorage,
  fileFilter: fileFilter,
  limits: limits,
}).single("image");

// Error handling middleware
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 5MB.",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files. Maximum 5 files allowed.",
      });
    }
  }

  if (error.message.includes("Only image files")) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next(error);
};

module.exports = {
  uploadBlogImage,
  uploadProductImages,
  uploadProductImage,
  handleUploadError,
};
