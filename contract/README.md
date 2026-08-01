# DOLLY vault contract

Minimal on-chain lineage registry. One `Vault` resource per wallet, holding a
list of `Clone` entries (content hash, parent hash, name, timestamp). No
storage config, no admin roles, no upgrade logic — deliberately kept to the
one thing DOLLY needs: proving lineage.

## Deploy

```bash
aptos init --network devnet
aptos move publish --named-addresses dolly=default
```

That gives you the deployment address to drop into the front end's
`#addr` field.

## Calling it from the front end

Two entry functions, called through the connected Petra wallet
(`window.aptos.signAndSubmitTransaction`):

- `dolly::vault::init_vault()` — call once per wallet, on first connect.
- `dolly::vault::anchor_clone(content_hash, parent_hash, name)` — call
  after Shelby's SDK returns a blob commitment for an uploaded file.
  Pass `parent_hash = ""` for an origin document.

Read lineage back with the view function `dolly::vault::get_lineage(owner)`
via the Aptos view-function REST endpoint — no gas, no signature needed.

## What's intentionally not here

Access control beyond "your wallet owns your vault," encryption of the
Shelby blob itself, and payment/subscription logic are all out of scope
for this skeleton. Add them once the core anchor/read flow is proven on
devnet — not before.
