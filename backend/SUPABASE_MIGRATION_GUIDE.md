# MongoDB to Supabase Migration Guide

This guide walks you through migrating your full-stack blogging website from MongoDB Atlas to Supabase (PostgreSQL) with Prisma ORM.

## 🎯 What Changed

### Database
- **Before**: MongoDB (NoSQL documents)
- **After**: Supabase PostgreSQL (SQL relations)

### ORM
- **Before**: Mongoose
- **After**: Prisma

### File Storage
- **Before**: Cloudinary
- **After**: Supabase Storage

### Authentication
- **Before**: JWT stored in MongoDB
- **After**: JWT stored in PostgreSQL

## 📋 Pre-Migration Checklist

- [ ] Have a Supabase account (free tier)
- [ ] Have a Render account for backend deployment
- [ ] Have a Vercel account for frontend deployment
- [ ] Export your MongoDB data (if migrating existing data)
- [ ] Set up Amazon Associate ID for affiliate links

## ⚙️ Step-by-Step Setup

### 1. Create Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Enter project name (e.g., "blogging-app")
5. Set a strong password
6. Select your region
7. Click "Create new project"

### 2. Set Up Database

1. In Supabase Dashboard, go to **SQL Editor**
2. Wait for PostgreSQL to initialize (2-3 minutes)
3. Copy your connection string from **Settings > Database**

### 3. Set Up Storage

Create two storage buckets for file uploads:

1. Go to **Storage > Buckets**
2. Click "New Bucket"
3. Name: `blog-images`
   - Public bucket: Yes
   - File size limit: 5MB
4. Repeat for `product-images`

### 4. Generate API Keys

1. Go to **Settings > API**
2. Copy `Project URL` → `SUPABASE_URL`
3. Copy `anon public` key → `SUPABASE_ANON_KEY`
4. Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 5. Local Setup

#### A. Install Dependencies

```bash
cd backend
npm install
```

#### B. Set Environment Variables

```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your Supabase credentials
NODE_ENV=development
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.supabase.co:5432/postgres
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your-long-random-secret-key-here
JWT_EXPIRE=7d
PORT=5000
FRONTEND_URL=http://localhost:5173
```

#### C. Run Prisma Migrations

```bash
# Generate Prisma client
npx prisma generate

# Create database schema
npx prisma migrate deploy

# Optional: Run migrations (if first time)
npx prisma migrate dev --name init
```

#### D. Seed Database (Optional)

```bash
# This adds sample data for testing
npx prisma db seed
```

#### E. Start Backend

```bash
npm run dev
```

Expected output:
```
Server running in development mode on port 5000
```

### 6. Test Endpoints

#### Create Admin User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePassword123"
  }'
```

#### Get Blog Posts

```bash
curl http://localhost:5000/api/blog-posts?status=published
```

## 📊 Database Schema

### Tables

#### `User` (Admin Authentication)
```sql
- id (String, Primary Key)
- username (String, Unique)
- email (String, Unique)
- password (String, hashed with bcrypt)
- role (String: admin, user)
- isActive (Boolean)
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### `BlogPost`
```sql
- id (String, Primary Key)
- title (String, max 100)
- slug (String, Unique)
- content (Text)
- excerpt (String, max 300)
- featuredImage (String, Supabase URL)
- status (String: draft, published, archived)
- authorId (String, Foreign Key → User)
- categoryId (String, Foreign Key → Category)
- views (Int, default 0)
- publishedAt (DateTime, nullable)
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### `Product`
```sql
- id (String, Primary Key)
- name (String, max 100)
- slug (String, Unique)
- description (String, max 1000)
- price (Float)
- originalPrice (Float, nullable)
- brand (String, nullable)
- categoryId (String, Foreign Key → Category)
- quantity (Int)
- sku (String, Unique)
- status (String: active, inactive, discontinued)
- featured (Boolean)
- metaTitle (String, max 60)
- metaDescription (String, max 160)
- amazonLink (String, nullable)
- affiliateNote (String, nullable)
- averageRating (Float, default 0)
- reviewCount (Int, default 0)
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### `Category`
```sql
- id (String, Primary Key)
- name (String, Unique)
- slug (String, Unique)
- description (String, nullable)
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### `Tag`
```sql
- id (String, Primary Key)
- name (String, Unique)
- slug (String, Unique)
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### `ProductImage`
```sql
- id (String, Primary Key)
- url (String, Supabase Storage URL)
- alt (String, nullable)
- productId (String, Foreign Key → Product)
- createdAt (DateTime)
```

