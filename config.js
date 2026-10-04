// Set WORKER_URL to your deployed Cloudflare Worker address (see README.md).
// While it is empty, the app runs in demo mode with a simple built-in story (no AI).
window.FFR_CONFIG = {
  WORKER_URL: "https://fun-fact-roster.mp-funfactroster.workers.dev",
  MAX_REGENERATES: 3,
  MAX_FACTS: 3
};
