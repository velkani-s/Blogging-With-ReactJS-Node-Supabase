# Blog Backend

This is the backend for the Amazon affiliate blog website.

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Create a `.env` file based on `.env.example` and fill in your values.

3. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

- POST /api/auth/register - Register admin user
- POST /api/auth/login - Login
- GET /api/blogPosts - Get blog posts
- POST /api/blogPosts - Create blog post (auth required)
- PUT /api/blogPosts/:id - Update blog post (auth required)
- DELETE /api/blogPosts/:id - Delete blog post (auth required)
- GET /api/products - Get products
- POST /api/products - Create product (auth required)
- PUT /api/products/:id - Update product (auth required)
- DELETE /api/products/:id - Delete product (auth required)
- POST /api/upload - Upload image (auth required)
