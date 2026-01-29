const prisma = require("../config/prisma");
const { deleteFile, getFilePathFromUrl } = require("../config/supabaseStorage");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build where conditions
    let where = {
      status: "active",
    };

    // Search functionality
    if (req.query.search) {
      where.OR = [
        { name: { contains: req.query.search, mode: "insensitive" } },
        { description: { contains: req.query.search, mode: "insensitive" } },
      ];
    }

    // Filter by category
    if (req.query.category) {
      where.category = {
        slug: req.query.category,
      };
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      where.price = {};
      if (req.query.minPrice)
        where.price.gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice)
        where.price.lte = parseFloat(req.query.maxPrice);
    }

    // Featured products
    if (req.query.featured === "true") {
      where.featured = true;
    }

    // Rating filter
    if (req.query.minRating) {
      where.averageRating = {
        gte: parseFloat(req.query.minRating),
      };
    }

    // Sort options
    let orderBy = { createdAt: "desc" };
    if (req.query.sort === "price_asc") {
      orderBy = { price: "asc" };
    } else if (req.query.sort === "price_desc") {
      orderBy = { price: "desc" };
    } else if (req.query.sort === "rating") {
      orderBy = { averageRating: "desc" };
    } else if (req.query.sort === "name") {
      orderBy = { name: "asc" };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
        images: true,
        _count: {
          select: { reviews: true },
        },
      },
      orderBy,
      skip,
      take: limit,
    });

    const total = await prisma.product.count({ where });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:slug
// @access  Public
const getProduct = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
        images: true,
        attributes: true,
        variants: true,
        reviews: {
          include: { user: { select: { id: true, username: true } } },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: { product },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      brand,
      categoryId,
      tagIds,
      quantity,
      sku,
      metaTitle,
      metaDescription,
      amazonLink,
      affiliateNote,
    } = req.body;

    // Generate slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .trim("-");

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        brand,
        quantity: parseInt(quantity) || 0,
        sku,
        metaTitle,
        metaDescription,
        amazonLink,
        affiliateNote,
        categoryId: categoryId || null,
      },
      include: {
        category: true,
        tags: true,
        images: true,
      },
    });

    // Connect tags if provided
    if (tagIds && Array.isArray(tagIds)) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          tags: {
            connect: tagIds.map((id) => ({ id })),
          },
        },
      });
    }

    // Add images if provided
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        await prisma.productImage.create({
          data: {
            url: file.path,
            productId: product.id,
          },
        });
      }
    }

    const createdProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        tags: true,
        images: true,
      },
    });

    res.status(201).json({
      success: true,
      data: { product: createdProduct },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name,
      description,
      price,
      originalPrice,
      brand,
      categoryId,
      tagIds,
      quantity,
      sku,
      status,
      featured,
      metaTitle,
      metaDescription,
      amazonLink,
      affiliateNote,
    } = req.body;

    const updateData = {};
    if (name) {
      updateData.name = name;
      updateData.slug = name
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, "-")
        .trim("-");
    }
    if (description) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    if (originalPrice) updateData.originalPrice = parseFloat(originalPrice);
    if (brand !== undefined) updateData.brand = brand;
    if (quantity !== undefined) updateData.quantity = parseInt(quantity);
    if (sku !== undefined) updateData.sku = sku;
    if (status !== undefined) updateData.status = status;
    if (featured !== undefined) updateData.featured = featured;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined)
      updateData.metaDescription = metaDescription;
    if (amazonLink !== undefined) updateData.amazonLink = amazonLink;
    if (affiliateNote !== undefined) updateData.affiliateNote = affiliateNote;

    if (categoryId !== undefined) updateData.categoryId = categoryId;

    const updatedProduct = await prisma.product.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        category: true,
        tags: true,
        images: true,
      },
    });

    // Update tags if provided
    if (tagIds && Array.isArray(tagIds)) {
      await prisma.product.update({
        where: { id: req.params.id },
        data: {
          tags: {
            set: tagIds.map((id) => ({ id })),
          },
        },
      });
    }

    // Add new images if provided
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        await prisma.productImage.create({
          data: {
            url: file.path,
            productId: req.params.id,
          },
        });
      }
    }

    res.json({
      success: true,
      data: { product: updatedProduct },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { images: true },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete all images
    for (const image of product.images) {
      const filePath = getFilePathFromUrl(image.url);
      if (filePath) {
        await deleteFile(filePath, "product-images").catch(() => {});
      }
    }

    await prisma.product.delete({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Delete product image
// @route   DELETE /api/products/:id/images/:imageId
// @access  Private (Admin)
const deleteProductImage = async (req, res) => {
  try {
    const image = await prisma.productImage.findUnique({
      where: { id: req.params.imageId },
    });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Delete from storage
    const filePath = getFilePathFromUrl(image.url);
    if (filePath) {
      await deleteFile(filePath, "product-images").catch(() => {});
    }

    await prisma.productImage.delete({
      where: { id: req.params.imageId },
    });

    res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Add review to product
// @route   POST /api/products/:id/reviews
// @access  Private
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        productId: req.params.id,
        userId: req.user?.id || null,
      },
      include: {
        user: { select: { id: true, username: true } },
      },
    });

    // Recalculate average rating
    const reviews = await prisma.review.findMany({
      where: { productId: req.params.id },
    });

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.product.update({
      where: { id: req.params.id },
      data: {
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      },
    });

    res.status(201).json({
      success: true,
      data: { review },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
const getReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await prisma.review.findMany({
      where: { productId: req.params.id },
      include: {
        user: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const total = await prisma.review.count({
      where: { productId: req.params.id },
    });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const products = await prisma.product.findMany({
      where: {
        featured: true,
        status: "active",
      },
      include: {
        category: true,
        tags: true,
        images: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    res.json({
      success: true,
      data: { products },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  addReview,
  getReviews,
  getFeaturedProducts,
};
