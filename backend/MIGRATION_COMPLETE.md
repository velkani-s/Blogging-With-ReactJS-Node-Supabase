# 🚀 MongoDB to Supabase Migration - Complete Implementation

This backend has been successfully migrated from **MongoDB + Mongoose** to **Supabase PostgreSQL + Prisma ORM**.

## ✅ What's Been Done

### 🔄 Database Migration
- ✅ MongoDB → PostgreSQL (Supabase)
- ✅ Mongoose → Prisma ORM
- ✅ Schema redesigned for relational model
- ✅ All data models converted

### 🔐 Authentication
- ✅ JWT-based admin authentication (unchanged API)
- ✅ Password hashing with bcrypt
- ✅ Protected admin routes

### 📁 File Storage
- ✅ Cloudinary → Supabase Storage
- ✅ Image upload/delete helpers created
- ✅ Public URL generation for images

### 🌐 API Endpoints
- ✅ All REST endpoints updated to Prisma
- ✅ Same routes, improved performance
- ✅ Better error handling
- ✅ Pagination and filtering

### 📊 Features Preserved
- ✅ Blog posts with categories and tags
- ✅ Products with reviews and ratings
- ✅ Comments and likes on posts
- ✅ SEO meta tags
- ✅ Amazon affiliate links
- ✅ Affiliate disclosure statements

## 📦 Dependencies Updated

### Removed
- `mongoose` (MongoDB ODM)
- `cloudinary` & `multer-storage-cloudinary`

### Added
- `@prisma/client` & `prisma` (ORM)
- `@supabase/supabase-js` (Supabase client)
- `@supabase/storage-js` (File storage)

### Kept
- `bcryptjs` (Password hashing)
- `jsonwebtoken` (JWT auth)
- `express` (Framework)
- `cors`, `helmet`, `express-rate-limit` (Security)

## 🎯 Database Schema (Prisma)

### Core Models
- **User** - Admin accounts (id, username, email, password, role)
- **Category** - Post/Product categories (name, slug, description)
- **Tag** - Post/Product tags (name, slug)
- **BlogPost** - Blog articles (title, content, featured image, author, status)
- **Product** - Affiliate products (name, price, description, images, rating)

### Related Models
- **Comment** - Blog comments (content, author, post)
- **Like** - Post likes (post_id, count)
- **Review** - Product reviews (rating, comment, author)
- **ProductImage** - Product images (url, product_id)
- **ProductAttribute** - Product attributes (name, value, product_id)
- **ProductVariant** - Product variants (name, value, inventory)

## 🚀 Getting Started

### 1. Setup Supabase
```bash
# Create project at supabase.com
# Get DATABASE_URL from Settings > Database
# Create storage buckets: blog-images, product-images
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit with Supabase credentials
```

### 3. Setup Database
```bash
npm install
npm run prisma:generate
npm run prisma:deploy
npm run prisma:seed  # Load sample data
```

### 4. Start Server
```bash
npm run dev
# Server at http://localhost:5000
```

## 📚 Documentation

- **[SUPABASE_MIGRATION_GUIDE.md](./SUPABASE_MIGRATION_GUIDE.md)** - Complete migration guide (setup, deployment, troubleshooting)
- **[QUICK_START.md](./QUICK_START.md)** - Fast setup guide for developers
- **[prisma/schema.prisma](./prisma/schema.prisma)** - Database schema definition

## 🔑 API Authentication

All admin endpoints require JWT token:

```bash
# Get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123"}'

# Use token in requests
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/blog-posts
```

## 📋 API Endpoints

### Auth (Public)
```
POST   /api/auth/login       - Admin login
GET    /api/auth/me          - Current user (protected)
PUT    /api/auth/profile     - Update profile (protected)
```

### Blog Posts
```
GET    /api/blog-posts       - List published posts
GET    /api/blog-posts/:slug - Get single post
POST   /api/blog-posts       - Create (admin)
PUT    /api/blog-posts/:id   - Update (admin)
DELETE /api/blog-posts/:id   - Delete (admin)
```

### Products
```
GET    /api/products         - List products
GET    /api/products/:slug   - Get single product
POST   /api/products         - Create (admin)
PUT    /api/products/:id     - Update (admin)
DELETE /api/products/:id     - Delete (admin)
GET    /api/products/featured - Featured products
```

## 🎨 Key Features

### ✨ Blog System
- Draft/Publish workflow
- Categories and tags
- Comments and likes
- View counting
- SEO meta tags
- Featured images

### 🛍️ Product System
- Product variants and attributes
- Star ratings (1-5)
- Customer reviews
- Multiple images per product
- Featured products
- Price tracking
- Stock management

### 🏷️ Affiliate Features
- Amazon affiliate links
- Affiliate disclosure text
- Built-in on every page
- Compliant with FTC guidelines

### 🔒 Security
- Bcrypt password hashing
- JWT token authentication
- Rate limiting (100 req/15min)
- Helmet security headers
- CORS protection
- Input validation

## 📊 Sample Data

Database seeds with:
- 1 Admin user
- 3 Categories (Technology, Home & Garden, Sports)
- 3 Blog posts with SEO content
- 5 Featured products
- Affiliate links and disclosures

## 🔄 Data Migration from MongoDB

If migrating existing data:

1. Export MongoDB collections as JSON
2. Transform to PostgreSQL format
3. Seed using custom script
4. Verify data integrity

Contact support for migration assistance.

## 🚢 Production Deployment

### Backend (Render)
```bash
# Set environment variables in Render dashboard
# Deploy automatically from GitHub push
```

### Frontend (Vercel)
```bash
# Set VITE_API_URL=https://your-render-backend.onrender.com
# Deploy from GitHub
```

### Database (Supabase)
- Use Connection Pooling for better performance
- Enable backup and replication
- Monitor query performance

## 🐛 Troubleshooting

### Connection Issues
- Verify `DATABASE_URL` format
- Check Supabase firewall rules
- Test query in Supabase dashboard

### Migration Issues
- Ensure all tables created successfully
- Check Prisma logs: `prisma migrate status`
- Reset database if needed: `npx prisma migrate reset`

See [SUPABASE_MIGRATION_GUIDE.md](./SUPABASE_MIGRATION_GUIDE.md#troubleshooting) for more.

## 🛠️ Maintenance

### Regular Tasks
```bash
# View database state
npx prisma studio

# Update Prisma
npm update @prisma/client prisma

# Check migrations status
npx prisma migrate status

# Reset database (development only)
npx prisma migrate reset
```

## 📈 Performance Tips

- Use indexes on frequently searched fields (done in schema)
- Enable query caching
- Use connection pooling
- Monitor slow queries in Supabase logs
- Consider read replicas for scaling

## 🔐 Backup Strategy

### Automated Backups
- Supabase provides daily backups (free tier)
- 7-day retention
- Manual backups available

### Manual Export
```bash
# Export data from Supabase
npx prisma db push --skip-generate
```

## 📞 Support

- **Prisma**: https://www.prisma.io/docs/
- **Supabase**: https://supabase.com/docs
- **Express**: https://expressjs.com/
- **Issues**: Create GitHub issue with logs

## 📄 License

Same as main project - Check root LICENSE file

---

**Migration Completed**: January 2026  
**Status**: ✅ Production Ready  
**Version**: 2.0.0 (Supabase Edition)

