# Tyler Black Card Collection Tracker — Deployment Guide

## Architecture

**Zero-build static site** with **cloud-backed storage**.

```
Visitors ──→ Supabase (read-only) ──→ See your live collection
    You ──→ Supabase (read-write) ──→ Data saved permanently in cloud
                                   ──→ localStorage as fast cache
```

No npm, no webpack, no build step. Just HTML + JS files served from Vercel.

### Files
- `index.html` — Loads CDN deps (React, Tailwind, Babel, Supabase), auth bar
- `storage-shim.js` — Routes data to Supabase (primary) + localStorage (cache)
- `tracker.jsx` — The full tracker app (8,300 lines, zero modifications needed)
- `vercel.json` — Tells Vercel to serve as static site
- `supabase-setup.sql` — Database table + security policies (run once)

---

## Setup Overview (One-Time, ~20 minutes)

1. Create Supabase project (free cloud database)
2. Run SQL setup + create your login
3. Install Git (if needed)
4. Download files from Claude + create project folder
5. Add your Supabase credentials to index.html
6. Create GitHub repo + push code
7. Deploy to Vercel
8. Import your existing collection data

---

## Step 1: Create Supabase Project (Free)

1. Go to **https://supabase.com** and sign up (GitHub login works)
2. Click **"New Project"**
3. Settings:
   - **Name:** `tyler-black-tracker`
   - **Database Password:** choose something strong (you won't need this often)
   - **Region:** pick closest to you (e.g., US East)
4. Click **"Create new project"** — wait ~2 minutes for provisioning

### Get your API credentials
1. In your Supabase project, go to **Settings** (gear icon) → **API**
2. Copy these two values (you'll need them in Step 5):
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **anon public** key — the long key under "Project API keys"

---

## Step 2: Set Up Database + Auth

### Create the table
1. In Supabase, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy-paste the ENTIRE contents of `supabase-setup.sql` into the editor
4. Click **"Run"** — you should see "Success. No rows returned."

### Create your login account
1. Go to **Authentication** (left sidebar) → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Enter your **email** and a **password**
4. Click **"Create user"**
5. ⚠️ Click on the user, then click **"Confirm user"** (or toggle auto-confirm in Auth settings)

This email/password is what you'll use to log into your tracker on the live site.

---

## Step 3: Install Git (if you don't have it)

You probably already have Git if you use GitHub. Check by opening a terminal and running:

```bash
git --version
```

If you see a version number, skip to Step 4. If not:

### Windows
1. Download from **https://git-scm.com/download/win**
2. Run installer — accept all defaults
3. Open **Git Bash** (installed with Git) for all terminal commands below

### Mac
1. Open **Terminal** (Applications → Utilities → Terminal)
2. Type: `git --version`
3. If not installed, macOS prompts to install Xcode Command Line Tools — click **Install**

### Configure Git (if first time)
```bash
git config --global user.name "YourName"
git config --global user.email "your@email.com"
```

---

## Step 4: Download Files + Create Project Folder

### 4a. Download the 5 project files from Claude

In the Claude chat, download each of these files to your computer (click the file, then click the download icon):

1. `index.html`
2. `storage-shim.js`
3. `tracker.jsx`
4. `vercel.json`
5. `supabase-setup.sql`

(The `DEPLOY_README.md` is this guide you're reading — you don't need it in the folder, but you can include it if you want.)

They'll land in your **Downloads** folder (e.g., `C:\Users\YourName\Downloads` on Windows, `~/Downloads` on Mac).

### 4b. Create a project folder and move the files into it

**Windows (File Explorer):**
1. Go to your **Desktop** (or wherever you want)
2. Right-click → **New** → **Folder** → name it `tyler-black-tracker`
3. Open your **Downloads** folder
4. Select all 5 files → drag them into the `tyler-black-tracker` folder

**Mac (Finder):**
1. Open Finder → go to Desktop
2. File → New Folder → name it `tyler-black-tracker`
3. Open Downloads → select all 5 files → drag into the new folder

**Or via terminal (any OS):**
```bash
mkdir ~/Desktop/tyler-black-tracker
mv ~/Downloads/index.html ~/Desktop/tyler-black-tracker/
mv ~/Downloads/storage-shim.js ~/Desktop/tyler-black-tracker/
mv ~/Downloads/tracker.jsx ~/Desktop/tyler-black-tracker/
mv ~/Downloads/vercel.json ~/Desktop/tyler-black-tracker/
mv ~/Downloads/supabase-setup.sql ~/Desktop/tyler-black-tracker/
```

### 4c. Verify your folder looks like this

```
tyler-black-tracker/
├── index.html
├── storage-shim.js
├── tracker.jsx
├── vercel.json
└── supabase-setup.sql
```

All 5 files should be **directly** inside the folder (not in a subfolder).

---

## Step 5: Add Your Supabase Credentials

1. Open the `tyler-black-tracker` folder
2. **Right-click** `index.html` → **Open with** → **Notepad** (Windows) or **TextEdit** (Mac)
   - On Mac: make sure TextEdit is in plain text mode (Format → Make Plain Text)
   - Or use any code editor (VS Code, Sublime Text, etc.)
3. Find these two lines near the top (around line 30-31):

```javascript
window.SUPABASE_URL = "YOUR_SUPABASE_URL_HERE";
window.SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY_HERE";
```

4. Replace with your actual values from Step 1:

```javascript
window.SUPABASE_URL = "https://abcdefgh.supabase.co";
window.SUPABASE_ANON_KEY = "eyJhbGciOi...your_long_key_here";
```

5. **Save** the file (Ctrl+S / Cmd+S)

⚠️ **The anon key is safe to include in client code** — Supabase's Row Level Security (which we set up in Step 2) controls who can read vs. write. The anon key only allows reading.

---

## Step 6: Create GitHub Repository + Push Your Files

### 6a. Create an empty repo on GitHub

1. Go to **https://github.com** (you're already logged in)
2. Click **+** (top right) → **New repository**
3. Settings:
   - **Name:** `tyler-black-tracker`
   - **Visibility:** Public (fine — your data is in Supabase, not in the code)
   - ⚠️ **DO NOT** check "Add a README file"
   - ⚠️ **DO NOT** add a .gitignore or license
   - Leave everything else blank
4. Click **Create repository**
5. You'll see a page with setup instructions — **leave this page open**, you'll need the URL

### 6b. Push your local folder to GitHub

Open **Git Bash** (Windows) or **Terminal** (Mac), then run these commands one at a time:

```bash
# 1. Navigate to your project folder
cd ~/Desktop/tyler-black-tracker

# 2. Initialize git in this folder
git init

# 3. Add all files
git add .

# 4. Create your first commit
git commit -m "Initial deployment with Supabase cloud storage"

# 5. Connect to your GitHub repo (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/tyler-black-tracker.git

# 6. Set the branch name
git branch -M main

# 7. Push!
git push -u origin main
```

### If Git asks for a username/password

GitHub no longer accepts passwords. You need a **Personal Access Token**:

1. Go to: **https://github.com/settings/tokens**
2. Click **"Generate new token (classic)"**
3. Settings:
   - **Note:** `tracker deploy` (or anything)
   - **Expiration:** 90 days (or No expiration)
   - **Scopes:** check **repo** (the first checkbox)
4. Click **Generate token** → **copy it immediately** (you can't see it again)
5. When Git asks for your password, **paste the token** (not your GitHub password)

### Verify it worked

Go to `https://github.com/YOUR_USERNAME/tyler-black-tracker` — you should see all 5 files listed.

---

## Step 7: Deploy to Vercel (Free)

1. Go to **https://vercel.com** — sign up with GitHub
2. Click **"Add New..."** → **"Project"**
3. Find `tyler-black-tracker` and click **Import**
4. Settings:
   - **Framework Preset:** Other
   - **Build Command:** (leave empty)
   - **Output Directory:** `.`
5. Click **Deploy**
6. Live in ~30 seconds! URL: `tyler-black-tracker-xyz.vercel.app`

---

## Step 8: Migrate Your Collection Data to the Cloud

First time only — get your existing collection into Supabase:

### Option A: From Your Current Browser (Recommended — preserves ALL data)

If you've been using the tracker in Claude.ai, your data is in that browser's localStorage.

1. Open your **live Vercel site** in the **same browser** where you've been using the tracker
2. Click **"Owner Login"** → enter your email + password from Step 2
3. Click the **"⬆ Migrate to Cloud"** button in the auth bar
4. Wait for confirmation — it pushes all 9 data keys to Supabase (statuses, prices, targets, etc.)
5. You'll see "✓ Migrated X keys to cloud!"

This migrates **everything**: card statuses, card details, price history, target prices, eBay blocked lists, COMC overrides, TCDB fixes, and custom cards.

### Option B: From JSON Backup (Partial — statuses + details only)

If you're on a fresh browser with no localStorage data:

1. Open your live site → click **"Owner Login"**
2. Go to the **Export** tab → **"Restore from JSON Backup"**
3. Select your `tyler_black_state_2026-02-22.json`
4. This restores statuses + card details + for-sale flags
5. ⚠️ **Note:** Price history, targets, and other secondary data are NOT in the JSON backup — use Option A if possible

### Verify it worked
1. Open the site in a **different browser** (or incognito/private window) — do NOT log in
2. You should see your full collection with all statuses — as a visitor (read-only)
3. This confirms Supabase is serving your data publicly

---

## How Data Flows

### When you (owner) make changes:
```
Click "Owned" → localStorage (instant) → Supabase (async, ~100ms) → permanent
```

### When a visitor opens the site:
```
Page loads → Supabase hydrates localStorage → Tracker shows YOUR collection
```

### What if you clear browser cache?
```
Page loads → Supabase re-hydrates everything → Nothing lost
```

### What if Supabase is down? (very rare)
```
Falls back to localStorage cache → Still works, syncs when Supabase returns
```

---

## Updating the Tracker

When you get an updated `tracker.jsx` from Claude:

1. Download the new `tracker.jsx` from the Claude chat
2. Copy it into your `tyler-black-tracker` folder, replacing the old one
3. Open terminal:

```bash
cd ~/Desktop/tyler-black-tracker
git add .
git commit -m "Update tracker - [describe changes]"
git push
```

**Vercel auto-deploys within ~30 seconds.** Your data is unaffected (it's in Supabase, not in the code).

---

## Custom Domain (Optional, Free)

1. In Vercel → your project → **Settings** → **Domains**
2. Add your domain (e.g., `tylerblackcards.com`)
3. Follow Vercel's DNS instructions

---

## Troubleshooting

### "Connecting..." stays in auth bar
- Check browser console (F12) for errors
- Verify SUPABASE_URL and SUPABASE_ANON_KEY in index.html
- Make sure the SQL setup was run successfully

### Can't log in
- Verify you created a user in Supabase Auth AND confirmed the email
- Check password is correct
- Look at Auth > Logs in Supabase dashboard for error details

### Site loads but collection is empty
- You need to import your data first (Step 8)
- Check browser console for "[storage] Hydrating X keys from cloud"

### Visitor sees empty collection
- Make sure you imported data while logged in as owner
- Check Supabase Table Editor → collection_kv — should have rows
- Verify RLS policies exist (SQL Editor → run: `SELECT * FROM pg_policies WHERE tablename = 'collection_kv'`)

### Updates aren't showing after git push
- Hard refresh: Ctrl+Shift+R
- Or add `?v=2` to URL

---

## File Structure

```
tyler-black-tracker/
├── index.html           ← Entry page + Supabase config + auth UI
├── tracker.jsx          ← Full tracker app (8,300 lines)
├── storage-shim.js      ← Supabase + localStorage storage adapter
├── vercel.json          ← Static site deployment config
├── supabase-setup.sql   ← Database setup (run once, don't deploy)
└── README.md            ← This file
```

---

## Supabase Free Tier Limits

| Resource | Limit | Your Usage |
|----------|-------|-----------|
| Database | 500 MB | ~1 MB (you'll never hit this) |
| Auth users | 50,000/month | 1 (you) |
| API requests | 500K/month | ~100/day typical |
| Bandwidth | 5 GB/month | ~50 MB/month typical |
| Realtime | 200 concurrent | Not used |

You're at <1% of every limit. This is effectively free forever for a single-user collection tracker.
