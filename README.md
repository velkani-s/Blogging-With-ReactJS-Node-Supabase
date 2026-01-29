# Affiliate Blog

A full-stack blog website for Amazon affiliate marketing.

## Features

- Home page with latest blog posts and featured products
- Blog section with posts, categories, and tags
- Product review section with ratings, pros/cons, and affiliate links
- Admin panel for managing content
- Search functionality
- Responsive design
- SEO friendly with dynamic meta tags
- Affiliate disclosure

## Tech Stack

- Frontend: React.js with Vite, React Router, Axios, Tailwind CSS
- Backend: Node.js, Express.js, MongoDB
- Authentication: JWT
- Image Upload: Cloudinary
- Deployment: Vercel (frontend) + Heroku/Render (backend)

## Setup Instructions

### Backend

1. Navigate to the `backend` directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```
   cp .env.example .env
   ```

4. Fill in your environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secret key for JWT
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Your Cloudinary credentials

5. Start the server:
   ```
   npm run dev
   ```

### Frontend

1. Navigate to the `frontend` directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Example Data

### Blog Posts

1. **Title:** "Top 5 Wireless Headphones for 2024"
   - **Content:** Review of popular wireless headphones
   - **Category:** Electronics
   - **Tags:** headphones, wireless, audio

2. **Title:** "Best Coffee Makers Under $100"
   - **Content:** Comparison of affordable coffee makers
   - **Category:** Kitchen
   - **Tags:** coffee, kitchen, appliances

3. **Title:** "Ultimate Guide to Fitness Trackers"
   - **Content:** Comprehensive review of fitness trackers
   - **Category:** Fitness
   - **Tags:** fitness, health, wearables

### Products

1. **Name:** "Sony WH-1000XM5 Wireless Headphones"
   - **Price:** $349.99
   - **Rating:** 5
   - **Pros:** Excellent noise cancellation, great sound quality, comfortable
   - **Cons:** Expensive, heavy

2. **Name:** "Ninja CM401 Coffee Maker"
   - **Price:** $79.99
   - **Rating:** 4
   - **Pros:** Easy to use, good coffee quality, programmable
   - **Cons:** Takes up counter space

3. **Name:** "Fitbit Charge 5"
   - **Price:** $149.95
   - **Rating:** 4
   - **Pros:** Accurate tracking, long battery life, stylish design
   - **Cons:** Screen could be brighter

4. **Name:** "Instant Pot Duo 7-in-1"
   - **Price:** $89.99
   - **Rating:** 5
   - **Pros:** Versatile, easy to clean, saves time
   - **Cons:** Learning curve for beginners

5. **Name:** "Ring Video Doorbell"
   - **Price:** $59.99
   - **Rating:** 4
   - **Pros:** Easy installation, good video quality, motion detection
   - **Cons:** Subscription required for full features

## Deployment

### Backend (Heroku/Render)

1. Create a new app on Heroku or Render
2. Connect your GitHub repository
3. Set environment variables in the dashboard
4. Deploy

### Frontend (Vercel)

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Set the build command to `npm run build`
4. Deploy

## Admin Setup

1. Register an admin user by making a POST request to `/api/auth/register`:

   ```json
   {
     "username": "admin",
     "password": "your_secure_password"
   }
   ```

2. Use the returned token for authentication in subsequent requests.

## Security Notes

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Input validation is implemented
- CORS is enabled
- Rate limiting is applied

## License

This project is for educational purposes. Ensure compliance with Amazon's affiliate program terms.
