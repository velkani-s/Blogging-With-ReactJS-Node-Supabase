netstat -ano | findstr :5000 | ForEach-Object { $parts = $_ -split '\s+'; taskkill /PID $parts[-1] /F } 2>$null; Start-Sleep -Seconds 2const express = require("express");

const { protect } = require("../middleware/auth");
const { uploadBlogImage, uploadProductImage, handleUploadError } = require("../middleware/upload");
const { uploadFile, deleteFile } = require("../config/supabaseStorage");

const router = express.Router();

// Blog image upload
router.post("/blog", protect, uploadBlogImage, handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const fileName = `blog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${req.file.mimetype.split('/')[1]}`;
    const publicUrl = await uploadFile(req.file, "blog-images", fileName);

    res.json({
      success: true,
      imageUrl: publicUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error("Blog upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading image",
      error: error.message,
    });
  }
});

// Product image upload
router.post("/product", protect, uploadProductImage, handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const fileName = `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${req.file.mimetype.split('/')[1]}`;
    const publicUrl = await uploadFile(req.file, "product-images", fileName);

    res.json({
      success: true,
      imageUrl: publicUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error("Product upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading image",
      error: error.message,
    });
  }
});

module.exports = router;
