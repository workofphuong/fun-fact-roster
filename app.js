(function () {
  const C = window.FFR_CONTENT;
  const CFG = window.FFR_CONFIG;
  const app = document.getElementById("app");
  const progress = document.getElementById("progress");
  const bar = document.getElementById("bar");
  const meta = document.getElementById("meta");

  let factNumber = 1;
  let lastStep = null;
  let s = fresh();

  function fresh() {
    return {
      step: "topic", topic: null, spark: null, subject: "", route: null,
      ans: {}, who: [], whoDid: "", twist: null, twistText: "",
      story: "", askBacks: [], hookIdx: 0, regens: 0, loading: false, error: "", copied: false
    };
  }

  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const topic = () => C.topics.find((t) => t.id === s.topic);
  const stepList = () => ["topic", "seed", "route", "q1", "q2"].concat(s.route === "person" ? [] : ["who"], ["twist", "result"]);

  function go(step) { s.step = step; render(); window.scrollTo(0, 0); }
  function next() { const l = stepList(); go(l[l.indexOf(s.step) + 1]); }
  function back() { const l = stepList(); go(l[Math.max(0, l.indexOf(s.step) - 1)]); }

  function answerText(key) {
    const a = s.ans[key];
    if (!a) return "";
    return [a.chip, a.text].filter(Boolean).join(": ");
  }

  // ---------- views ----------
  function shell(title, hint, body, opts) {
    opts = opts || {};
    const canSkip = opts.skip;
    return `
      <h2>${esc(title)}</h2>
      ${hint ? `<p class="hint">${esc(hint)}</p>` : ""}
      ${body}
      <div class="nav">
        <button class="btn ghost" data-a="back">← Back</button>
        ${canSkip ? `<button class="btn" data-a="skip">Skip</button>` : ""}
        <button class="btn primary" data-a="next" ${opts.disabled ? "disabled" : ""}>${opts.nextLabel || "Next"}</button>
      </div>`;
  }

  function viewTopic() {
    return `
      <h2>What do you want to talk about?</h2>
      <p class="hint">Pick anything. Small and ordinary is great.</p>
      <div class="grid">
        ${C.topics.map((t) => `<button class="opt" data-topic="${t.id}"><span class="em">${t.emoji}</span>${esc(t.label)}</button>`).join("")}
      </div>`;
  }

  function viewSeed() {
    const t = topic();
    const sparks = t.sparks.map((p, i) =>
      `<button class="opt ${s.spark === i ? "sel" : ""}" data-spark="${i}">${esc(p)}</button>`).join("");
    const body = `
      <span class="label">Have you ever…? <span style="font-weight:400;color:var(--muted)">(tap one that rings a bell)</span></span>
      <div class="list">${sparks}</div>
      <span class="label">${esc(t.subjectQ)}</span>
      <input type="text" id="subject" maxlength="80" placeholder="${esc(t.subjectPlaceholder)}" value="${esc(s.subject)}">`;
    return shell(`${t.emoji} ${t.label}`, "Pick a prompt, then tell us what it is. It can be something simple.", body, { disabled: !s.subject.trim() });
  }

  function viewRoute() {
    return `
      <h2>Which sounds most like you?</h2>
      <p class="hint">About “${esc(s.subject)}”. There are no wrong answers.</p>
      <div class="list">
        ${C.routes.map((r) => `<button class="opt ${s.route === r.id ? "sel" : ""}" data-route="${r.id}"><span class="em">${r.emoji}</span>${esc(r.label)}<span class="sub">${esc(r.sub)}</span></button>`).join("")}
      </div>
      <div class="nav"><button class="btn ghost" data-a="back">← Back</button></div>`;
  }

  function viewQuestion(idx) {
    const q = C.engines[s.route][idx];
    const a = s.ans[q.id] || { chip: "", text: "" };
    const body = `
      <div class="chips">${q.chips.map((c) => `<button class="chip ${a.chip === c ? "sel" : ""}" data-chip="${esc(c)}" data-q="${q.id}">${esc(c)}</button>`).join("")}</div>
      <input type="text" data-text="${q.id}" maxlength="160" placeholder="${esc(q.placeholder)}" value="${esc(a.text)}">`;
    return shell(q.title, "Tap one, type a few words, or both. Skip it if nothing fits.", body, { skip: true });
  }

  function viewWho() {
    const body = `
      <div class="chips">${C.who.map((w) => `<button class="chip ${s.who.includes(w) ? "sel" : ""}" data-who="${esc(w)}">${esc(w)}</button>`).join("")}</div>
      ${s.who.length && !s.who.every((w) => w === "Alone") ? `<input type="text" id="whoDid" maxlength="160" placeholder="${esc(C.whoDidPlaceholder)}" value="${esc(s.whoDid)}">` : ""}`;
    return shell("Who's in this story?", "People make a story. Pick who, then add what they did or said so they make it in.", body, { skip: true });
  }

  function viewTwist() {
    const picked = C.twists.find((t) => t.id === s.twist);
    const body = `
      <div class="list">${C.twists.map((t) => `<button class="opt ${s.twist === t.id ? "sel" : ""}" data-twist="${t.id}">${esc(t.label)}</button>`).join("")}</div>
      ${picked ? `<span class="label">${esc(picked.q)}</span><input type="text" id="twistText" maxlength="160" placeholder="${esc(picked.placeholder)}" value="${esc(s.twistText)}">` : ""}`;
    return shell("Anything that makes it yours?", "Optional. This is what makes a story stick. Pick one, or skip.", body, { skip: true, nextLabel: "Write my story ✨" });
  }

  function viewResult() {
    if (s.loading) return `<div class="loading"><span class="spinner">✍️</span><p>Writing your story…</p></div>`;
    const atCap = s.regens >= CFG.MAX_REGENERATES;
    const hook = s.askBacks[s.hookIdx] || "";
    return `
      <h2>Fact ${factNumber} of ${CFG.MAX_FACTS}: your story</h2>
      <p class="hint">Edit it until it sounds like you. Then say it out loud.</p>
      ${s.error ? `<p class="error">${esc(s.error)}</p>` : ""}
      <div class="bubble"><textarea id="story">${esc(s.story)}</textarea></div>
      <div class="ask"><b>Ask them back</b><textarea id="hook" rows="2" maxlength="200">${esc(hook)}</textarea></div>
      <div class="row">
        ${s.askBacks.length > 1 ? `<button class="btn" data-a="otherhook">Another question</button>` : ""}
        <button class="btn" data-a="regen" ${atCap ? "disabled" : ""}>↻ Rewrite (${Math.max(0, CFG.MAX_REGENERATES - s.regens)} left)</button>
      </div>
      <div class="row">
        <button class="btn primary" data-a="copy">${s.copied ? "Copied ✓" : "Copy story"}</button>
        <button class="btn" data-a="newfact">${factNumber >= CFG.MAX_FACTS ? "Start over" : "Make another fact"}</button>
      </div>
      <p class="note">Nothing is saved. Copy it to your notes before you leave.</p>`;
  }

  // ---------- render + events ----------
  function render() {
    const l = stepList();
    const idx = l.indexOf(s.step);
    const total = l.length - 1;
    const inFlow = s.step !== "topic" && s.step !== "result";
    progress.hidden = !inFlow;
    meta.hidden = !inFlow;
    if (inFlow) {
      bar.style.width = Math.round((idx / total) * 100) + "%";
      meta.textContent = `Fact ${factNumber} of ${CFG.MAX_FACTS} · Step ${idx} of ${total - 1}`;
    }
    const views = {
      topic: viewTopic, seed: viewSeed, route: viewRoute,
      q1: () => viewQuestion(0), q2: () => viewQuestion(1),
      who: viewWho, twist: viewTwist, result: viewResult
    };
    app.className = s.step !== lastStep ? "enter" : "";
    lastStep = s.step;
    app.innerHTML = views[s.step]();
    app.querySelectorAll(".bubble textarea, .ask textarea").forEach(grow);
  }

  function grow(el) { el.style.height = "auto"; el.style.height = el.scrollHeight + 4 + "px"; }

  // Little burst of palette-colored confetti.
  function confetti(count) {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const colors = ["#7A1F35", "#A9C47F", "#F4B6C9", "#F3EAE0", "#2B2829"];
    const box = document.createElement("div");
    box.className = "confetti";
    for (let i = 0; i < (count || 36); i++) {
      const p = document.createElement("i");
      p.style.left = Math.random() * 100 + "%";
      p.style.background = colors[i % colors.length];
      p.style.setProperty("--x", (Math.random() * 160 - 80) + "px");
      p.style.setProperty("--r", (Math.random() * 720 - 360) + "deg");
      p.style.setProperty("--d", (1.2 + Math.random() * 1.1) + "s");
      p.style.animationDelay = Math.random() * 0.25 + "s";
      box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 2800);
  }

  app.addEventListener("click", (e) => {
    const el = e.target.closest("button");
    if (!el) return;
    const d = el.dataset;
    if (d.topic) { s.topic = d.topic; s.spark = null; go("seed"); return; }
    if (d.spark !== undefined) { s.spark = s.spark === +d.spark ? null : +d.spark; render(); return; }
    if (d.route) { s.route = d.route; s.ans = {}; go("q1"); return; }
    if (d.chip !== undefined) {
      const a = s.ans[d.q] || { chip: "", text: "" };
      a.chip = a.chip === d.chip ? "" : d.chip;
      s.ans[d.q] = a; render(); return;
    }
    if (d.who) {
      s.who = s.who.includes(d.who) ? s.who.filter((w) => w !== d.who) : s.who.concat(d.who);
      render(); return;
    }
    if (d.twist) { s.twist = s.twist === d.twist ? null : d.twist; if (!s.twist) s.twistText = ""; render(); return; }
    switch (d.a) {
      case "back": back(); break;
      case "next": if (s.step === "twist") { next(); generate(); } else next(); break;
      case "skip": if (s.step === "twist") { s.twist = null; s.twistText = ""; next(); generate(); } else next(); break;
      case "otherhook": s.hookIdx = (s.hookIdx + 1) % s.askBacks.length; render(); break;
      case "regen": s.regens++; generate(); break;
      case "copy": copy(); break;
      case "newfact":
        factNumber = factNumber >= CFG.MAX_FACTS ? 1 : factNumber + 1;
        s = fresh(); render(); break;
    }
  });

  app.addEventListener("input", (e) => {
    const t = e.target;
    if (t.id === "subject") { s.subject = t.value; const n = app.querySelector('[data-a="next"]'); if (n) n.disabled = !t.value.trim(); }
    else if (t.dataset.text) { const a = s.ans[t.dataset.text] || { chip: "", text: "" }; a.text = t.value; s.ans[t.dataset.text] = a; }
    else if (t.id === "whoDid") s.whoDid = t.value;
    else if (t.id === "twistText") s.twistText = t.value;
    else if (t.id === "story") { s.story = t.value; grow(t); }
    else if (t.id === "hook") { s.askBacks[s.hookIdx] = t.value; grow(t); }
  });

  async function copy() {
    const text = `${s.story.trim()}\n\n${(s.askBacks[s.hookIdx] || "").trim()}`.trim();
    try { await navigator.clipboard.writeText(text); }
    catch (_) {
      const ta = document.getElementById("story"); ta.select(); document.execCommand("copy");
    }
    s.copied = true; render(); confetti(20);
    setTimeout(() => { s.copied = false; if (s.step === "result") render(); }, 1800);
  }

  // ---------- story generation ----------
  function buildPayload() {
    const t = topic();
    const answers = C.engines[s.route]
      .map((q) => ({ q: q.title, a: answerText(q.id) }))
      .filter((x) => x.a);
    const tw = C.twists.find((x) => x.id === s.twist);
    return {
      topic: t.label,
      spark: s.spark !== null ? "Have you ever " + t.sparks[s.spark] : "",
      subject: s.subject.trim(),
      route: C.routes.find((r) => r.id === s.route).label,
      answers,
      who: s.who,
      whoDid: s.whoDid.trim(),
      twist: tw && s.twistText.trim() ? { kind: tw.label, q: tw.q, a: s.twistText.trim() } : null,
      variation: s.regens
    };
  }

  async function generate() {
    s.loading = true; s.error = ""; s.copied = false;
    go("result");
    const payload = buildPayload();
    try {
      let out;
      if (!CFG.WORKER_URL) {
        await new Promise((r) => setTimeout(r, 400));
        out = demoStory(payload);
      } else {
        const res = await fetch(CFG.WORKER_URL, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
        out = data;
      }
      s.story = out.story;
      s.askBacks = out.askBacks && out.askBacks.length ? out.askBacks : [""];
      s.hookIdx = 0;
    } catch (err) {
      s.error = err.message || "Something went wrong. Please try again.";
      s.regens = Math.max(0, s.regens - (s.story ? 1 : 0));
    }
    s.loading = false;
    render();
    if (!s.error) confetti(44);
  }

  // Demo mode (no Worker configured): stitches the answers together without AI.
  function demoStory(p) {
    const parts = ["Fun fact about me: I really like " + p.subject + "."];
    p.answers.forEach((x) => parts.push(x.a.replace(/^([^:]+):\s*/, "$1, ") + "."));
    if (p.who.length) parts.push("I usually share it with: " + p.who.join(", ").toLowerCase() + ".");
    if (p.twist) parts.push(p.twist.a.replace(/\.$/, "") + ".");
    return {
      story: parts.slice(0, 4).join(" ") + "\n\n(Demo mode: set WORKER_URL in config.js for a real written story.)",
      askBacks: ["What's your favorite thing about " + p.subject + "?", "Do you know a good place for " + p.subject + "?", "Are you more into " + p.subject + " or something totally different?"]
    };
  }

  render();
})();
