# Deploying the Backend for Free (Testing Phase)

This guide replaces the earlier Render "paid Starter plan" instructions. Since this is a testing/team-collaboration phase rather than a final production launch, the backend has been changed so it can run on Render's **free** tier at **$0/month**, with no credit card needed anywhere.

## What changed, and why

Render's free tier has no persistent disk — any file saved to its local disk (the SQLite database file, and any images uploaded through the admin panel) is wiped every time the service restarts, which happens on every redeploy and every time it "wakes up" after 15 minutes of inactivity. That's incompatible with a team actually using the CMS over time.

To fix this without any hosting cost, the backend was changed to store its two stateful pieces somewhere that survives restarts on its own:

- **The database** now lives on **Turso** (a free, SQLite-compatible hosted database) instead of a local file.
- **Uploaded images** now live on **Cloudinary** (a free image hosting service with its own CDN) instead of the local `uploads/` folder.

Render itself now only runs the Node.js server — it has nothing important to lose when it restarts, so the free tier's lack of a persistent disk no longer matters.

The trade-off: Render's free tier still "spins down" after 15 minutes with no visitors, and the *next* visitor after that has to wait about 30–60 seconds for it to wake back up (a one-time delay, not a data loss). That's a fine trade for a $0 testing phase.

---

## Step 1 — Create a free Turso database

1. Go to **turso.tech** and sign up for a free account (GitHub or email login — no credit card required).
2. Once logged in, create a new database (the dashboard has a clearly labelled "Create Database" button). Give it any name, e.g. `vera-agritech`.
3. Open the new database's page and find its **connection details**. You need two things:
   - The **Database URL** — starts with `libsql://...turso.io`
   - An **auth token** — the dashboard has a button to create/reveal one (may be labelled "Create Token" or shown under a "Connect" tab)
4. Copy both somewhere safe (a Notes app is fine) — you'll paste them into Render in Step 4.

## Step 2 — Create a free Cloudinary account

1. Go to **cloudinary.com** and sign up for a free account (no credit card required).
2. After signing up, you land on your **Dashboard** — it shows three values right at the top:
   - **Cloud name**
   - **API Key**
   - **API Secret** (click "reveal" if it's hidden)
3. Copy all three somewhere safe.

## Step 3 — Push the updated code to GitHub

Back in your project folder in VS Code's terminal, run these commands one at a time (this sends the backend changes to your GitHub repository, which is where Render pulls the code from):

```
git add -A
git commit -m "Switch backend to Turso + Cloudinary for free hosting"
git push
```

If `git push` asks which branch, or you're unsure, just run `git push origin main` (or `git push origin testing` if you've been working on the `testing` branch, matching whatever branch your Render service is set to deploy from).

## Step 4 — Update your Render service

If you already created a Render web service from the earlier paid-plan instructions, open it and go to **Settings**. If you haven't created one yet, create a new **Web Service** first and connect it to your GitHub repo (`emperor10/vera-agritech`), then continue below.

1. **Instance Type** — set (or confirm) this is **Free**, not Starter.
2. **Root Directory** — `backend`
3. **Branch** — `main` (or `testing`, matching whatever you pushed to in Step 3)
4. **Build Command** — `npm install`
5. **Start Command** — `npm run setup && npm start`
6. **Persistent Disk** — if one exists from the earlier setup, **delete it** (open the "Disks" section and remove it). It's no longer needed and isn't available on the free plan anyway.
7. **Environment Variables** — go to the "Environment" section and set exactly these (remove `DATABASE_FILE` and `UPLOADS_DIR` if they exist from before — they're no longer used):

```
NODE_ENV=production
APP_URL=https://<your-render-service-name>.onrender.com
CORS_ORIGIN=https://vera-agritech-five.vercel.app
JWT_SECRET=<any long random string — e.g. mash your keyboard for 40 characters>
DEFAULT_ADMIN_EMAIL=<a real email for your first admin login>
DEFAULT_ADMIN_PASSWORD=<a temporary strong password — change it after first login>
DATABASE_URL=<the libsql://...turso.io URL from Step 1>
DATABASE_AUTH_TOKEN=<the auth token from Step 1>
CLOUDINARY_CLOUD_NAME=<from Step 2>
CLOUDINARY_API_KEY=<from Step 2>
CLOUDINARY_API_SECRET=<from Step 2>
```

For `APP_URL`, use your actual Render service URL — Render shows it at the top of the service page once created (you may need to save once with a placeholder, see the real URL appear, then edit `APP_URL` to match).

8. Save, and Render will redeploy automatically. Watch the **Logs** tab — you should see `Database migrated`, then `Seed complete`, then `Vera AgriTech API listening on port ...` with no errors.

## Step 5 — Connect the frontend to this backend

1. Copy your Render service's URL (e.g. `https://vera-agritech-backend.onrender.com`).
2. In your Vercel project (the frontend), go to **Settings → Environment Variables** and add:
   ```
   VITE_API_URL=https://<your-render-service-name>.onrender.com/api
   ```
3. Go to **Deployments**, and redeploy the latest one (so it picks up the new environment variable).

## Step 6 — First login and next steps

1. Visit `https://vera-agritech-five.vercel.app/admin/login` and log in with the `DEFAULT_ADMIN_EMAIL` / `DEFAULT_ADMIN_PASSWORD` you set in Step 4.
2. Change the password immediately from the admin panel.
3. Re-upload real images in the Media Library — anything uploaded to your old local setup does not carry over automatically.
4. Share the Vercel link with your team. The first visit after 15+ minutes of no traffic will feel slow (the backend waking up) — that's expected and not a bug.
