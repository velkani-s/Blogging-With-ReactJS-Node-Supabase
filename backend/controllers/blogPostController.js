const BlogPost = require("../models/BlogPost");

// @desc    Get all blog posts
// @route   GET /api/blog-posts
// @access  Public
const getBlogPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = { status: "published" };

    // Search functionality
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by tags
    if (req.query.tag) {
      query.tags = req.query.tag;
    }

    // Sort options
    let sort = { createdAt: -1 };
    if (req.query.sort === "popular") {
      sort = { views: -1 };
    } else if (req.query.sort === "oldest") {
      sort = { createdAt: 1 };
    }

    const posts = await BlogPost.find(query)
      .populate("author", "username")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select("-comments");

    const total = await BlogPost.countDocuments(query);

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
// @route   GET /api/blog-posts/:id
// @access  Public
const getBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)
      .populate("author", "username")
      .populate("comments.user", "username");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Increment views
    post.views += 1;
    await post.save();

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
    const { title, content, excerpt, category, tags, status } = req.body;

    const postData = {
      title,
      content,
      excerpt,
      category,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      author: req.user.id,
      status: status || "draft",
    };

    // Handle featured image upload
    if (req.file) {
      postData.featuredImage = {
        public_id: req.file.filename,
        url: req.file.path,
      };
    }

    // Set published date if status is published
    if (status === "published") {
      postData.publishedAt = new Date();
    }

    const post = await BlogPost.create(postData);

    await post.populate("author", "username");

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
    let post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Check if user is the author or admin
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this post",
      });
    }

    const { title, content, excerpt, category, tags, status } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (category) updateData.category = category;
    if (tags) updateData.tags = tags.split(",").map((tag) => tag.trim());

    // Handle status change
    if (status && status !== post.status) {
      updateData.status = status;
      if (status === "published" && !post.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    // Handle featured image upload
    if (req.file) {
      updateData.featuredImage = {
        public_id: req.file.filename,
        url: req.file.path,
      };
    }

    post = await BlogPost.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("author", "username");

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

// @desc    Delete blog post
// @route   DELETE /api/blog-posts/:id
// @access  Private (Admin)
const deleteBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Check if user is the author or admin
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this post",
      });
    }

    await BlogPost.findByIdAndDelete(req.params.id);

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
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    const { content } = req.body;

    const comment = {
      user: req.user.id,
      content,
    };

    post.comments.push(comment);
    await post.save();

    await post.populate("comments.user", "username");

    res.status(201).json({
      success: true,
      data: { comment: post.comments[post.comments.length - 1] },
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
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    const userId = req.user.id;
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      success: true,
      data: {
        likes: post.likes.length,
        isLiked: likeIndex === -1,
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
    const categories = await BlogPost.distinct("category", {
      status: "published",
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
