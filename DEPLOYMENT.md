# Memora - Render Deployment Guide

## Prerequisites
- GitHub account with your Memora repository pushed
- Render account ([Sign up here](https://render.com))
- Netlify account for frontend ([Sign up here](https://netlify.com))
- Google Gemini API key

---

## Part 1: Deploy Backend to Render

### Step 1: Connect GitHub Repository
1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub account if not already connected
4. Select your **MemoraAI** repository

### Step 2: Configure Blueprint
Render will automatically detect `render.yaml` in your repository.

### Step 3: Set Environment Variables
Before deploying, you need to add your **GEMINI_API_KEY**:

1. In the Render dashboard, go to your service
2. Click **"Environment"** tab
3. Add the following environment variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `your_actual_gemini_api_key_here`

> **Note**: The other environment variables (CORS_ORIGINS, HOST, PORT) are already configured in `render.yaml`.

### Step 4: Deploy
1. Click **"Create Blueprint Instance"**
2. Render will:
   - Build your Docker image
   - Deploy the backend
   - Assign a public URL (e.g., `https://memora-backend.onrender.com`)

### Step 5: Verify Backend
Once deployed, test your backend:
```bash
curl https://your-backend-url.onrender.com/
```

Expected response:
```json
{
  "message": "AI Agent with Memory API",
  "version": "1.0.0",
  "status": "operational"
}
```

---

## Part 2: Deploy Frontend to Netlify

### Step 1: Build Configuration
1. Log in to [Netlify](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository

### Step 2: Configure Build Settings
- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/dist`

### Step 3: Set Environment Variable
Add the backend URL as an environment variable:

1. Go to **Site settings** → **Environment variables**
2. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com` (from Step 5 above)

### Step 4: Deploy
1. Click **"Deploy site"**
2. Netlify will build and deploy your frontend
3. You'll get a URL like `https://memora-xyz.netlify.app`

### Step 5: Update CORS in Render
Go back to Render and update the `CORS_ORIGINS` environment variable:

1. In Render dashboard → Your service → **Environment**
2. Edit `CORS_ORIGINS` to include your Netlify URL:
   ```
   https://your-netlify-url.netlify.app,http://localhost:5173
   ```
3. Save and **redeploy** the backend

---

## Verification Checklist

- [ ] Backend is live at Render URL
- [ ] Backend `/` endpoint returns status
- [ ] Frontend is live at Netlify URL
- [ ] Frontend can connect to backend (check browser console for errors)
- [ ] Chat functionality works
- [ ] Memory storage works
- [ ] Enhance Prompt feature works

---

## Troubleshooting

### Backend Issues
- **503 Service Unavailable**: Backend is still starting up (wait 1-2 minutes)
- **500 Internal Server Error**: Check Render logs for missing environment variables
- **GEMINI_API_KEY error**: Verify API key is correctly set in Render environment

### Frontend Issues
- **CORS errors**: Ensure Netlify URL is added to `CORS_ORIGINS` in Render
- **API connection failed**: Verify `VITE_API_URL` is correctly set in Netlify
- **Build failed**: Check Netlify build logs for missing dependencies

### Memory Persistence
- **Memories not persisting**: Render's free tier uses ephemeral storage. Memories will reset on each deployment. For persistent storage, upgrade to a paid plan or use an external database.

---

## Cost Estimate

- **Render (Backend)**: Free tier available (750 hours/month)
- **Netlify (Frontend)**: Free tier available (100GB bandwidth/month)
- **Google Gemini API**: Pay-per-use (check [pricing](https://ai.google.dev/pricing))

---

## Next Steps

1. **Custom Domain**: Add a custom domain in Netlify settings
2. **Monitoring**: Set up uptime monitoring (e.g., UptimeRobot)
3. **Analytics**: Add Google Analytics or Plausible to track usage
4. **Persistent Storage**: Upgrade Render plan or integrate external database for memory persistence

---

**Your Memora AI is now live! 🚀**
