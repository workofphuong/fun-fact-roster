# Fun Fact Roster

A tiny web app that turns something small about you into a 2–3 sentence story (plus a question to ask back) you can tell at social events. Up to 3 facts per visit; nothing is saved.

## Try it now (demo mode, no AI)

```bash
cd fun-fact-roster
python -m http.server 8080
```

Open http://localhost:8080. Without a Worker URL, the story is a simple stitched-together version.

## Edit the questions

All topics, prompts, chips and twist triggers are in `content.js`. Change the wording freely.

## Turn on real stories (Cloudflare Worker)

1. `cd worker`
2. `npx wrangler login`
3. `npx wrangler kv namespace create STATS`, then paste the printed id into `wrangler.toml`.
4. In `wrangler.toml`, set `ALLOWED_ORIGIN` to your GitHub Pages address (keep `http://localhost:8080` for testing).
5. `npx wrangler secret put ANTHROPIC_API_KEY` and paste your key.
6. `npx wrangler deploy`, then copy the printed `https://…workers.dev` URL into `WORKER_URL` in `config.js`.

The Worker uses `claude-haiku-4-5-20251001`, limits each visitor to 20 stories a day (`MAX_PER_VISITOR`) and the whole app to 300 a day (`MAX_DAILY`). It stores only daily counters, never answers or stories. Daily usage is the `count:YYYY-MM-DD` key in the `STATS` KV namespace.

## Publish the page

Push the contents of this folder (without `worker/` if you like) to a GitHub repo and enable GitHub Pages.
