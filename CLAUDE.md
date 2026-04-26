# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

No `package.json` — runtime is Deno. All tasks via `deno task`.

```bash
deno task dev      # start dev server (Vite + Svelte)
deno task build    # production build → dist/
deno task preview  # preview built dist/
deno task serve    # serve dist/ via Deno HTTP file server
deno lint          # lint src/ (Deno built-in)
deno fmt           # format src/ (tabs, 4-space indent, single quotes)
```

## Architecture

Single-page app: **Svelte 5 + Vite 6**, bundled by Deno-run Vite, no Node/npm.

**Data flow:**
- `src/peopleStore.js` — all shared state (Svelte writable stores): `people` (persisted to `localStorage`), `peopleToPlay`, `avatarSelected`, `count`, `startingCounter`, `intervalId`
- `src/App.svelte` — root; initializes `people` store from localStorage on mount, controls intro → avatar-list transition
- `src/components/GroupAvatar.svelte` — main game logic: three modes (`EDIT` / `STARTED` / `FINISHED`), manages countdown trigger and random person selection via `peopleToPlay` store
- `src/components/Counter.svelte` — countdown display; starts `setInterval` on mount, decrements `count` store, interval ID stored in `intervalId` store so `GroupAvatar` can `clearInterval` when count hits 0
- `src/components/Avatar.svelte` — renders one person; handles removal from `people` store + localStorage
- `src/components/NewAvatar.svelte` — add-person form; generates avatar URL from DiceBear API (`https://api.dicebear.com/7.x/avataaars/svg?seed=<name>`), persists to localStorage

**i18n:** `src/i18n.js` registers EN/ES/FR locales (lazy-loaded from `locales/*.json`) via `svelte-i18n`. Locale auto-detected from browser navigator. Fallback: `en`.

**Build/deploy:** GitHub Actions (`.github/workflows/deploy.yml`) installs Deno v2.x and runs `deno task build`. No deploy step in CI — only artifact build.

## Formatting

Deno fmt config (from `deno.json`): tabs, 80-char line width, 4-space indent width, semicolons, single quotes.
