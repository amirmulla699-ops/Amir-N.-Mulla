# Organo Farms

This repository contains a full Organo Farms project with a Node.js/Express backend and a vanilla frontend served from `public/`.

## Structure

- `server.js` - Express backend and MongoDB models/routes
- `package.json` - dependencies and scripts
- `public/index.html` - frontend UI
- `public/styles.css` - frontend styling
- `public/app.js` - frontend logic and translations
- `public/assets/organo-logo.png` - logo asset at exact required path
- `.env.example` - sample environment configuration

## Run locally

1. Copy `.env.example` to `.env` and update `MONGODB_URI`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5000` in your browser.

## Notes

- The logo is available at `/public/assets/organo-logo.png`.
- The server serves static frontend assets from the `public/` directory.
