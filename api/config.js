// Vercel serverless function: GET /api/config
// Returns the Shelby/Aptos config using a server-side env var, so the API
// key never sits in a static file or the git repo.
//
// Set this in Vercel: Project → Settings → Environment Variables
//   APTOS_API_KEY = aptoslabs_XkEiCSShdnm_NMgqcxsdUuBQAZD7DGtC3XjAognEG83gj

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    aptosApiKey: process.env.APTOS_API_KEY || null,
    fullnode: "https://api.shelbynet.shelby.xyz/v1",
    indexer: "https://api.shelbynet.shelby.xyz/v1/graphql",
    shelbyRpc: "https://api.shelbynet.shelby.xyz/shelby",
  });
};
