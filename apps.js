// App registry — the launcher renders one tile per entry, in this order.
//
// To add an app:
//   1. Put it in its own folder at the repo root:  /<slug>/index.html
//   2. Add an entry below.
//
// Fields:
//   slug   (required) folder name; the tile links to /<slug>/
//   name   (required) label under the tile (keep it short, ~10 chars)
//   blurb  (optional) one line shown in the detail list
//   icon   (optional) path to a square image (png/svg). If omitted, a glyph tile is drawn.
//   glyph  (optional) 1–2 characters or an emoji for the glyph tile (default: first letter of name)
//   hue    (optional) 0–360, tints the glyph tile (default: derived from slug)
//   href   (optional) override the link entirely (e.g. an external URL)

window.APPS = [
  {
    slug: "midee",
    name: "midee",
    blurb: "MIDI player & falling-notes visualizer",
    icon: "/midee/icons/icon-192.png",
  },
];