#### `Comment`
```sql
- id (String, Primary Key)
- content (String, max 500)
- postId (String, Foreign Key → BlogPost)
- userId (String, Foreign Key → User)
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### `Review`
```sql
- id (String, Primary Key)
- rating (Int, 1-5)
- comment (String, max 500, nullable)
- productId (String, Foreign Key → Product)
- userId (String, Foreign Key → User)
- createdAt (DateTime)
- updatedAt (DateTime)
```

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Register admin (protected)
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Blog Posts
- `GET /api/blog-posts` - Get published posts (paginated, searchable)
- `GET /api/blog-posts/:slug` - Get single post
- `POST /api/blog-posts` - Create post (admin only)
- `PUT /api/blog-posts/:id` - Update post (admin)
- `DELETE /api/blog-posts/:id` - Delete post (admin)
- `POST /api/blog-posts/:id/comments` - Add comment
- `POST /api/blog-posts/:id/like` - Like/unlike post
- `GET /api/blog-posts/categories` - Get categories

### Products
- `GET /api/products` - Get products (paginated, filtered)
- `GET /api/products/:slug` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `DELETE /api/products/:id/images/:imageId` - Delete image
- `POST /api/products/:id/reviews` - Add review
- `GET /api/products/:id/reviews` - Get reviews
- `GET /api/products/featured` - Get featured products

## 🔒 Authentication

### How It Works

1. User sends credentials to `/api/auth/login`
2. Backend hashes password with bcrypt and compares
3. If valid, generates JWT token
4. Token sent to frontend, stored in localStorage
5. Frontend includes token in Authorization header for protected routes

### Protected Requests

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Password Security

- Passwords hashed with bcrypt (12 salt rounds)
- Never stored in plain text
- Only admin can create/update users
- Session expires after 7 days

## 📸 Image Uploads

### Supabase Storage Setup

```javascript
// Upload image to Supabase
const { uploadFile } = require('./config/supabaseStorage');

const uploadedFile = await uploadFile(file, 'blog-images', filename);
console.log(uploadedFile.url); // Public URL for storage
```

### Public URLs

All images are stored with public access:
```
https://your-project.supabase.co/storage/v1/object/public/blog-images/filename
```

### File Size Limits

- Blog images: 5MB max
- Product images: 5MB max per image, unlimited total

## 🌍 Deploying to Production

### Backend Deployment (Render)

1. Create account at https://render.com
2. Connect GitHub repository
3. Click "New" → "Web Service"
4. Select your repository
5. Configure:
   - **Name**: blog-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables from `.env`
7. Click "Create Web Service"

### Frontend Deployment (Vercel)

1. Create account at https://vercel.com
2. Connect GitHub repository
3. Click "Import Project"
4. Select your frontend folder
5. Add environment variable:
   ```
   VITE_API_URL=https://your-render-domain.onrender.com
   ```
6. Click "Deploy"

### Database Connection

From Supabase to Render:

1. In Supabase: **Settings > Database**
2. Copy `Connection pooling` string (PostgreSQL format)
3. In Render: Set `DATABASE_URL` environment variable

## 🔄 Data Migration (Existing Users)

If migrating from MongoDB to PostgreSQL:

1. Export MongoDB collections as JSON
2. Transform data format (MongoDB IDs → PostgreSQL)
3. Import into PostgreSQL using Prisma seed script
4. Verify data integrity
5. Run tests on all endpoints

## ✅ Testing Checklist

After migration:

- [ ] Admin login works
- [ ] Create blog post
- [ ] Upload blog featured image
- [ ] Publish blog post
- [ ] View blog post on frontend
- [ ] Add comment to post
- [ ] Like post
- [ ] Create product
- [ ] Upload product images
- [ ] Search products
- [ ] Filter by category
- [ ] Add product review
- [ ] Check affiliate links display
- [ ] Verify SEO meta tags

## 🐛 Troubleshooting

### Connection Error: "ECONNREFUSED 127.0.0.1:5432"

**Problem**: Backend cannot connect to Supabase

**Solution**:
- Verify `DATABASE_URL` is correct
- Check firewall allows connections
- Test from Supabase dashboard Query Editor

### "JWT Secret must be at least 32 characters"

**Solution**:
```bash
# Generate secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy to JWT_SECRET in .env
```

### "413 Payload Too Large"

**Problem**: File upload exceeds limit

**Solution**:
- Compress images before upload
- Reduce file size limit in `.env`
- Split large uploads

### "P2002 Unique Constraint"

**Problem**: Duplicate username or email

**Solution**:
- Check existing users in database
- Use unique values for new users
- Delete duplicates if needed

## 📚 Useful Resources

- [Prisma Docs](https://www.prisma.io/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Render Deployment](https://render.com/docs)
- [Vercel Deployment](https://vercel.com/docs)

## 🆘 Getting Help

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review Prisma/Supabase logs
3. Check backend console for errors
4. Verify environment variables
5. Test with curl commands
6. Review GitHub issues

## 📝 Next Steps

1. **Implement frontend API calls** using new endpoints
2. **Add more features**: categories, tags management
3. **Optimize performance**: add caching, indexing
4. **Improve SEO**: dynamic meta tags per page
5. **Add analytics**: track views, referrals
6. **Setup CI/CD**: auto-deploy on push

---

**Last Updated**: January 2026
**Status**: Production Ready
