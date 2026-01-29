# Frontend Integration Guide - Supabase Backend

Your React frontend needs minimal changes to work with the Supabase backend. Follow this guide to update your API calls.

## 🔄 Key Changes from MongoDB to Supabase

| Aspect         | Before             | After                 |
| -------------- | ------------------ | --------------------- |
| Database       | MongoDB documents  | PostgreSQL tables     |
| IDs            | ObjectId (24-char) | CUID (random string)  |
| Routes         | `/blog-posts/:id`  | `/blog-posts/:slug`   |
| Product Routes | `/products/:id`    | `/products/:slug`     |
| Image Upload   | Cloudinary URLs    | Supabase Storage URLs |
| Auth           | Same JWT flow      | Same JWT flow ✅      |

## ⚙️ Environment Configuration

### Update `frontend/.env`

```env
VITE_API_URL=http://localhost:5000
VITE_API_URL_PROD=https://your-render-backend.onrender.com
```

### Update `frontend/src/utils/api.js`

```javascript
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

## 🔐 Authentication

### Login Endpoint (Unchanged)

```javascript
// frontend/src/pages/LoginPage.jsx
import api from "../utils/api";

const handleLogin = async (email, password) => {
  try {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", data.data.token);
    localStorage.setItem("user", JSON.stringify(data.data.user));

    // Redirect to admin panel
    navigate("/admin");
  } catch (error) {
    console.error("Login failed:", error.response?.data?.message);
  }
};
```

### Get Current User

```javascript
// frontend/src/utils/useAuth.js
import { useEffect, useState } from "react";
import api from "./api";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.data.user);
      } catch (error) {
        console.error("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem("token")) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  return { user, loading };
};
```

## 📝 Blog Posts - Updated Routes

### Key Change: Use SLUG Instead of ID

```javascript
// OLD - MongoDB
GET /api/blog-posts/507f1f77bcf86cd799439011

// NEW - PostgreSQL/Prisma
GET /api/blog-posts/top-5-tech-gadgets-2025
```

### Get All Blog Posts

```javascript
// frontend/src/pages/BlogList.jsx
import api from "../utils/api";

const getBlogPosts = async (page = 1) => {
  const { data } = await api.get("/blog-posts", {
    params: {
      page,
      limit: 10,
      status: "published",
      sort: "latest", // or 'popular', 'oldest'
      search: "keyword", // optional
      category: "technology", // optional - use slug
      tag: "bestseller", // optional - use slug
    },
  });

  return {
    posts: data.data.posts,
    pagination: data.data.pagination,
  };
};
```

### Get Single Blog Post - BY SLUG

```javascript
// frontend/src/pages/BlogPost.jsx
import { useParams } from "react-router-dom";
import api from "../utils/api";

const BlogPost = () => {
  const { slug } = useParams(); // Get from URL
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Route now uses slug instead of ID!
        const { data } = await api.get(`/blog-posts/${slug}`);
        setPost(data.data.post);
      } catch (error) {
        console.error("Post not found");
      }
    };

    fetchPost();
  }, [slug]);

  return <div>{post?.title}</div>;
};
```

### Create Blog Post

```javascript
// frontend/src/pages/AdminPanel.jsx
const createPost = async (formData) => {
  const { data } = await api.post("/blog-posts", {
    title: "My Post Title",
    content: "<p>Post content</p>",
    excerpt: "Short description",
    categoryId: "cat_xyz123", // Use category ID, not name
    tagIds: ["tag_1", "tag_2"], // Array of tag IDs
    status: "draft", // or 'published'
  });

  return data.data.post;
};
```

## 🛍️ Products - Updated Routes

### Key Change: Use SLUG Instead of ID

```javascript
// Get Single Product - BY SLUG
const { data } = await api.get("/products/smart-home-hub-pro");

// Product URL structure
<Link to={`/products/${product.slug}`}>{product.name}</Link>;
```

### Get All Products

```javascript
const getProducts = async (filters = {}) => {
  const { data } = await api.get("/products", {
    params: {
      page: filters.page || 1,
      limit: filters.limit || 12,
      search: filters.search, // optional
      category: filters.category, // optional - slug
      minPrice: filters.minPrice, // optional
      maxPrice: filters.maxPrice, // optional
      sort: filters.sort, // 'price_asc', 'price_desc', 'rating', 'name'
      featured: filters.featured, // true or false
      minRating: filters.minRating, // 1-5
    },
  });

  return {
    products: data.data.products,
    pagination: data.data.pagination,
  };
};
```

### Get Featured Products

```javascript
const { data } = await api.get("/products/featured?limit=8");
const products = data.data.products;
```

### Product Review System

```javascript
// Add review
const addReview = async (productId, rating, comment) => {
  const { data } = await api.post(`/products/${productId}/reviews`, {
    rating: parseInt(rating), // 1-5
    comment: comment, // optional
  });
  return data.data.review;
};

