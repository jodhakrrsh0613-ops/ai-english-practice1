# Vercel Deployment Guide (100% Free, No Credit Card)

This guide will walk you through hosting your AI English Practice Agent permanently on **Vercel.com** using **GitHub**.

## Step 1: Upload Your Code to GitHub
We need to put the code on the internet so Vercel can access it. (If you already did this, skip to Step 2!)

1. Go to [GitHub.com](https://github.com) and log in (or create an account).
2. Click the **"+"** icon in the top right and select **"New repository"**.
3. Name it `ai-english-practice` and click **"Create repository"**.
4. **Using GitHub Desktop:**
   - Open GitHub Desktop, go to **File -> Add Local Repository**.
   - Choose your `c:\myantigravityproject\Myproject\ai-english-practice` folder.
   - Click "create a repository".
   - Click **"Publish repository"** (make sure "Keep this code private" is **UNCHECKED**).

## Step 2: Deploy to Vercel.com

1. Go to [Vercel.com](https://vercel.com/) and sign up using your **GitHub account**.
2. Click the **"Add New..."** button and select **"Project"**.
3. Under "Import Git Repository", you will see the `ai-english-practice` repository you just created. Click the **"Import"** button next to it.
4. **Configure Project:**
   - Vercel will automatically detect the settings from the `vercel.json` file we added!
   - You don't need to change any build commands.
   - Open the **"Environment Variables"** section:
     - Name: `GEMINI_API_KEY`
     - Value: `your_actual_api_key_here` (Paste your Google AI Studio API Key here)
     - Click **"Add"**.
5. Click the **"Deploy"** button.

## Step 3: Wait and Enjoy!
Vercel will now download your code, build it, and launch it! This usually takes less than a minute.
Once it's done, you will see a big "Congratulations!" screen and Vercel will give you a public link (e.g., `https://ai-english-practice.vercel.app`).

You can now share this link with anyone! 

> **Note:** Because Vercel is "Serverless", we removed the local database. This means every time you refresh the page, it starts a fresh conversation (which is perfect for practice sessions!).
