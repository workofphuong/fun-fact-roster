// All question content lives here. Edit the wording freely; no code changes needed.
window.FFR_CONTENT = {
  topics: [
    {
      id: "food", emoji: "🍜", label: "Food",
      subjectQ: "What food are we talking about?",
      subjectPlaceholder: "e.g. noodles, apple strudel",
      sparks: [
        "…eaten the same thing again and again?",
        "…had a meal you still think about?",
        "…got hooked on a dish most people don't get?",
        "…learned to cook something from someone?",
        "…tried a food that surprised you?",
        "…got a comfort food you always go back to?",
        "…travelled just to eat something?"
      ]
    },
    {
      id: "drinks", emoji: "☕", label: "Drinks",
      subjectQ: "What drink are we talking about?",
      subjectPlaceholder: "e.g. iced coffee, jasmine tea",
      sparks: [
        "…had a morning ritual with a drink?",
        "…found a favorite drink by accident?",
        "…had a drink that tasted better somewhere else?",
        "…learned to make a drink yourself?",
        "…had a drink you can't go a day without?",
        "…tried a drink that totally surprised you?"
      ]
    },
    {
      id: "weather", emoji: "🌤️", label: "Weather & seasons",
      subjectQ: "What weather or season are we talking about?",
      subjectPlaceholder: "e.g. sunny fall days, rainy evenings",
      sparks: [
        "…had a season that feels like yours?",
        "…loved weather that other people complain about?",
        "…had a favorite kind of day you wait for all year?",
        "…been caught in weather you'll never forget?",
        "…had a season tied to a memory?",
        "…wished you lived somewhere with different weather?"
      ]
    },
    {
      id: "music", emoji: "🎵", label: "Music",
      subjectQ: "What music are we talking about?",
      subjectPlaceholder: "e.g. an artist, a song, an instrument",
      sparks: [
        "…had a song you replayed for days?",
        "…been to a show you still talk about?",
        "…learned an instrument, even a little?",
        "…had music tied to a place or a person?",
        "…liked music most people haven't heard of?",
        "…had a song that gets you every single time?"
      ]
    },
    {
      id: "travel", emoji: "✈️", label: "Travel & places",
      subjectQ: "What place are we talking about?",
      subjectPlaceholder: "e.g. a city, a road trip, my hometown",
      sparks: [
        "…been somewhere few people go?",
        "…got lost and it turned out great?",
        "…gone back to the same place again and again?",
        "…lived somewhere for a while?",
        "…had a trip go completely off plan?",
        "…have a place that feels like home but isn't?"
      ]
    },
    {
      id: "hobbies", emoji: "🎨", label: "Hobbies",
      subjectQ: "What hobby are we talking about?",
      subjectPlaceholder: "e.g. hiking, baking, chess",
      sparks: [
        "…picked up a hobby by accident?",
        "…got stubbornly into something for years?",
        "…been bad at a hobby and loved it anyway?",
        "…had a hobby that surprised people?",
        "…shared a hobby with someone close to you?",
        "…collected something?"
      ]
    },
    {
      id: "pets", emoji: "🐾", label: "Pets & animals",
      subjectQ: "What animal are we talking about?",
      subjectPlaceholder: "e.g. my cat, hamsters, dogs in general",
      sparks: [
        "…had a pet with a big personality?",
        "…had an animal encounter you'll never forget?",
        "…grown up with a pet?",
        "…wanted a pet you couldn't have?",
        "…got fond of an animal most people overlook?",
        "…had a pet do something unexpected?"
      ]
    },
    {
      id: "childhood", emoji: "🧸", label: "Childhood",
      subjectQ: "What are we talking about?",
      subjectPlaceholder: "e.g. a game, a cartoon, a place",
      sparks: [
        "…had a game you played all the time?",
        "…had a childhood show or book you still love?",
        "…had a place that was just yours?",
        "…done something as a kid that you'd never do now?",
        "…had a tradition that was your family's alone?",
        "…had a food or smell that takes you right back?"
      ]
    }
  ],

  routes: [
    { id: "habit",  emoji: "🔁", label: "I do it all the time", sub: "A habit or routine" },
    { id: "moment", emoji: "📍", label: "I remember one time", sub: "A single moment" },
    { id: "origin", emoji: "🌱", label: "It goes way back", sub: "Where it all started" },
    { id: "person", emoji: "👥", label: "It's about someone", sub: "A person in the story" }
  ],

  // Two skippable questions per route. Chips are quick taps; the text box is optional.
  engines: {
    habit: [
      {
        id: "h1", title: "How often?",
        chips: ["Every day", "A few times a week", "Once in a while", "Only on special occasions"],
        placeholder: "Anything to add? e.g. every day for breakfast"
      },
      {
        id: "h2", title: "Was it ever different?",
        chips: ["I used to do it way more", "I used to do it way less", "It's always been this way", "It changed when something happened"],
        placeholder: "What changed, or what was it like before?"
      }
    ],
    moment: [
      {
        id: "m1", title: "Which time is it?",
        chips: ["The best one ever", "The funniest one", "The most surprising one", "The first time"],
        placeholder: "What happened, in a few words?"
      },
      {
        id: "m2", title: "Where and when was that?",
        chips: ["On a trip", "At home", "With friends", "Back in school"],
        placeholder: "e.g. in Germany during my exchange"
      }
    ],
    origin: [
      {
        id: "o1", title: "How did it start?",
        chips: ["It's a family thing", "A friend got me into it", "I stumbled on it", "It's always been me"],
        placeholder: "Tell us how it began"
      },
      {
        id: "o2", title: "How long has it been part of your life?",
        chips: ["Since I was a kid", "Since school", "Since I moved away", "A few years now"],
        placeholder: "Anything else about the timing?"
      }
    ],
    person: [
      {
        id: "p1", title: "Who is it about?",
        chips: ["A parent or grandparent", "A friend", "A partner", "A sibling or cousin", "A teacher or coworker"],
        placeholder: "e.g. my grandma"
      },
      {
        id: "p2", title: "What did they do or say?",
        chips: ["Taught me", "Introduced me", "Surprised me", "Still does it with me"],
        placeholder: "A line they said, or something they did"
      }
    ]
  },

  who: ["Alone", "Family", "Friends", "Partner", "Coworkers", "A stranger", "A pet"],
  whoDidPlaceholder: "What did they do or say? (optional)",

  twists: [
    { id: "extreme",  label: "The best / longest / how many", q: "What's the best version of it?", placeholder: "e.g. I ate a whole cake in one sitting" },
    { id: "contrast", label: "It went differently than expected", q: "What did you expect, and what happened instead?", placeholder: "e.g. I thought I'd hate it" },
    { id: "link",     label: "It connects to something about me", q: "What's the link?", placeholder: "e.g. I was born in the fall" },
    { id: "surprise", label: "People would be surprised", q: "What would surprise people?", placeholder: "e.g. it's the only thing I can cook" },
    { id: "ritual",   label: "I do it in a special way", q: "What's your special way?", placeholder: "e.g. always with a fried egg on top" }
  ]
};
