# DOLLY (React + Aptos Wallet Adapter)

This replaces the earlier single-HTML-file version. Wallet connection now
goes through Aptos Labs' official `@aptos-labs/wallet-adapter-react`
instead of a hand-rolled `window.aptos` check — so it automatically
supports every AIP-62-compliant wallet (Petra, Pontem, Nightly, and
AptosConnect, which needs no install and works on mobile out of the box).

## Local development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Wallet connect will show whatever
AIP-62 wallets are detected in your browser, plus AptosConnect (which
always shows up — no extension required).

## Build

```bash
npm run build
```

Outputs to `dist/`. Verified working locally before handoff.

## Deploying to Vercel

1. Push this folder to GitHub (same repo as before is fine — this
   replaces the old static-HTML setup).
2. In Vercel: **Import Git Repository**. Vercel should auto-detect
   **Vite** as the framework — if not, set it manually in
   **Settings → Build & Development Settings**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build` (or leave default)
   - Output Directory: `dist`
3. Add an environment variable in **Settings → Environment Variables**:
   - `VITE_APTOS_API_KEY` = your Aptos Labs API key

   Note: the `VITE_` prefix is required — Vite only exposes env vars to
   the client bundle if they start with `VITE_`. This key is designed by
   Aptos Labs to be used client-side (it's a fullnode rate-limit key,
   not a secret credential), unlike a typical API secret.
4. Deploy.

## Structure

- `index.html` / `src/main.jsx` — Vite entry point, wraps the app in
  `AptosWalletAdapterProvider`.
- `src/App.jsx` — the actual DOLLY UI: hero, how-it-works, upload demo,
  features, deployment address, wallet connect/disconnect.
- `src/index.css` — styling, ported from the original static build.
- `contract/` — the Move smart contract (`dolly::vault`), unchanged from
  before. See `contract/README.md` for deploy steps.

## What's real vs. simulated

- **Wallet connect/disconnect**: real, via the official adapter.
- **File upload / on-chain commit**: still simulated (fake progress log)
  — wiring this to actually call `dolly::vault::anchor_clone` and a real
  Shelby SDK upload is the next step once the contract is deployed.
