# Permanent Deployment Guide

This guide will walk you through hosting your AI English Practice Agent permanently on **Render.com** using **GitHub**.

## Step 1: Upload Your Code to GitHub
Because you are running this locally, you need to put it on the internet so Render can access it.

1. Go to [GitHub.com](https://github.com) and log in (or create an account).
2. Click the **"+"** icon in the top right and select **"New repository"**.
3. Name it something like `ai-english-practice` and click **"Create repository"**.
4. Open a terminal on your computer, navigate to your project folder (`c:\myantigravityproject\Myproject\ai-english-practice`), and run these commands one by one:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <PASTE_YOUR_GITHUB_REPOSITORY_URL_HERE>
   git push -u origin main
   ```
   *(If you use GitHub Desktop, you can just drag and drop the folder into it and publish!)*

## Step 2: Deploy to Render.com

1. Go to [Render.com](https://render.com/) and sign up using your GitHub account.
2. Click **"New +"** and select **"Web Service"**.
3. Under "Connect a repository", find the `ai-english-practice` repository you just created and click **"Connect"**.
4. Fill out the settings exactly like this:
   - **Name**: `ai-english-practice` (or whatever you want)
   - **Region**: (Choose whichever is closest to you)
   - **Branch**: `main`
   - **Root Directory**: *(Leave it blank)*
   - **Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. Click **"Advanced"** and add your Environment Variables:
   - Click "Add Environment Variable"
   - Key: `GEMINI_API_KEY`
   - Value: `your_actual_api_key_here`
6. Click **"Create Web Service"**.

## Step 3: Wait and Enjoy!
Render will now download your code, run the build command, and start your server. This usually takes 2-3 minutes.
Once it's done, you will see a green **"Live"** status, and Render will give you a public link (e.g., `https://ai-english-practice.onrender.com`).

You can now share this link with anyone!

> **Note on Free Tier:**
> Render's free servers go to sleep after 15 minutes of inactivity. When someone visits the site after it's asleep, it will take about 50 seconds to wake up. Also, because the chat history uses a local file, the chat history will be reset when the server restarts.
