# Deployment Guide for Render

This guide will help you deploy your DOR monorepo to Render.

## Prerequisites

1. A GitHub account with your code pushed to a repository
2. A MongoDB Atlas account (or another MongoDB hosting service)
3. A Render account (sign up at https://render.com)

## Step 1: Prepare MongoDB

1. Create a MongoDB Atlas cluster (free tier available)
2. Get your connection string (MongoDB URI)
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/dor-application?retryWrites=true&w=majority`
3. Whitelist Render's IP addresses (or use 0.0.0.0/0 for development)

## Step 2: Deploy to Render

### Option A: Using render.yaml (Recommended - Single Service Deployment)

This will deploy your **entire monorepo as a single service** where:
- The backend serves both API endpoints and the frontend
- Frontend is built during deployment and served as static files
- Everything runs on one URL (e.g., `https://dor-app.onrender.com`)

1. Push your code to GitHub (make sure `render.yaml` is in the root)
2. Go to https://dashboard.render.com
3. Click "New +" → "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect `render.yaml` and create the service
6. Set the following environment variables in the Render dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a strong random string (e.g., use `openssl rand -base64 32`)
7. Click "Apply" and wait for deployment

**How it works:**
- Build command: Builds the frontend (`frontend/dist`) and installs backend dependencies
- Start command: Starts the backend server, which serves the frontend in production
- All traffic goes to one service - API calls to `/api/*` and frontend to all other routes

### Option B: Manual Setup (Single Service)

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `dor-app`
   - **Environment**: `Node`
   - **Root Directory**: Leave empty (uses repo root)
   - **Build Command**: `cd frontend && npm install && npm run build && cd ../backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (or choose a paid plan)
5. Add environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render sets this automatically, but you can specify)
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong random secret key
   - `JWT_EXPIRE`: `30d` (optional)

## Step 3: Verify Deployment

1. Once deployed, Render will provide a URL (e.g., `https://dor-app.onrender.com`)
2. Visit the URL to see your application
3. Check the logs in Render dashboard for any errors

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | Yes | `production` |
| `PORT` | Server port | No | `10000` (Render sets this) |
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT tokens | Yes | Random string |
| `JWT_EXPIRE` | JWT expiration time | No | `30d` |

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check build logs in Render dashboard

### MongoDB Connection Issues
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlasee
- Ensure database user has proper permissions

### Frontend Not Loading
- Verify frontend build completed successfully
- Check that `frontend/dist` directory exists after build
- Review server logs for static file serving errors

### API Calls Failing
- Check CORS settings (should allow your Render domain)
- Verify API routes are working (test with `/api` endpoint)
- Check browser console for CORS errors

## Notes

- Render free tier services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to a paid plan for production use
- Static files (uploads) are stored in the backend `uploads` directory
- For production, consider using cloud storage (AWS S3, Cloudinary) for file uploads

## Alternative: Separate Frontend/Backend Deployment

If you prefer to deploy frontend and backend as **separate services**:

1. Deploy backend as a Web Service (Node.js)
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
2. Deploy frontend as a Static Site
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`
   - Set environment variable: `VITE_API_BASE_URL` = your backend URL (e.g., `https://dor-backend.onrender.com/api`)
3. Update `render.yaml` to uncomment the separate services configuration (lines 22-49)

**Note:** The default configuration deploys everything as a **single service**, which is simpler and more cost-effective for most use cases.

