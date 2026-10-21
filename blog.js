(function () {
  const card = document.getElementById("card");
  const blog = document.getElementById("blog");
  const blogLink = document.getElementById("blogLink");

  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const step = (n, title) => `<h2 class="step"><span class="num" aria-hidden="true">${n}</span>${esc(title)}</h2>`;

  function figure(src, alt, caption) {
    return `
      <figure class="blog-fig">
        <a href="${src}" target="_blank" rel="noopener"><img src="${src}" alt="${esc(alt)}" loading="lazy"></a>
        ${caption ? `<figcaption>${esc(caption)}</figcaption>` : ""}
      </figure>`;
  }

  // Two screenshots side by side, each with a small label.
  function pair(a, b, caption) {
    const col = (x, label) => `
      <figure class="blog-fig">
        <a href="${x.src}" target="_blank" rel="noopener"><img src="${x.src}" alt="${esc(x.alt)}" loading="lazy"></a>
        <figcaption>${esc(label)}</figcaption>
      </figure>`;
    return `
      <div class="blog-pair">
        <div class="blog-pair-grid">${col(a, "Pick a topic")}${col(b, "Get your story")}</div>
        ${caption ? `<p class="blog-cap">${esc(caption)}</p>` : ""}
      </div>`;
  }

  const PAGE = `
    <header class="blog-hero">
      <a class="back" href="#/">← Back</a>
      <p class="kicker">The story behind the app</p>
      <h1>How I built Fun Fact Roster</h1>
      <p class="sub">Turn something small about you into a story you'll want to tell.</p>
    </header>

    <p>Most of the time, I feel like my fun fact just isn't fun enough.</p>
    <p>Whenever I'm in a meeting or a group setting and people start the whole “introduce yourself and share a fun fact” thing, my anxiety spikes. Same with elevator introductions and random small talk. My brain goes blank, or I panic because I feel like people won't think my fact is fun, or won't relate to it, since I grew up abroad and came to the U.S. for college.</p>
    <p>Then I talked about this with one of my professors. She helped me realize that what makes a fact “fun” isn't the fact itself, it's the context and the human element around it. She suggested turning it into a little story, giving people more to hold onto so they can actually continue the conversation.</p>
    <p>So I built this web app to help me figure out my own fun facts. You choose a favorite topic and a real, tiny fact about yourself, answer a few basic questions to flesh it out, and boom: you've got a fun fact you can actually feel comfortable sharing when meeting new people.</p>

    ${step(1, "Core questions")}
    <p>I ask these questions before building anything. The habit comes from my work as a marketer: my boss kept asking me about the content I built until I was clear on what I was doing, and I can't thank her enough for training me this well.</p>
    <div class="blog-card"><ul>
      <li><strong>What is it? </strong>A web app.</li>
      <li><strong>Who is it for? </strong>Anyone who's struggling to find themselves a “good” fun fact.</li>
      <li><strong>What is it for? </strong>Helping people come up with their own fun facts that they can bring into a conversation.</li>
    </ul></div>
    <p>Then I took my intention to Claude and asked it to grill me through a design tree. This was the first prompt:</p>
    <blockquote class="blog-quote">I want to develop a simple web app like a fun fact roster that helps people come up with their most interesting fun fact. It can be a simulator: ask for 1-2 inputs and follow up with more questions to tell a short story, 2-3 sentences, about that fact to make it most relatable and fun, yet unique. I'm thinking of using 5W1H for question framing, but suggest more approaches to drill deeper into the single fact. My way of thinking is we can begin by asking them to choose a topic from common topics that people usually talk about and go from there.</blockquote>

    ${step(2, "Mapping the user journey")}
    <p>Here's my first sketch. The logic is storytelling: a fact with personal context is easier to follow, more fun and engaging, and brings in feeling and people.</p>
    ${figure("img/sketch-flow.jpg", "Handwritten note card. Logic: storytelling, branching into personal context to follow (more fun and engaging) and feeling and people. Below, a flow: choose a topic from a list of topics, ask questions for more context with the 5W1H framework, then the fun fact generator, an LLM.", "First sketch: storytelling as the logic, then topic, questions, and an LLM.")}
    <p>From there the flow is simple: <strong>choose a topic</strong> from a list (which means I needed to make that list), <strong>ask questions</strong> for more context, with one or two further steps for better info, then hand everything to the <strong>fun fact generator</strong>, an LLM.</p>
    <h3>The questions: 5W1H</h3>
    <p>5W1H is a set of six simple questions: What, Who, Why, When, Where and How. Between them they cover most of what a listener wants to know about a moment, so they were a good way to turn one tiny fact into a story. Here is how each one shows up in the app:</p>
    <div class="blog-card"><ul>
      <li><strong>What. </strong>What is the fact? You pick a topic, then name the thing: “What food are we talking about?”</li>
      <li><strong>Who. </strong>Who is in the story? “Who is it about?” for stories about someone, plus a “who do you usually share it with?” step.</li>
      <li><strong>Why. </strong>Why does it matter? The optional twist step asks things like “What would surprise people?” and “What's the link?”</li>
      <li><strong>When. </strong>When did it happen? “Where and when was that?” and “How long has it been part of your life?”</li>
      <li><strong>Where. </strong>Where did it happen? It shares a question with When: “Where and when was that?”</li>
      <li><strong>How. </strong>How did it come about? “How often?” for habits and “How did it start?” for origin stories.</li>
    </ul></div>
    <p>You don't answer all six every time. Each fact follows one of four routes (a habit, one moment, where it started, or a person), and each route asks only the two questions that fit it. Every question can be skipped.</p>
    <p>In the final version I added a follow-up question as well. If the story doesn't carry the conversation on, there's a backup: ask a question! You'll see it in the green box in step 4.</p>

    ${step(3, "Building")}
    <p>This was the first web app I've ever built, even with vibe coding and Claude, so it was a learning curve.</p>
    <h3>Setting up GitHub</h3>
    <p>I set up my GitHub account for the first time and created my first repository. That's how the files on my computer become an app anyone can open with a link.</p>
    <h3>Using AI without losing control</h3>
    <p>Since an LLM drafts the short story from the user's input, I needed an LLM tool, and that's where the API comes in. Setting a cap limit was just as important, so people can't spend all my money. I also needed a Cloudflare Worker to protect my API key so nobody can steal it. I've never felt this technical in my whole life, even though this is only the surface of it all.</p>
    <p>Constraining the LLM was another challenge: keeping it from hallucinating and wandering far from what the user told it.</p>

    ${step(4, "Design and user experience")}
    <p>Claude is well known for web app design, so I figured I was in good hands. It was really crowded at first, with lots of interactive elements, so I trimmed it down and removed borders for more white space. Overall, it's really nicely designed.</p>
    ${pair(
      { src: "img/final-topics.png", alt: "Fun Fact Roster start screen: What do you want to talk about? Eight topic buttons: Food, Drinks, Weather and seasons, Music, Travel and places, Hobbies, Pets and animals, Childhood." },
      { src: "img/final-story.jpg", alt: "Fun Fact Roster result screen: a pink speech bubble with a short pumpkin spice story, a green Ask them back box with a question, and buttons to rewrite, copy or make another fact." },
      "The start and the result. Pick a topic, answer a few questions, and get a story plus a question to ask back."
    )}

    <h3>Thoughts</h3>
    <p>After building this app, I understand why people are hyped about vibe coding. It is really powerful: I made an app without touching the code! But I also understand the process behind it much better now: the logic, connecting my local files to publish to everyone via GitHub, connecting an API so the app can use AI, and, at the same time, needing a tool to protect that API key.</p>
    <p><strong>Definitely check it out and let me know your fun fact.</strong></p>
    <p><a class="btn primary" href="#/">Try Fun Fact Roster</a></p>`;

  blog.innerHTML = PAGE;

  const baseTitle = document.title;

  function route() {
    const onBlog = location.hash === "#/blog";
    blog.hidden = !onBlog;
    card.hidden = onBlog;
    blogLink.hidden = onBlog;
    document.title = onBlog ? "How I built Fun Fact Roster" : baseTitle;
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", route);
  if (location.hash === "#/blog") route();
})();
