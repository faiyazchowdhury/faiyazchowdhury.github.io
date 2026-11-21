# faiyazchowdhury.github.io

This site is a home-screen launcher for a collection of web apps, served by GitHub Pages from `master`.
Faiyaz uses it from his phone: a change pushed to `master` is live within a minute or two, so every
app must work on a phone browser first.

## Layout

- `index.html`: the launcher. It renders one tile per entry in `apps.js`. Avoid editing it unless the launcher itself is changing.
- `apps.js`: the app registry (`window.APPS`). Its header comment documents the fields.
- `<slug>/`: each app lives in its own top-level folder with its own `index.html`.
- `shared/`: `base.css` (palette, light/dark, buttons, sheets) and `store.js` (`window.Kit`: localStorage store with JSON backup/restore, toast, bottom sheet, escaping). Apps load them with `../shared/...`.
- `guide/`: the "Make your own" page linked from the top of the launcher. Its "For Claude" section is what Claude reads when someone asks it to "read this guide", and `guide/app-launcher/SKILL.md`, a skill other people can hand to Claude to build a site like this. Keep the skill in step when the house rules here change.
- `midee/`: a pre-built third-party bundle (Vite build, base `/midee/`). Don't hand-edit it; replace it with a fresh build when updating.

## Adding an app

1. Create `/<slug>/index.html`. Plain HTML/CSS/JS is preferred, since there is no build step. If an app has its own build, commit its built output with the base path `/<slug>/`.
2. Add `{ slug, name, blurb, section, ... }` to `apps.js`. `section` picks the launcher heading (Lifestyle, Learning, Music, ...). Without an `icon`, the tile gets a tinted glyph automatically.
3. Mobile basics: `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`, respect `env(safe-area-inset-*)`, use touch-friendly targets, and support light and dark mode.
4. Optionally add a small "← Apps" link back to `/`.
5. Commit and push directly to `master`. Don't leave changes on a feature branch or open a pull request unless asked: the site deploys only from `master`, and Faiyaz expects to see the change on his phone right away. This applies to cloud sessions too.

## Don'ts

- Don't add a service worker to the launcher. It would cache stale versions, and the point is that pushes show up immediately.
- Jekyll is disabled (`.nojekyll`), so files are served as-is.
