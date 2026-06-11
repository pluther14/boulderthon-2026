# Boulderthon 2026 — Training Dashboard

## Netlify Deploy (5 minutes)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Boulderthon 2026 dashboard"
git remote add origin https://github.com/YOUR_USERNAME/boulderthon-2026.git
git push -u origin main
```

### 2. Connect to Netlify
1. Go to netlify.com → Add new site → Import from Git
2. Select your repo
3. Build settings: leave blank (no build command, publish directory = `.`)
4. Click Deploy

### 3. Set Environment Variables (for WHOOP)
In Netlify → Site settings → Environment variables, add:
- `WHOOP_CLIENT_ID` — from developer.whoop.com
- `WHOOP_CLIENT_SECRET` — from developer.whoop.com

### 4. Set your WHOOP redirect URI
In your WHOOP developer app settings, set redirect URI to:
`https://YOUR-SITE-NAME.netlify.app/`

---

## WHOOP Setup (one time, in the dashboard)

1. Go to developer.whoop.com
2. Sign in with your WHOOP account
3. Create a new app — name it "Boulderthon Dashboard"
4. Set redirect URI to your Netlify URL (e.g. `https://boulderthon-2026.netlify.app/`)
5. Copy your Client ID
6. In the dashboard, scroll to the WHOOP section and paste your Client ID
7. Click Connect — you'll be redirected to WHOOP to authorize
8. Done — recovery, HRV, resting HR, and sleep score will populate daily

---

## What's in this project

```
boulderthon-2026/
├── index.html                    # Main dashboard
├── netlify.toml                  # Netlify config
├── README.md                     # This file
└── netlify/
    └── functions/
        ├── whoop-auth.js         # OAuth token exchange (POST) + refresh (PUT)
        └── whoop-data.js         # WHOOP v2 API proxy
```

## Features
- Live countdown clock (days:hours:min:sec)
- Surface toggle (Outdoor / Treadmill) — adjusts session instructions and pace guidance
- Altitude toggle (Denver / Sea Level) — evidence-based Wehrlin & Hallen pace adjustment
- Per-session altitude tagging on all upcoming runs
- Full Jeff Cunningham methodology: volume, intensity, density, stair-step LRs, track/tempo rotation
- Run log with HRR, PHT, RPE, altitude, surface fields
- WHOOP v2 integration: recovery %, HRV, RHR, sleep performance
- Cross-device sync via artifact storage API with localStorage fallback
- Weekly mileage chart (planned vs actual) + HRR trend chart
- PHT early warning system
