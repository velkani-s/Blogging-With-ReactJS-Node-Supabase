# ✅ MongoDB to Supabase Migration Checklist

Complete checklist for implementing the Supabase migration for your blogging website.

## 📋 Pre-Migration Requirements

- [ ] GitHub account for version control
- [ ] Supabase account (free tier)
- [ ] Render account for backend deployment
- [ ] Vercel account for frontend deployment
- [ ] Node.js 16+ installed locally
- [ ] npm installed
- [ ] Git installed

## 🏗️ Backend Setup

### Step 1: Install Dependencies
- [ ] Run `npm install` in backend folder
- [ ] All dependencies installed successfully
- [ ] No errors in installation

### Step 2: Create Supabase Project
- [ ] Created Supabase account at https://supabase.com
- [ ] Created new project
- [ ] Noted project region
- [ ] Generated secure password
- [ ] Project is active and initialized

### Step 3: Get Supabase Credentials
- [ ] Copied `Project URL` → `SUPABASE_URL`
- [ ] Copied `anon public` key → `SUPABASE_ANON_KEY`
- [ ] Copied `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Copied `Connection string` → `DATABASE_URL`
- [ ] Connection string uses correct format

### Step 4: Create Storage Buckets
- [ ] Created `blog-images` bucket
- [ ] Set public access on `blog-images`
- [ ] Created `product-images` bucket
- [ ] Set public access on `product-images`
- [ ] Both buckets are ready for uploads

### Step 5: Configure Environment
- [ ] Copied `.env.example` to `.env`
- [ ] Set `NODE_ENV=development`
- [ ] Set `PORT=5000` (or your preferred port)
- [ ] Filled in all Supabase variables
- [ ] Generated strong `JWT_SECRET` (32+ chars)
- [ ] Set `JWT_EXPIRE=7d`
- [ ] Set `FRONTEND_URL=http://localhost:5173`
- [ ] Saved .env file

### Step 6: Initialize Database
- [ ] Ran `npm run prisma:generate`
- [ ] Prisma client generated successfully
- [ ] Ran `npm run prisma:deploy`
- [ ] All migrations applied
- [ ] No database errors

### Step 7: Seed Sample Data
- [ ] Ran `npm run prisma:seed`
- [ ] Sample data created:
  - [ ] 1 admin user
  - [ ] 3 categories
  - [ ] 3 blog posts
  - [ ] 5 products with images
  - [ ] Product reviews
- [ ] All seeding completed without errors

### Step 8: Start Backend Server
- [ ] Ran `npm run dev`
- [ ] Server started on port 5000
- [ ] No connection errors
- [ ] Health check endpoint works: `http://localhost:5000/health`

### Step 9: Test Backend Endpoints
- [ ] **Auth**: `POST /api/auth/login`
  - [ ] Login with admin@example.com / Admin@123
  - [ ] Received JWT token
  - [ ] Token stored in localStorage
- [ ] **Blog Posts**: `GET /api/blog-posts`
  - [ ] Retrieved published posts
  - [ ] Pagination works
  - [ ] Search works
- [ ] **Blog Post Detail**: `GET /api/blog-posts/:slug`
  - [ ] Retrieved single post by slug
  - [ ] Views incremented
- [ ] **Products**: `GET /api/products`
  - [ ] Retrieved product list
  - [ ] Filtering works
  - [ ] Sorting works
- [ ] **Product Detail**: `GET /api/products/:slug`
  - [ ] Retrieved single product
  - [ ] Reviews displayed
  - [ ] Rating shown

## 🎨 Frontend Updates

### Step 10: Update Environment Variables
- [ ] Created/updated `.env` in frontend folder
- [ ] Set `VITE_API_URL=http://localhost:5000`
- [ ] Verified file is NOT in git

### Step 11: Update API Integration
- [ ] Updated `utils/api.js` configuration
- [ ] JWT token handling implemented
- [ ] Authorization headers added to requests
- [ ] Error handling updated

### Step 12: Update Routes to Use Slugs
- [ ] Changed blog route from `/blog/:id` to `/blog/:slug`
- [ ] Changed product route from `/products/:id` to `/products/:slug`
- [ ] Updated all Link components to use slugs
- [ ] Updated all API calls to use slugs

### Step 13: Update Component API Calls
- [ ] Updated `BlogList.jsx` to fetch posts
- [ ] Updated `BlogPost.jsx` to fetch by slug
- [ ] Updated `ProductList.jsx` to fetch products
- [ ] Updated `ProductPage.jsx` to fetch by slug
- [ ] Updated search functionality
- [ ] Updated filter functionality

### Step 14: Update Image Handling
- [ ] Featured images display correctly
- [ ] Product images display correctly
- [ ] Image URLs point to Supabase Storage
- [ ] Placeholder images work if missing

### Step 15: Test Frontend Components
- [ ] Homepage loads
- [ ] Blog post list displays
- [ ] Blog post detail loads (by slug)
- [ ] Product list displays
- [ ] Product detail loads (by slug)
- [ ] Search functionality works
- [ ] Filters work
- [ ] Images load from Supabase

### Step 16: Test Admin Panel
- [ ] Admin login works
- [ ] Admin can create blog post
- [ ] Admin can upload featured image
- [ ] Admin can publish post
- [ ] Admin can create product
- [ ] Admin can upload product images
- [ ] Admin can edit content
- [ ] Admin can delete content

### Step 17: Test Authentication Flow
- [ ] Can logout
- [ ] Redirects to login when unauthorized
- [ ] Token refresh works
- [ ] Session persists on refresh
- [ ] Protected routes blocked without token

