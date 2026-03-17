# Deployment Guide: 4u - For Your Services

## Part 1: Deploying the Frontend (Vite/React) on Vercel

Vercel is the easiest place to host a React/Vite frontend. It's free and designed specifically for this tech stack.

### Step 1: Create a Vercel Account
1. Go to [vercel.com](https://vercel.com/) and click **Sign Up**.
2. Sign up using your **GitHub account**. This is critical as it allows Vercel to see your repositories.

### Step 2: Import Your Project
1. Once logged in, click the **"Add New..."** button in the dashboard and select **"Project"**.
2. Under "Import Git Repository", look for your repository: `VanshAt/4U---For-Your-Servicess`.
3. Click **Import**.

### Step 3: Configure the Build Settings
You need to tell Vercel that your frontend code is inside the `frontend` folder, not the root folder.
1. **Project Name:** You can name it something like `4u-frontend`.
2. **Framework Preset:** Vercel should automatically detect **Vite**. If it doesn't, select Vite from the dropdown.
3. **Root Directory:** Click the **"Edit"** button. Choose the `frontend` directory.
4. **Environment Variables:** If your React app needs an API URL (e.g., `VITE_API_URL`), you would enter it here. (If your backend is local, skip this for now. You can add it later once your backend is deployed).
5. Click **Deploy**.

Vercel will build your site. Once it reaches the "Congratulations!" screen, you'll see a live URL (e.g., `https://4u-frontend.vercel.app`). 
🎉 **Your frontend is now live!**

---

## Part 2: Deploying the Backend (Node.js/Express) on Render

Render.com is excellent for hosting free server-side APIs.

### Step 1: Prepare the Backend Code
Render needs to know how to start your app. Ensure your `backend/package.json` has a start script. 
It should look like this:
```json
"scripts": {
  "start": "node server.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```
*(If it doesn't have `"start"`, add it to `package.json` and push the change to GitHub first).*

### Step 2: Create a Render Account
1. Go to [render.com](https://render.com/) and sign up.
2. Sign up with your **GitHub account**.

### Step 3: Create a New Web Service
1. In the Render Dashboard, click **"New +"** and select **"Web Service"**.
2. Connect your GitHub account (if prompted) and select the `4U---For-Your-Servicess` repository.

### Step 4: Configure the Web Service
1. **Name:** Name it `4u-backend-api` (or similar).
2. **Language/Environment:** Select `Node`.
3. **Root Directory:** Type `backend` (this tells Render to execute commands inside the backend folder).
4. **Build Command:** Type `npm install`
5. **Start Command:** Type `npm start` (or `node server.js`)
6. **Instance Type:** Select the **Free** tier.

### Step 5: Add Environment Variables (Crucial!)
Scroll down to the **Advanced** section and click **Add Environment Variable**. You *must* add all variables from your local `.env` file here.
For example:
*   `MONGO_URI` = `mongodb+srv://...`
*   `PORT` = `5000`
*   `TWILIO_ACCOUNT_SID` = `...`
*   `TWILIO_AUTH_TOKEN` = `...`

### Step 6: Deploy
1. Click **Create Web Service**. 
2. Render will begin building. This can take a few minutes. 
3. Once finished, Render will provide you with a live URL (e.g., `https://4u-backend-api.onrender.com`).
🎉 **Your backend is now live!**

---

## Part 3: Connecting Frontend to the Live Backend

Once **both** are deployed, you need to tell your live Frontend to talk to your live Backend instead of `localhost:5000`.

1. Go back to your **Vercel Dashboard**.
2. Click your `4u-frontend` project -> **Settings** -> **Environment Variables**.
3. Add a new variable:
    *   **Key:** `VITE_API_URL` (or whatever variable your React code uses).
    *   **Value:** `https://4u-backend-api.onrender.com` (Your Render Backend URL).
4. Save the variable.
5. Go to the **Deployments** tab in Vercel. Find your most recent deployment, click the 3 dots, and click **Redeploy**. This rebuilding step applies the new variable to the code.

**Finished! Your full-stack platform is now live!**
