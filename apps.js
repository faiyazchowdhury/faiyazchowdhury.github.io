// App registry — the launcher renders one tile per entry, in this order.
//
// To add an app:
//   1. Put it in its own folder at the repo root:  /<slug>/index.html
//   2. Add an entry below.
//
// Fields:
//   slug   (required) folder name; the tile links to <slug>/
//   name   (required) label under the tile (keep it short, ~10 chars)
//   blurb  (optional) one line shown in the detail list
//   icon   (optional) relative path to a square image (png/svg). If omitted, a glyph tile is drawn.
//   glyph  (optional) 1–2 characters or an emoji for the glyph tile (default: first letter of name)
//   hue    (optional) 0–360, tints the glyph tile (default: derived from slug)
//   href   (optional) override the link entirely (e.g. an external URL)
//   section (optional) heading the tile is grouped under; sections appear in the order first used

window.APPS = [
  {
    slug: "rollplay",
    name: "RollPlay",
    blurb: "Roll a weighted die for what to do next",
    glyph: "⚄",
    hue: 255,
    section: "Lifestyle",
  },
  {
    slug: "journey",
    name: "Journey",
    blurb: "Long-term goals, step by step",
    glyph: "⛰",
    hue: 95,
    section: "Lifestyle",
  },
  {
    slug: "learn",
    name: "Learn",
    blurb: "Cognitive science topics, with a confidence rating for each",
    glyph: "✦",
    hue: 200,
    section: "Learning",
  },
  {
    slug: "sophia",
    name: "Sophia",
    blurb: "Sparkles: a field guide to goodness",
    glyph: "✧",
    hue: 50,
    section: "Books",
  },
  {
    slug: "repertoire",
    name: "Repertoire",
    blurb: "Guitar and piano pieces to learn and perform",
    glyph: "𝄞",
    hue: 30,
    section: "Music",
  },
  {
    slug: "chords",
    name: "Chords",
    blurb: "Chord progressions by degree, and the songs that use them",
    glyph: "IV",
    hue: 150,
    section: "Music",
  },
  {
    slug: "vocal-range",
    name: "Range",
    blurb: "Songs that fit my voice, and how far to transpose them",
    glyph: "♪",
    hue: 300,
    section: "Music",
  },
  {
    slug: "midee",
    name: "midee",
    blurb: "MIDI player & falling-notes visualizer",
    icon: "midee/icons/icon-192.png",
    section: "Music",
  },
  {
    slug: "guitar-tools",
    name: "Guitar",
    blurb: "Metronome, tuner, scale finder and chord identifier",
    glyph: "♫",
    hue: 45,
    section: "Music",
  },
  {
    slug: "stochastic-chess",
    name: "Chess",
    blurb: "Stochastic chess: pieces may disobey",
    glyph: "♞",
    hue: 20,
    section: "Games",
  },
];
