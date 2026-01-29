# Frontend Integration: Supabase Migration

After backend setup, update your frontend to work with the new Supabase backend.

## 🔧 Step 1: Update Frontend Environment

**File**: `frontend/.env`

```env
VITE_API_URL=http://localhost:5000
```

## 🔄 Step 2: Update API Base URL

**File**: `frontend/src/utils/api.js`

```javascript
// Update the API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

## 🗺️ Step 3: Update Routes (ID → Slug)

### Old Routing (MongoDB with IDs)
```javascript
// OLD - Using MongoDB ObjectIds
GET /api/blog-posts/507f1f77bcf86cd799439011
GET /api/products/507f1f77bcf86cd799439012
```

### New Routing (Supabase with Slugs)
```javascript
// NEW - Using human-readable slugs
GET /api/blog-posts/getting-started-with-nodejs
GET /api/products/pro-gaming-keyboard-2025
```

## 📝 Step 4: Update Components

### Example: BlogPost Component

**OLD CODE** (MongoDB with ID):
```javascript
// pages/BlogPost.jsx
import { useParams } from 'react-router-dom';
import api from '../utils/api';

export default function BlogPost() {
  const { id } = useParams();  // ❌ OLD: expects numeric ID
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await api.get(`/api/blog-posts/${id}`);
      setPost(response.data);
    };
    fetchPost();
  }, [id]);

  // ... rest of component
}
```

**NEW CODE** (Supabase with Slug):
```javascript
// pages/BlogPost.jsx
import { useParams } from 'react-router-dom';
import api from '../utils/api';

export default function BlogPost() {
  const { slug } = useParams();  // ✅ NEW: expects slug
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await api.get(`/api/blog-posts/${slug}`);
      setPost(response.data);
    };
    fetchPost();
  }, [slug]);

  // ... rest of component
}
```

### Example: BlogList Component

**OLD CODE**:
```javascript
// pages/BlogList.jsx
export default function BlogList() {
  const navigate = useNavigate();

  const handlePostClick = (post) => {
    navigate(`/blog/${post._id}`);  // ❌ OLD: using _id
  };

  return (
    <div>
      {posts.map(post => (
        <div key={post._id} onClick={() => handlePostClick(post)}>
          <h2>{post.title}</h2>
        </div>
      ))}
    </div>
  );
}
```

**NEW CODE**:
```javascript
// pages/BlogList.jsx
export default function BlogList() {
  const navigate = useNavigate();

  const handlePostClick = (post) => {
    navigate(`/blog/${post.slug}`);  // ✅ NEW: using slug
  };

  return (
    <div>
      {posts.map(post => (
        <div key={post.id} onClick={() => handlePostClick(post)}>
          <h2>{post.title}</h2>
        </div>
      ))}
    </div>
  );
}
```

## 🛒 Step 5: Update Product Routes

**Router Configuration**:
```javascript
// Update your router configuration

// OLD
<Route path="/products/:id" element={<ProductPage />} />
<Route path="/blog/:id" element={<BlogPost />} />

// NEW
<Route path="/products/:slug" element={<ProductPage />} />
<Route path="/blog/:slug" element={<BlogPost />} />
```

## 🔐 Step 6: Update Authentication

**Admin Login Flow**:
```javascript
// Login
const response = await api.post('/api/auth/login', {
  email: 'admin@example.com',
  password: 'Admin@123'
});

// Store token
localStorage.setItem('token', response.data.token);

// Get current user
const user = await api.get('/api/auth/me');
```

## 📤 Step 7: Update Image Upload

**Blog Featured Image**:
```javascript
// Uploading a blog featured image
const formData = new FormData();
formData.append('image', imageFile);

const response = await api.post('/api/upload/blog', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

const imageUrl = response.data.imageUrl;
```

**Product Images**:
```javascript
// Uploading product images
const formData = new FormData();
formData.append('images', imageFile1);
formData.append('images', imageFile2);

const response = await api.post('/api/upload/product', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

const imageUrls = response.data.imageUrl;
```

## 📋 Complete Checklist for Frontend

- [ ] Create `frontend/.env` with `VITE_API_URL`
- [ ] Update all route definitions to use `:slug` instead of `:id`
- [ ] Update all `navigate()` calls to use `post.slug` and `product.slug`
- [ ] Update `useParams()` to destructure `slug` not `id`
- [ ] Update all `key={item._id}` to `key={item.id}`
- [ ] Update all API calls to use slug-based endpoints
- [ ] Update image URLs - they now come from Supabase Storage
- [ ] Test all navigation
- [ ] Test all API calls
- [ ] Test image uploads

## 🧪 Testing Your Frontend

1. **Start backend**: `npm run dev` (in backend folder)
2. **Start frontend**: `npm run dev` (in frontend folder)
3. **Test login**: Visit http://localhost:5173, login with admin@example.com / Admin@123
4. **Test blog**: Click on a blog post - should load via slug
5. **Test products**: Click on a product - should load via slug
6. **Test images**: Verify images load from Supabase
7. **Test upload**: Try uploading an image in admin panel

## 🆘 Common Issues

**Issue**: Images won't load
```
Solution: Check image URL points to Supabase Storage (dprajohzhpieaskoqzdh.supabase.co)
```

**Issue**: 404 on post click
```
Solution: Ensure using slug in URL, not ID. Check route param name is :slug
```

**Issue**: Upload fails
```
Solution: Check CORS headers. Backend CORS includes origin http://localhost:5173
```

**Issue**: Auth token not working
```
Solution: Verify Authorization header format: "Bearer YOUR_TOKEN_HERE"
```

---

**Your frontend is now ready to integrate with Supabase!** 🚀
