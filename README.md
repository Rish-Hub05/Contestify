# Contest Tracker

A minimal full‑stack app to browse competitive programming contests from Codeforces, CodeChef, and LeetCode with client‑side search, platform filtering, and live countdowns for upcoming contests.

## Tech Stack
- Client: React + Vite
- Server: Node.js + Express
- HTTP: axios
- DB: MongoDB (for bookmarks + email subscriptions)

## Project Structure
```
contest-tracker/
  client/           # React app (Vite)
  server/           # Express server (API + cron)
```

## Prerequisites
- Node.js 18+
- npm 9+
- Local MongoDB running on `mongodb://localhost:27017` (or your own connection string)

---

## 1. Install Dependencies
Install dependencies for client and server.

```bash
# From project root
npm install --prefix client
npm install --prefix server
```

---

## 2. Configure Environment

### 2.1 Server `.env`
Create `server/.env` with at least:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/contest-tracker

# SMTP configuration for email reminders
# Example: Ethereal (test) or real provider (Gmail / other SMTP)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM="Contestify <no-reply@example.com>"
```

Notes:
- For **Gmail**, use `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, and an App Password.
- `SMTP_FROM` should normally match the authenticated mailbox/domain.

### 2.2 Client `.env`
Create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 3. Run in Development
Start the API server and the web client in two terminals.

```bash
# Terminal 1 (server) - from project root
npm run dev --prefix server

# or from server folder
# cd server
# npm run dev

# Terminal 2 (client) - from project root
npm run dev --prefix client

# or from client folder
# cd client
# npm run dev
```

- Client runs on Vite (e.g., http://localhost:5173)
- Server runs on Express (e.g., http://localhost:5000)

---

## 4. Features

### 4.1 Contest List
- Fetches contests from:
  - Codeforces
  - CodeChef
  - LeetCode (using public list endpoint)
- Upcoming / Past toggle in `Home` page.

### 4.2 Search & Platform Filter
- Instant **client‑side search** by contest name.
- Platform dropdown filter: `All`, `Codeforces`, `CodeChef`, `LeetCode`.
- Both filters apply on top of the Upcoming/Past view.

### 4.3 Countdown Timers
- Live countdown on upcoming contests (hh:mm:ss).
- Shows **days** when duration > 24h (e.g. `2d 05:14:09`).

### 4.4 Platform Icons
- Small logos rendered next to each contest:
  - `public/icons/codeforces.svg`
  - `public/icons/codechef.svg`
  - `public/icons/leetcode.svg`
  - Fallback: `public/icons/default.svg`.

### 4.5 Google Calendar Integration
- Each contest card has an **“Add to Google Calendar”** link.
- Opens Google Calendar with:
  - Title = contest name
  - Start/End time prefilled
  - Description = contest URL

### 4.6 Email Reminder Alerts (Nodemailer + node-cron)
- Users can click **“Remind me”** on an upcoming contest.
- A small modal collects:
  - Email address
  - Minutes before contest start (default 60).
- Backend stores a subscription in MongoDB:
  - `{ email, contestId, contestName, notifyAt, sent }`.
- A `node-cron` job runs **every minute**:
  - Finds due reminders (`notifyAt <= now`, `sent=false`).
  - Sends email via Nodemailer.
  - Marks reminder as `sent` when SMTP accepts the message.

---

## 5. API Overview (Server)

Base URL: `http://localhost:5000/api`

- `GET /contests?site=all|codeforces|codechef|leetcode`
  - Returns `{ contests: Array<{ name, url, site, start_time, end_time }> }`.
  - `site=all` aggregates all platforms.

- `POST /bookmarks`
  - Body: `{ name, url, site, start_time, end_time }`.
  - Stores a bookmarked contest (requires MongoDB).

- `POST /subscribe`
  - Body: `{ email, contestId, contestName, notifyBeforeMinutes, contestStartTime }`.
  - Calculates `notifyAt = contestStartTime - notifyBeforeMinutes` and stores subscription.

---

## 6. Build for Production

```bash
# Production build for client
npm run build --prefix client

# Optional: static preview of client build
npm run preview --prefix client
```

(Server is a standard Node/Express app; deploy with your preferred hosting.)

---

## 7. Git & GitHub (push to new repo)

1. Create a new empty repo on GitHub (no README / .gitignore).
2. From project root:

```bash
git init
git checkout -b main
git add .
git commit -m "Initial commit: contest tracker client+server"

# Replace USER and REPO with your GitHub username and repo
git remote add origin https://github.com/USER/REPO.git
git push -u origin main
```

3. Refresh GitHub and confirm files are present.

Common commands:

```bash
git status
git add -A
git commit -m "message"
git pull --rebase origin main
git push origin main
```

---

## 8. Troubleshooting

- Client uses Vite → start with `npm run dev` (not `npm start`).
- If LeetCode contests are empty intermittently, the server still returns other platforms.
- Email not arriving:
  - Check server logs for `mail fail` or `mail not accepted`.
  - Verify SMTP_* env vars are correct.
  - For Ethereal SMTP, use the preview URL in logs.
  - For Gmail/real SMTP, also check Spam/Promotions folders.

---
