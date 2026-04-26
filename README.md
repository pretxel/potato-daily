# Te Toca (Potato Daily)

A random daily task picker for scrum teams without a scrum master. Add team members, start the round, and the app counts down then randomly selects one person to talk. Repeat until everyone has had a turn.

## Requirements

- [Deno](https://deno.land/) v2.x or later

No `package.json`, no Node, no npm — Vite runs through Deno.

## Commands

```bash
deno task dev      # start Vite dev server
deno task build    # production build → dist/
deno task preview  # preview the built dist/
deno task serve    # serve dist/ via Deno's std/http file server
deno lint          # lint src/
deno fmt           # format src/ (tabs, 4-space indent, single quotes, 80-char width)
```

## Architecture

Single-page app built with **Svelte 5** and **Vite 6**.

- `src/peopleStore.js` — shared state in Svelte writable stores: `people` (persisted to `localStorage`), `peopleToPlay`, `avatarSelected`, `count`, `startingCounter`, `intervalId`.
- `src/App.svelte` — root component; loads `people` from `localStorage` on mount and handles the intro → avatar-list transition.
- `src/components/GroupAvatar.svelte` — main game logic with three modes (`EDIT` / `STARTED` / `FINISHED`); triggers the countdown and randomly picks the next person from `peopleToPlay`.
- `src/components/Counter.svelte` — countdown UI; runs a `setInterval` decrementing `count`, stores the interval id in `intervalId` so `GroupAvatar` can clear it at zero.
- `src/components/Avatar.svelte` — renders a single person; removes from `people` and `localStorage` on delete.
- `src/components/NewAvatar.svelte` — add-person form; generates avatars via the [DiceBear API](https://api.dicebear.com/) (`avataaars` style, seeded by name) and persists to `localStorage`.

## Internationalization

Powered by [`svelte-i18n`](https://github.com/kaisermann/svelte-i18n) in `src/i18n.js`. Locale is auto-detected from the browser, with `en` as the fallback.

Supported locales:

- `en` — English
- `es` — Spanish
- `fr` — French

To add a new locale:

1. Add `locales/<code>.json` mirroring the keys in `locales/en.json`.
2. Register it in `src/i18n.js`:
   ```js
   register('<code>', () => import('../locales/<code>.json'));
   ```

## Deploy

CI runs on every push via GitHub Actions (`.github/workflows/deploy.yml`): installs Deno v2.x and runs `deno task build`. The workflow produces the `dist/` artifact; no remote deploy step is wired up.
