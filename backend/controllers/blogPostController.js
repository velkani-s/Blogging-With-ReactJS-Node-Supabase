const prisma = require("../config/prisma");
const { deleteFile, getFilePathFromUrl } = require("../config/supabaseStorage");

// @desc    Get all blog posts
// @route   GET /api/blog-posts
// @access  Public
const getBlogPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build where conditions
    let where = { status: "published" };

    // Search functionality
    if (req.query.search) {
      where.OR = [
        { title: { contains: req.query.search, mode: "insensitive" } },
        { content: { contains: req.query.search, mode: "insensitive" } },
        { excerpt: { contains: req.query.search, mode: "insensitive" } },
      ];
    }

    // Filter by category
    if (req.query.category) {
      where.category = {
        slug: req.query.category,
      };
    }

    // Filter by tags
    if (req.query.tag) {
      where.tags = {
        some: {
          slug: req.query.tag,
        },
      };
    }

    // Sort options
    let orderBy = { createdAt: "desc" };
    if (req.query.sort === "popular") {
      orderBy = { views: "desc" };
    } else if (req.query.sort === "oldest") {
      orderBy = { createdAt: "asc" };
    }

    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        author: { select: { id: true, username: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
        _count: {
          select: { comments: true, likes: true },
        },
      },
      orderBy,
      skip,
      take: limit,
    });

    const total = await prisma.blogPost.count({ where });

    res.json({
      success: true,
      data: {
        posts,
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

// @desc    Get single blog post
// @route   GET /api/blog-posts/:slug
// @access  Public
const getBlogPost = async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: req.params.slug },
      include: {
        author: { select: { id: true, username: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
        comments: {
          include: { user: { select: { id: true, username: true } } },
          orderBy: { createdAt: "desc" },
        },
        likes: true,
        _count: {
          select: { comments: true, likes: true },
        },
      },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Increment views
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    res.json({
      success: true,
      data: { post },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Create blog post
// @route   POST /api/blog-posts
// @access  Private (Admin)
const createBlogPost = async (req, res) => {
  try {
    const { title, content, excerpt, categoryId, tagIds, status } = req.body;

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .trim("-");

    const postData = {
      title,
      slug,
      content,
      excerpt,
      status: status || "draft",
      authorId: req.user.id,
    };

    if (categoryId) {
      postData.categoryId = categoryId;
    }

    // Handle featured image
    if (req.file) {
      postData.featuredImage = req.file.path; // Supabase URL
    }

    // Set published date if status is published
    if (status === "published") {
      postData.publishedAt = new Date();
    }

    const post = await prisma.blogPost.create({
      data: postData,
      include: {
        author: { select: { id: true, username: true } },
        category: { select: { id: true, name: true } },
        tags: true,
      },
    });

    // Connect tags if provided
    if (tagIds && Array.isArray(tagIds)) {
      await prisma.blogPost.update({
        where: { id: post.id },
        data: {
          tags: {
            connect: tagIds.map((id) => ({ id })),
          },
        },
      });
    }

    res.status(201).json({
      success: true,
      data: { post },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Update blog post
// @route   PUT /api/blog-posts/:id
// @access  Private (Admin)
const updateBlogPost = async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: req.params.id },
      include: { author: true },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Check if user is the author or admin
    if (post.authorId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this post",
      });
    }

    const { title, content, excerpt, categoryId, tagIds, status } = req.body;

    const updateData = {};
    if (title) {
      updateData.title = title;
      updateData.slug = title
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, "-")
        .trim("-");
    }
    if (content) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (categoryId !== undefined) updateData.categoryId = categoryId;

    // Handle status change
    if (status && status !== post.status) {
      updateData.status = status;
      if (status === "published" && !post.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    // Handle featured image
    if (req.file) {
      // Delete old image if exists
      if (post.featuredImage) {
        const filePath = getFilePathFromUrl(post.featuredImage);
        if (filePath) {
          await deleteFile(filePath, "blog-images").catch(() => {});
        }
      }
      updateData.featuredImage = req.file.path;
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        author: { select: { id: true, username: true } },
        category: { select: { id: true, name: true } },
        tags: true,
      },
    });

    // Update tags if provided
    if (tagIds && Array.isArray(tagIds)) {
      await prisma.blogPost.update({
        where: { id: req.params.id },
        data: {
          tags: {
            set: tagIds.map((id) => ({ id })),
          },
        },
      });
    }

    res.json({
      success: true,
      data: { post: updatedPost },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blog-posts/:id
// @access  Private (Admin)
const deleteBlogPost = async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: req.params.id },
      include: { author: true },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Check if user is the author or admin
    if (post.authorId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this post",
      });
    }

    // Delete featured image if exists
    if (post.featuredImage) {
      const filePath = getFilePathFromUrl(post.featuredImage);
      if (filePath) {
        await deleteFile(filePath, "blog-images").catch(() => {});
      }
    }

    await prisma.blogPost.delete({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Add comment to blog post
// @route   POST /api/blog-posts/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    const post = await prisma.blogPost.findUnique({
      where: { id: req.params.id },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: req.params.id,
        userId: req.user.id,
      },
      include: {
        user: { select: { id: true, username: true } },
      },
    });

    res.status(201).json({
      success: true,
      data: { comment },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Like/Unlike blog post
// @route   POST /api/blog-posts/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: req.params.id },
      include: { likes: true },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    const existingLike = post.likes.length > 0;

    if (existingLike) {
      // Unlike
      await prisma.like.deleteMany({
        where: { postId: req.params.id },
      });
    } else {
      // Like
      await prisma.like.create({
        data: { postId: req.params.id },
      });
    }

    const updatedLikes = await prisma.like.count({
      where: { postId: req.params.id },
    });

    res.json({
      success: true,
      data: {
        likes: updatedLikes,
        isLiked: !existingLike,
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

// @desc    Get blog post categories
// @route   GET /api/blog-posts/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    res.json({
      success: true,
      data: { categories },
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
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  addComment,
  toggleLike,
  getCategories,
};
