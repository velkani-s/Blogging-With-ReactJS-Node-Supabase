const express = require("express");
const {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  addComment,
  toggleLike,
  getCategories,
} = require("../controllers/blogPostController");
const { protect, authorize } = require("../middleware/auth");
const {
  validateBlogPost,
  validateComment,
} = require("../middleware/validation");
const { uploadBlogImage, handleUploadError } = require("../middleware/upload");

const router = express.Router();

// Public routes
router.get("/", getBlogPosts);
router.get("/categories", getCategories);
router.get("/:id", getBlogPost);

// Protected routes
router.post(
  "/",
  protect,
  authorize("admin"),
  uploadBlogImage,
  handleUploadError,
  validateBlogPost,
  createBlogPost,
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  uploadBlogImage,
  handleUploadError,
  validateBlogPost,
  updateBlogPost,
);
router.delete("/:id", protect, authorize("admin"), deleteBlogPost);

// Comment routes
router.post("/:id/comments", protect, validateComment, addComment);

// Like routes
router.post("/:id/like", protect, toggleLike);

// Error handling for uploads
router.use(handleUploadError);

module.exports = router;