### Step 18: Test All Features
- [ ] **Blog Features**:
  - [ ] Comments work
  - [ ] Likes work
  - [ ] Categories filter works
  - [ ] Tags filter works
  - [ ] Search works
  - [ ] Pagination works
  - [ ] SEO meta tags present
  - [ ] Affiliate disclosures visible
- [ ] **Product Features**:
  - [ ] Reviews work
  - [ ] Ratings work
  - [ ] Amazon links work
  - [ ] Affiliate disclosures visible
  - [ ] Product filtering works
  - [ ] Product sorting works
  - [ ] Stock status shows

## 🧪 Local Testing

### Step 19: Frontend Tests
- [ ] All pages load without errors
- [ ] No console errors
- [ ] Responsive design works (mobile/tablet/desktop)
- [ ] Dark mode (if applicable) works
- [ ] All links work
- [ ] All buttons work
- [ ] Form validation works

### Step 20: Backend Tests
- [ ] All endpoints respond correctly
- [ ] Error handling works
- [ ] Validation works
- [ ] Authorization works
- [ ] Rate limiting works
- [ ] CORS works with frontend
- [ ] No security warnings

### Step 21: Database Tests
- [ ] Data persists on restart
- [ ] Relationships work correctly
- [ ] Indexes perform well
- [ ] Backups working
- [ ] View Prisma Studio: `npx prisma studio`

## 🚀 Production Deployment

### Step 22: Deploy Backend to Render

- [ ] Created Render account at https://render.com
- [ ] Connected GitHub repository
- [ ] Created Web Service
- [ ] Set build command: `npm install`
- [ ] Set start command: `npm start`
- [ ] Added environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `DATABASE_URL` (Connection Pooling from Supabase)
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `JWT_SECRET`
  - [ ] `JWT_EXPIRE=7d`
  - [ ] `PORT=5000`
  - [ ] `FRONTEND_URL=https://your-vercel-app.vercel.app`
- [ ] Backend deployed successfully
- [ ] Health check passes: `https://your-render-backend.onrender.com/health`
- [ ] Can login: test `/api/auth/login` endpoint

### Step 23: Deploy Frontend to Vercel

- [ ] Created Vercel account at https://vercel.com
- [ ] Connected GitHub repository
- [ ] Selected frontend folder
- [ ] Added environment variable:
  - [ ] `VITE_API_URL=https://your-render-backend.onrender.com`
- [ ] Frontend deployed successfully
- [ ] All pages load from production
- [ ] API calls use Render backend
- [ ] No CORS errors

### Step 24: Post-Deployment Testing

- [ ] Backend health check works
- [ ] Frontend loads from Vercel
- [ ] Can login with production backend
- [ ] Blog posts display
- [ ] Products display
- [ ] Images load from Supabase
- [ ] Search works
- [ ] Admin functions work
- [ ] No console errors
- [ ] No network errors

## 📊 Performance Verification

### Step 25: Monitor Performance
- [ ] Frontend Lighthouse score > 80
- [ ] Backend response times < 200ms
- [ ] Database queries < 100ms
- [ ] Images load quickly
- [ ] No N+1 queries
- [ ] Caching working

### Step 26: Security Checks
- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] CORS configured correctly
- [ ] Rate limiting working
- [ ] JWT validation working
- [ ] No sensitive data in logs
- [ ] Passwords hashed properly

## 🔄 Data & Backups

### Step 27: Backup Strategy
- [ ] Supabase automatic backups enabled
- [ ] Can access backups in Supabase
- [ ] Know how to restore from backup
- [ ] Documented backup procedures
- [ ] Tested backup restore

### Step 28: Domain & Email (Optional)
- [ ] Custom domain configured (if needed)
- [ ] SSL certificate working
- [ ] Email notifications setup (if needed)
- [ ] Contact form working (if needed)

## 📝 Documentation & Handover

### Step 29: Complete Documentation
- [ ] Setup guide written
- [ ] API documentation complete
- [ ] Troubleshooting guide done
- [ ] Deployment instructions clear
- [ ] Environment variables documented
- [ ] Database schema explained
- [ ] API endpoints listed
- [ ] Feature list complete

### Step 30: Team Handover
- [ ] Shared Render dashboard access
- [ ] Shared Vercel dashboard access
- [ ] Shared Supabase access
- [ ] Documented credentials
- [ ] Created runbook
- [ ] Trained team on deployment
- [ ] Set up alerts/monitoring

## ✨ Launch Preparation

### Step 31: Final Review
- [ ] All tests passing
- [ ] No known bugs
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Documentation complete
- [ ] Team trained
- [ ] Ready for users

### Step 32: Launch!
- [ ] Announced to users
- [ ] Monitor for issues
- [ ] Keep logs for debugging
- [ ] Ready to scale

---

## 🎯 Summary

**Total Steps**: 32 major checkpoints
**Estimated Time**: 2-3 hours for complete setup
**Difficulty**: Medium (technical knowledge helpful)
**Free Tier**: 100% compatible ✅

---

## 📞 Support Resources

If you get stuck:

1. **Check Docs**
   - [Supabase Migration Guide](./backend/SUPABASE_MIGRATION_GUIDE.md)
   - [Quick Start](./backend/QUICK_START.md)
   - [API Integration Guide](./frontend/API_INTEGRATION_GUIDE.md)

2. **Check Logs**
   - Backend console: `npm run dev` output
   - Frontend console: Browser DevTools
   - Supabase logs: Dashboard > Database
   - Render logs: Dashboard > Logs

3. **Common Issues**
   - See Troubleshooting in SUPABASE_MIGRATION_GUIDE.md

4. **Get Help**
   - Prisma: https://www.prisma.io/docs/
   - Supabase: https://supabase.com/docs
   - Render: https://render.com/docs
   - Vercel: https://vercel.com/docs

---

**Good luck with your migration!** 🚀
