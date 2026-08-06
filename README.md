# Poula Phrasebook — Prototype

A simple app where Poula speakers can add phrases with English translations,
and anyone can search and browse them. This is your v1: not a translator yet,
but a real, useful tool — and every entry collected here is future training
data for a real translator down the line.

This guide assumes close to zero setup experience. Follow it top to bottom.

---

## What you're setting up

- **Frontend**: a small React app (runs in the browser)
- **Backend + database**: Supabase (free, no server management)
- **Hosting**: Vercel (free, deploys straight from your code)

You'll end up with a live URL you can send to your speakers.

---

## Step 1 — Install Node.js

You need Node.js installed to run the app locally.

1. Go to https://nodejs.org
2. Download the **LTS** version for your OS and install it (default options are fine).
3. Confirm it worked — open a terminal (Terminal on Mac, Command Prompt or PowerShell on Windows) and run:
   ```
   node -v
   npm -v
   ```
   Both should print a version number. If they don't, restart your terminal and try again.

---

## Step 2 — Create your Supabase project

1. Go to https://supabase.com and sign up (free tier is enough).
2. Click **New project**.
3. Give it a name (e.g. `poula-phrasebook`), set a database password (save it somewhere), pick the region closest to your users, and click **Create new project**. Wait ~2 minutes for it to spin up.
4. Once it's ready, go to the **SQL Editor** in the left sidebar, click **New query**.
5. Open the `supabase/schema.sql` file from this project, copy its entire contents, paste it into the SQL editor, and click **Run**.
   - This creates the `entries` table where all your phrases will live.
6. Go to **Settings → API** in the left sidebar. You'll need two values from this page in Step 4:
   - **Project URL**
   - **anon public** key

Keep this tab open — you'll copy these values in a moment.

---

## Step 3 — Get the project running on your computer

1. Unzip this project folder somewhere on your computer.
2. Open a terminal, navigate into the folder:
   ```
   cd path/to/poula-translator
   ```
3. Install dependencies:
   ```
   npm install
   ```
   This will take a minute or two the first time.

---

## Step 4 — Connect it to your Supabase project

1. In the project folder, make a copy of `.env.example` and rename the copy to `.env`.
2. Open `.env` in any text editor and paste in the two values from Step 2.6:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
3. Save the file.

**Never commit `.env` to GitHub or share it publicly** — the `.gitignore` file already excludes it, so you shouldn't need to think about this again, just don't override that.

---

## Step 5 — Run it

```
npm run dev
```

Your terminal will print a local address, usually `http://localhost:5173`. Open that in your browser — you should see the Poula Phrasebook app, ready to search and add entries.

Try adding a test phrase yourself to confirm it's actually saving — refresh the page and it should still be there. If it worked, you're fully wired up.

---

## Step 6 — Put it in front of your speakers

At this point the app only runs on your computer. To get a real link you can send to people:

1. Push this project to a GitHub repository (create a free GitHub account if you don't have one, create a new repo, and follow GitHub's instructions to push this folder to it).
2. Go to https://vercel.com, sign up with your GitHub account.
3. Click **Add New → Project**, select your repo.
4. Vercel will auto-detect it's a Vite app. Before deploying, add your environment variables: in the project settings, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the same values from your `.env` file.
5. Click **Deploy**. In about a minute you'll get a live URL like `poula-phrasebook.vercel.app`.

Send that link to your speakers and start collecting real entries.

---

## Adding pronunciation recordings (new)

The app now supports recording audio alongside each phrase — useful since
Poula is tonal and spelling alone doesn't capture pronunciation. This needs
one extra one-time setup step in Supabase:

1. Go to your Supabase project → **SQL Editor** → New query.
2. Copy the **entire, updated** contents of `supabase/schema.sql` from this
   project (it now includes an `audio_url` column and an `audio` storage
   bucket) and run it.
   - If you already ran the old version of this file, that's fine — the new
     version is written so it's safe to run again; it only adds what's
     missing rather than recreating existing tables.
3. That's it — no `.env` changes needed. Restart `npm run dev` if it's
   currently running, and refresh the browser.

**How it works for your speakers:** in the "Add a phrase" form, there's now
a "Record pronunciation" button. It asks for microphone permission the first
time (they'll need to allow it), then records, previews playback, and lets
them re-record before submitting. It's optional — phrases can still be added
without audio.

**One thing to know:** microphone access requires a secure context. This
works automatically on `localhost` during development. Once deployed to
Vercel, it'll work automatically too, since Vercel serves everything over
HTTPS by default.

---

## Where to go after the prototype

Once you have real usage, in roughly this order:

1. **Get 50–100 entries in from real speakers** before changing anything else. Let actual usage tell you what's missing.
2. **Tighten security**: right now anyone with the link can add or edit entries, which is fine for a small trusted group. If it grows, add Supabase Auth so only known contributors can submit, and restrict the "mark verified" action to trusted reviewers.
3. **Add audio recordings**: Supabase has free file storage built in — useful for pronunciation, especially since Poula is tonal and spelling alone won't capture that.
4. **Add more languages**: when you're ready for Bodo/Khasi/Garo, add a `language` column to the `entries` table rather than building separate apps — one schema, many languages.
5. **Machine translation**: only worth attempting once you have a few thousand verified entries. Fine-tuning a model like NLLB-200 on your collected data is the natural next step at that point.

---

## If something breaks

- **Blank page / red error banner in the app**: almost always a `.env` problem. Double-check the URL and key match exactly what's in Supabase Settings → API, and that you restarted `npm run dev` after editing `.env` (env changes require a restart).
- **"relation entries does not exist"**: the SQL from Step 2.5 didn't run. Go back to the Supabase SQL Editor and run it again.
- **npm install fails**: make sure Node's LTS version is installed (Step 1) and you're running the command inside the project folder.

You don't need to solve these alone — copy the exact error message and ask for help with it.