// Get reviews for product
const getReviews = async (productId, page = 1) => {
  const { data } = await api.get(`/products/${productId}/reviews`, {
    params: { page, limit: 10 },
  });

  return {
    reviews: data.data.reviews,
    pagination: data.data.pagination,
  };
};
```

## 🖼️ Image Uploads

### Upload Blog Featured Image

```javascript
const uploadBlogImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  // Use Supabase storage (handled by backend)
  const response = await api.post("/blog-posts/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data.url; // Supabase public URL
};
```

### Product Images

```javascript
const uploadProductImages = async (files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const { data } = await api.post("/products/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data.urls; // Array of Supabase URLs
};
```

## 💬 Comments & Likes

### Add Comment to Post

```javascript
const addComment = async (postId, content) => {
  const { data } = await api.post(`/blog-posts/${postId}/comments`, {
    content,
  });
  return data.data.comment;
};
```

### Like/Unlike Post

```javascript
const toggleLike = async (postId) => {
  const { data } = await api.post(`/blog-posts/${postId}/like`);
  return {
    likes: data.data.likes,
    isLiked: data.data.isLiked,
  };
};
```

## 🔍 Search & Filter

### Search Blog Posts

```javascript
const searchPosts = async (query) => {
  const { data } = await api.get("/blog-posts", {
    params: {
      search: query,
      status: "published",
    },
  });
  return data.data.posts;
};
```

### Filter Products by Category

```javascript
const getProductsByCategory = async (categorySlug) => {
  const { data } = await api.get("/products", {
    params: {
      category: categorySlug,
    },
  });
  return data.data.products;
};
```

## 📱 React Component Examples

### Updated Blog List Component

```jsx
// frontend/src/pages/BlogList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

export const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await api.get("/blog-posts", {
        params: { page, limit: 10 },
      });
      setPosts(data.data.posts);
      setTotal(data.data.pagination.total);
    };

    fetchPosts();
  }, [page]);

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map((post) => (
        <article key={post.id}>
          <Link to={`/blog/${post.slug}`}>
            <h2>{post.title}</h2>
          </Link>
          <p>{post.excerpt}</p>
          <small>
            By {post.author.username} • {post.views} views
          </small>
        </article>
      ))}
      <div>Page {page}</div>
    </div>
  );
};
```

### Updated Blog Post Component

```jsx
// frontend/src/pages/BlogPost.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api";

export const BlogPost = () => {
  const { slug } = useParams(); // Get slug from URL
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await api.get(`/blog-posts/${slug}`);
      setPost(data.data.post);
    };

    fetchPost();
  }, [slug]);

  if (!post) return <div>Loading...</div>;

  return (
    <article>
      {post.featuredImage && <img src={post.featuredImage} alt={post.title} />}
      <h1>{post.title}</h1>
      <p>
        By {post.author.username} • {post.views} views
      </p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* Affiliate Disclosure */}
      <div className="affiliate-note">
        <p>⚠️ This page contains affiliate links. We may earn a commission.</p>
      </div>
    </article>
  );
};
```

## 🛑 Error Handling

```javascript
import api from "../utils/api";

try {
  const { data } = await api.get("/blog-posts/invalid-slug");
} catch (error) {
  if (error.response?.status === 404) {
    console.error("Post not found");
  } else if (error.response?.status === 401) {
    console.error("Unauthorized - login required");
  } else {
    console.error("Server error:", error.response?.data?.message);
  }
}
```

## 📋 API Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "post": { ... }
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Post not found"
}
```

## 🚀 URL Structure Updates

Update your routing to use slugs:

```jsx
// Before (MongoDB IDs)
<Route path="/blog/:id" element={<BlogPost />} />
<Route path="/products/:id" element={<Product />} />

// After (Slugs)
<Route path="/blog/:slug" element={<BlogPost />} />
<Route path="/products/:slug" element={<Product />} />
```

## ✅ Migration Checklist

- [ ] Update API base URL in `.env`
- [ ] Update all API calls to use slugs instead of IDs
- [ ] Test authentication (login/logout)
- [ ] Test blog posts listing and detail pages
- [ ] Test product pages and filtering
- [ ] Test image uploads
- [ ] Test search functionality
- [ ] Test comments and reviews
- [ ] Test like/unlike feature
- [ ] Test on mobile devices
- [ ] Deploy to production

## 📚 Additional Resources

- [Backend API Documentation](./SUPABASE_MIGRATION_GUIDE.md)
- [Quick Start Guide](./QUICK_START.md)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Axios Documentation](https://axios-http.com/docs/intro)

---

**Last Updated**: January 2026  
**Compatibility**: React/Vue/Angular  
**Backend Version**: 2.0.0 (Supabase)
