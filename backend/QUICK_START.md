# Supabase Backend - Quick Start

This guide helps you get the Supabase backend running locally or in production.

## 🚀 Quick Local Setup (5 minutes)

### Prerequisites
- Node.js 16+
- npm or yarn
- Supabase account (free tier)
- Git

### 1. Clone & Install

```bash
# Clone repository
git clone https://github.com/your-username/Blogging-With-ReactJS-NodeJS.git
cd backend

# Install dependencies
npm install
```

### 2. Create `.env` File

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

DATABASE_URL=postgresql://postgres:PASSWORD@db.supabase.co:5432/postgres
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

JWT_SECRET=generate-a-random-key-here-min-32-chars
JWT_EXPIRE=7d
```

### 3. Setup Database

```bash
# Generate Prisma client
npm run prisma:generate

# Deploy migrations to Supabase
npm run prisma:deploy

# Seed with sample data
npm run prisma:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Server runs at: `http://localhost:5000`

### 5. Test API

```bash
# Check health
curl http://localhost:5000/health

# Try login (after seeding)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123"}'
```

## 📚 Useful Commands

```bash
# Development with auto-reload
npm run dev

# Production build
npm start

# Create new database migration
npm run prisma:migrate

# View database in Prisma Studio
npx prisma studio

# Seed database again
npm run prisma:seed

# Generate Prisma types
npm run prisma:generate
```

## 🔑 Environment Variables Explained

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | Set to `development` locally, `production` on server |
| `PORT` | Server port (default: 5000) |
| `DATABASE_URL` | PostgreSQL connection string from Supabase |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Public API key for browser requests |
| `JWT_SECRET` | Secret for signing JWT tokens (min 32 chars) |

## 🔐 Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output to `JWT_SECRET` in `.env`

## 📊 API Endpoints Overview

### Authentication
```bash
POST   /api/auth/login           # Admin login
POST   /api/auth/register        # Register admin
GET    /api/auth/me              # Get current user
PUT    /api/auth/profile         # Update profile
```

### Blog Posts
```bash
GET    /api/blog-posts           # List posts (paginated)
GET    /api/blog-posts/:slug     # Get single post
POST   /api/blog-posts           # Create (admin)
PUT    /api/blog-posts/:id       # Update (admin)
DELETE /api/blog-posts/:id       # Delete (admin)
GET    /api/blog-posts/categories # Get all categories
```

### Products
```bash
GET    /api/products             # List products
GET    /api/products/:slug       # Get single product
POST   /api/products             # Create (admin)
PUT    /api/products/:id         # Update (admin)
DELETE /api/products/:id         # Delete (admin)
GET    /api/products/featured    # Featured products
POST   /api/products/:id/reviews # Add review
GET    /api/products/:id/reviews # Get reviews
```

## 🐛 Common Issues & Fixes

### "Connection refused"
```bash
# Check DATABASE_URL in .env
# Verify Supabase database is online
# Test connection in Supabase dashboard
```

### "JWT_SECRET must be at least 32 characters"
```bash
# Generate new secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Add to .env file
```

### "Cannot find module '@prisma/client'"
```bash
npm install
npm run prisma:generate
```

### "Port 5000 already in use"
```bash
# Use different port
PORT=5001 npm run dev

# Or kill process using port 5000
lsof -ti:5000 | xargs kill -9
```

## 📁 Project Structure

```
backend/
├── config/
│   ├── prisma.js              # Prisma client
│   ├── supabaseStorage.js     # File upload helper
│   └── database.js            # (deprecated - was MongoDB)
├── controllers/
│   ├── authController.js      # Auth logic
│   ├── blogPostController.js  # Blog CRUD
│   └── productController.js   # Product CRUD
├── middleware/
│   ├── auth.js                # JWT verification
│   ├── upload.js              # File upload middleware
│   └── validation.js          # Input validation
├── routes/
│   ├── auth.js                # Auth routes
│   ├── blogPosts.js           # Blog routes
│   └── products.js            # Product routes
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.js                # Sample data
├── server.js                  # Express app
├── package.json               # Dependencies
├── .env.example               # Template env vars
└── SUPABASE_MIGRATION_GUIDE.md # Full guide
```

## 🚀 Production Deployment

### Deploy to Render

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create new Web Service
4. Connect GitHub repo
5. Set environment variables from `.env`
6. Deploy!

### Set Render Environment Variables

```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://...@db.supabase.co:5432/postgres
SUPABASE_URL=https://...supabase.co
SUPABASE_ANON_KEY=eyJ...
JWT_SECRET=your-32-char-secret
FRONTEND_URL=https://your-vercel-frontend.vercel.app
```

### Database Connection String

Use **Connection Pooling** from Supabase:
- Go to Settings > Database > Connection string
- Select "Connection pooling"
- Copy and paste as `DATABASE_URL`

## 🔄 Updating Code

After pulling new changes:

```bash
# Install new dependencies
npm install

# Run migrations if schema changed
npm run prisma:deploy

# Restart server
npm run dev
```

## 📖 Learn More

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Supabase Guide](https://supabase.com/docs)
- [Express.js Tutorial](https://expressjs.com/)
- [JWT Authentication](https://jwt.io/)

## 💬 Support

For issues or questions:

1. Check the [SUPABASE_MIGRATION_GUIDE.md](./SUPABASE_MIGRATION_GUIDE.md)
2. Review error logs in terminal
3. Check [Prisma Docs](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
4. Open GitHub issue

---

Happy coding! 🎉
