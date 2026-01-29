const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getFeaturedProducts,
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/auth");
const { validateProduct, validateReview } = require("../middleware/validation");
const {
  uploadProductImages,
  handleUploadError,
} = require("../middleware/upload");

const router = express.Router();

// Public routes
router.get("/featured", getFeaturedProducts);
router.get("/", getProducts);
router.get("/:id", getProduct);

// Protected routes
router.post(
  "/",
  protect,
  authorize("admin"),
  uploadProductImages,
  handleUploadError,
  validateProduct,
  createProduct,
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  uploadProductImages,
  handleUploadError,
  validateProduct,
  updateProduct,
);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

// Review routes
router.post("/:id/reviews", protect, validateReview, addReview);

// Error handling for uploads
router.use(handleUploadError);

module.exports = router;
