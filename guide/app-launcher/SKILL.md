---
name: app-launcher-site
description: Set up and grow a personal "app launcher" website on GitHub Pages - a phone home screen of small web apps, each in its own folder, built by chatting with Claude. Use when the user wants to start such a site, add an app to it, or keep it working well on their phone.
---

# App launcher site

You are helping someone build a personal website that works like a phone home screen: one page of app
tiles, each opening a small web app that lives in its own folder. It is hosted free on GitHub Pages, it
has no build step, and every change you push to the default branch is live on their phone within a
minute or two. They describe an app in plain words; you build it, test it, and push it.

A working example, MIT-licensed, is https://github.com/faiyazchowdhury/faiyazchowdhury.github.io
(live at https://faiyazchowdhury.github.io). You may copy its `index.html` launcher, `apps.js`
registry, `shared/` folder and `CLAUDE.md` as a starting point, then make it the user's own: their
title, colours, icon and apps. Keep the MIT licence notice with any copied code.

## First-time setup

Do these in order, and check each one before moving on.

1. **Repository.** The site lives in a public repository named exactly `<github-username>.github.io`.
   If it does not exist, the user creates it on github.com (public, with a README) and starts a new
   Claude session with it attached. You cannot create it for them from a session that lacks it.
2. **Pages.** For a `<username>.github.io` repository, GitHub Pages publishes the default branch
   automatically. If the site does not appear after the first push, ask the user to open the
   repository's Settings, then Pages, and set the source to "Deploy from a branch", choosing the
   default branch and the root folder.
3. **Scaffold** these files at the repository root:
   - `.nojekyll` (empty), so files are served exactly as written.
   - `index.html`: the launcher. It reads `window.APPS` from `apps.js` and draws one tile per app,
     grouped under section headings. Tiles without an icon get a tinted glyph.
   - `apps.js`: the registry, with a header comment documenting its fields:
     `slug` (folder name), `name` (short tile label), `blurb`, `section`, and optional `icon`,
     `glyph`, `hue` and `href`.
   - `manifest.webmanifest` plus `icon.svg` and a 180×180 `icon-180.png`, so "Add to Home Screen"
     gives a proper icon and opens full screen.
   - `shared/base.css` (colour tokens for light and dark mode, buttons, cards, sheets) and
     `shared/store.js` (saving to localStorage, backup and restore, and an export that zips CSV
     files with a README summary). Apps load them with `../shared/...`.
   - `CLAUDE.md`: the house rules below, so every future session follows them.
4. **Push** to the default branch, then ask the user to open the site on their phone and add it to
   the home screen (Safari: Share, then Add to Home Screen; Chrome: menu, then Add to Home screen).

## House rules (put these in CLAUDE.md)

- **One folder per app.** `/<slug>/index.html`, plain HTML, CSS and JavaScript. No build step. If an
  app truly needs a framework, commit its built output with the base path `/<slug>/`.
- **Phone first.** Use the viewport meta tag with `viewport-fit=cover`, respect
  `env(safe-area-inset-*)`, keep tap targets at least about 44px, never scroll sideways, and support
  both light and dark mode with colour tokens.
- **Register every app** in `apps.js` with a `section` (for example Lifestyle, Learning, Music,
  Games). Add a small "← Apps" link back to `/` in each app.
- **Push straight to the default branch** unless the user asks otherwise: that branch is what the
  site serves, and the user expects to see the change on their phone right away.
- **No service worker on the launcher.** It would cache stale versions and hide new pushes.
- **Data stays on the device.** Apps save to localStorage. Safari can clear it for sites that are
  not on the home screen, so every app that keeps data offers Export (CSV files plus a README
  summary in one ZIP) and Backup/Restore (JSON). On phones, save files through the share sheet;
  downloads are unreliable in home-screen web apps.
- **Changing saved data later.** When you change an app's built-in starting data (new default
  items, new weights), migrate what the user already has: bump a version number in the saved data,
  update only values still at their old defaults, and add new items. Never wipe their progress.
- **Libraries from a CDN** only when needed, pinned to an exact version (for example
  `https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js`).

## Building an app

1. Restate the app in a few lines and make sensible choices without asking; ask only when the answer
   would change what you build.
2. Write `/<slug>/index.html`, reusing `shared/` for look and storage, and register it in `apps.js`.
3. **Test it before pushing.** Load it in a headless browser at phone size (Playwright's
   "iPhone 13" device works well) in both light and dark mode. Check there are no console errors
   and no sideways scrolling, try the main interactions, and look at screenshots. Test any logic
   that can be checked outside the page (game rules, music theory, maths) with known answers.
4. Commit with a clear message and push to the default branch. Then tell the user in plain words
   what the app does, where its tile is, anything you could not verify, and what you assumed.

## Cloud sessions

These sessions run in a cloud container that clones the repository fresh, so push before finishing.
The container's network may be limited. If an app needs outside data (an API, a dataset, a
website), the user can allow those hosts in the cloud environment's network settings; say which
hosts and why. The phone itself is not limited this way, so an app can load public data at
runtime even when the container cannot.
