# Contest Tracker

A minimal full‑stack app to browse competitive programming contests from Codeforces, CodeChef, and LeetCode with client‑side search, platform filtering, and live countdowns for upcoming contests.

## Tech Stack
- Client: React + Vite
- Server: Node.js + Express
- HTTP: axios

## Project Structure
```
contest-tracker/
  client/           # React app (Vite)
  server/           # Express server
```

## Prerequisites
- Node.js 18+
- npm 9+

## Setup
Install dependencies for client and server.

```bash
# From project root
npm install --prefix client
npm install --prefix server
```

Optional: create `server/.env` for local configuration.

```
PORT=5000
# If you enable bookmarks backed by MongoDB
MONGO_URI=mongodb://localhost:27017/contest-tracker
```

## Development
Start the API server and the web client in two terminals.

```bash
# Terminal 1 (server)
npm run dev --prefix server

# Terminal 2 (client)
npm run dev --prefix client
```

- Client runs on Vite (e.g., http://localhost:5173)
- Server runs on Express (e.g., http://localhost:5000)

## Features
- Upcoming/Past toggle
- Instant search by contest name
- Platform filter (All, Codeforces, CodeChef, LeetCode)
- Live countdown timer until contest start (shows days when > 24h)

## API (server)
- `GET /contests?site=all|codeforces|codechef|leetcode`
  - Returns `{ contests: Array<{ name, url, site, start_time, end_time }> }`
  - LeetCode source uses the public list endpoint for reliability

Optional (if enabled in your server):
- `POST /bookmarks` with `{ name, url, site, start_time, end_time }`

## Build
```bash
# Production build for client
npm run build --prefix client

# Optional: static preview of client build
npm run preview --prefix client
```

## Troubleshooting
- Client uses Vite: start with `npm run dev` (not `npm start`).
- If LeetCode contests are empty intermittently, the server will still respond with other platforms.

---

# Push to a New GitHub Repository

1) Create a new empty repo on GitHub
- Go to https://github.com/new
- Set Repository name (e.g., `contest-tracker`)
- Keep it empty (no README, no .gitignore) for a clean first push

2) Initialize git locally (from project root)
```bash
git init
# Optional: set main as default branch name
git checkout -b main
```

3) Add and commit
```bash
git add .
git commit -m "Initial commit: contest tracker client+server"
```

4) Add remote (replace USER and REPO)
```bash
git remote add origin https://github.com/USER/REPO.git
# or SSH
# git remote add origin git@github.com:USER/REPO.git
```

5) Push
```bash
git push -u origin main
```

6) Verify
- Refresh the GitHub repo page and confirm files are present.

## Common Git Commands
```bash
git status
git add -A
git commit -m "message"
git pull --rebase origin main
git push origin main
```
