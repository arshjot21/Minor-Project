# FD Trend — Fashion Design Trend Blog / Platform

A responsive editorial fashion website for the FD (Fashion Designing) minor project.

## Structure

- `Frontend/` — React + Vite editorial interface
- `Backend/` — Node.js + Express + SQLite API
- `README.md` — setup notes

## Run locally on Windows

### Terminal 1 — Backend

```powershell
cd Backend
npm.cmd install
npm.cmd run dev
```

Keep this terminal running. The API runs on port 5000.

### Terminal 2 — Frontend

```powershell
cd Frontend
npm.cmd install
npm.cmd run dev
```

Open the local Vite URL shown in the terminal, normally `http://localhost:3000/`.

## Local editorial images

The project includes three supplied fashion photographs in `Frontend/public/images/`:

- `fd-trend-hero.png` — primary homepage hero image
- `fd-trend-street-style.jpeg` — Street File feature image
- `fd-trend-editorial.jpeg` — journal feature image

The first supplied photograph is intentionally used as the homepage hero.


## Editorial image assets
The project includes locally stored, high-quality editorial photographs supplied for FD Trend. They are used in the Beauty, Culture and Collections visual dispatches and category archives so the presentation remains consistent even without external image access.
