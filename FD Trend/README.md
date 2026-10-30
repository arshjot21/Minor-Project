# FD TREND — simple PowerShell setup

This project keeps the original React + Vite website, Express backend, SQLite database code, and supplied local images. No `.bat` file is included.

## 1. Install Node.js 22 LTS

Install the Node.js 22 LTS release from https://nodejs.org/. Close and reopen VS Code after installing.

In the VS Code PowerShell terminal, check:

```powershell
node -v
```

It should show a version beginning with `v22.`.

## 2. Open the project folder

Extract this ZIP. In VS Code, open the extracted folder that contains the main `package.json` file.

## 3. Install everything

Run this one command in the project folder:

```powershell
npm run setup
```

Wait until it finishes. Internet access is needed for the first installation.

## 4. Start the website

Run:

```powershell
npm run dev
```

Keep this terminal open and visit **http://localhost:3000/** in your browser.

## Demo login

- Admin: `admin@fdtrend.com` / `admin123`
- User: `user@fdtrend.com` / `user123`

## Notes

- Do not use Live Server for this React project. Start it with `npm run dev`.
- If `better-sqlite3` or `node-gyp` fails, confirm that `node -v` shows Node.js 22.x. The provided installation log showed a failure with Node.js 26 because no matching prebuilt package was found and Python was unavailable for compiling it.
- If you see an `EBUSY` cleanup warning, close other terminals or VS Code windows using this project and try `npm run setup` again.
- Some editorial image URLs in the seeded content may need internet access. The supplied local images are in `Frontend/public/images/`.
