# DOLLY

Documents, cloned on-chain. Forever.

DOLLY anchors document uploads (PDF, DOCX, MP3, etc.) on [Shelby Protocol](https://shelby.xyz)'s
decentralized hot storage, and treats every revision as a linked clone on
Aptos L1 — so a file's full version history is provable on-chain, not just
its current state.

## Deploying (Vercel)

1. Push this repo to GitHub (the API key stays out of it — see below).
2. On [vercel.com](https://vercel.com): **Add New → Project → Import Git Repository**, pick this repo. No build step needed — it's picked up as-is.
3. In **Project Settings → Environment Variables**, add:
   - `APTOS_API_KEY` = your Aptos Labs / Shelby API key
4. Deploy. `index.html` fetches `/api/config` on load, which reads `APTOS_API_KEY` server-side and returns it to the page — so the key is never committed to git or written into a static file.

Note: the key still reaches the browser at runtime (visible in the Network tab), since the upload flow currently calls Shelby directly from client-side JS. Keeping it fully server-side would mean routing Shelby calls through their own serverless functions instead — worth doing before any real production use, not required for a demo.

### Local testing without Vercel

Opening `index.html` directly (no `/api/config` available) falls back to a
local `config.js` if you create one:

```js
window.DOLLY_CONFIG = { aptosApiKey: "your-key-here" };
```

This file is git-ignored and never committed.

## Structure

- `index.html` — the front end. Single static file, no build step.
- `api/config.js` — Vercel serverless function serving Shelby/Aptos config from env vars.
- `contract/` — the Move smart contract (`dolly::vault`) that stores each
  wallet's clone lineage on Aptos. See `contract/README.md` for deploy steps.

## Status

Front end is a working demo (simulated Shelby SDK calls + simulated
on-chain commits). Contract is written but not yet deployed. Next step is
wiring the two together: replace the simulated calls in `index.html` with
real `@shelby-protocol/sdk` uploads and `dolly::vault::anchor_clone`
transactions signed via Petra.

## Stack

- Aptos L1 (contract, wallet auth)
- Shelby Protocol (decentralized file storage)
- Move (smart contract)
- Vanilla HTML/CSS/JS (front end — no framework)
