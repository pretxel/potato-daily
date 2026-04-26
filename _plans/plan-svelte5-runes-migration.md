# Plan: Migrate to Svelte 5 Runes

## Problem / Motivation

The project depends on Svelte 5 (`vite.config.mts` pins `npm:svelte@^5`), but the
codebase still uses Svelte 3/4-era idioms throughout:

- `peopleStore.js` exposes `writable()` stores instead of rune-based state.
- Components consume stores via `$store` auto-subscriptions and `store.subscribe(...)`
  callbacks left dangling without cleanup (e.g., `GroupAvatar.svelte:47-66`,
  `Counter.svelte:7-9`).
- `export let` props are used for component inputs (`Avatar.svelte`,
  `GroupAvatar.svelte`).
- `on:click` legacy event syntax is used in every component instead of the new
  `onclick` event-attribute syntax.
- Reactive subscriptions like `count.subscribe` in `GroupAvatar.svelte` create
  side-effecting closures (with a stray `console.log(value)` on line 60) that
  leak across the lifetime of the page since they are never cleaned up.

Migrating unlocks the full benefits of Svelte 5: explicit reactivity with
`$state` / `$derived` / `$effect`, fine-grained updates, predictable cleanup,
and removal of the easy-to-misuse `subscribe` pattern. It also reduces the
"two-way binding via store + local mirror variable" anti-pattern visible in
`GroupAvatar.svelte` (`peopleT`, `intervalIdTemporal`, `avatarSelectedC`,
`showCounter` are all mirrors of stores).

## Proposed Solution

Migrate state and components incrementally, leaning on Svelte's official
migration tool first and then hand-cleaning idioms the codemod cannot infer.

### Step 1 — Convert shared state to runes

Replace `src/peopleStore.js` with a rune-based module that exposes plain
reactive values plus helpers, and persist `people` via a single `$effect` rather
than ad-hoc `localStorage.setItem` calls scattered across components:

- Export an object (or named getters) backed by `$state`: `people`,
  `peopleToPlay`, `avatarSelected`, `count`, `startingCounter`, `intervalId`.
- Centralize localStorage hydration on import and persistence inside an
  `$effect.root(() => $effect(() => localStorage.setItem(...)))` block, so
  `Avatar.svelte` and `NewAvatar.svelte` no longer call `localStorage` directly.
- Keep the module shape simple — a `state.js` file with `export const state =
  $state({...})` is enough for an app this small.

### Step 2 — Run the official migration codemod

Run `npx sv migrate svelte-5` (or `deno run -A npm:sv migrate svelte-5`) on
`src/`. It will rewrite `export let` → `$props()`, and `on:click` →
`onclick={...}` for the most part. Review every diff manually since the codemod
does not touch store usage.

### Step 3 — Replace store subscriptions with `$derived` / `$effect`

- `GroupAvatar.svelte`: delete the four `*.subscribe(...)` callbacks; read
  state directly. Replace the `count.subscribe` side-effect with
  `$effect(() => { if (state.count === 0) { ... } })`. Remove the `console.log`.
- `Counter.svelte`: replace `count.subscribe` with direct reads; keep
  `setInterval` setup inside `$effect(() => { ... return () => clearInterval(id); })`
  so the interval is cleaned up automatically when the component unmounts. This
  removes the need for `intervalId` to be shared state at all — `GroupAvatar`
  can stop the counter by toggling `startingCounter`.
- `App.svelte`: drop the `onMount` `people.subscribe`. Use a `$derived` to keep
  `peopleToPlay` in sync, or set it inside an `$effect` keyed on `state.people`.

### Step 4 — Convert props and events

- `Avatar.svelte`, `GroupAvatar.svelte`: change `export let name` (etc.) to
  `let { name, image, editable, index } = $props();`.
- All components: change `on:click` → `onclick`, `on:submit` → `onsubmit`.
- `App.svelte`: `bind:value` keeps working, but verify the migration codemod
  did not break it.

### Step 5 — Eliminate accidental shared mutable state

`GroupAvatar.svelte` mirrors `peopleToPlay` into a local `peopleT` and then
mutates `peopleT` in place via `splice` (`choosePerson`, line 32). Convert this
to immutable updates against `state.peopleToPlay` so the rune sees the change.
The `editable` prop is reassigned locally on line 40/71 even though it is
declared as a prop — drop the prop and derive it from `mode`.

### Step 6 — Verify

- `deno task dev` — manual smoke test of the three modes (edit/started/finished).
- `deno lint` and `deno fmt --check`.
- After test infrastructure exists (see plan-testing-setup), add unit tests for
  `state.js` and a component test for `GroupAvatar` mode transitions.

## Files Affected

- `src/peopleStore.js` → rename to `src/state.svelte.js` (runes require the
  `.svelte.js` extension).
- `src/App.svelte`
- `src/components/GroupAvatar.svelte`
- `src/components/Counter.svelte`
- `src/components/Avatar.svelte`
- `src/components/NewAvatar.svelte`

## Effort Estimate

**M** — six small files, but the store-to-rune conversion in `GroupAvatar.svelte`
requires careful manual rework because the existing logic relies on subtle
subscribe ordering. Plan ~½ day including manual smoke testing.

## Acceptance Criteria

- No `writable`, `.subscribe(`, `$<storeName>` auto-subscribe, or `export let`
  remains in `src/`.
- No `on:` event directives remain (all migrated to `onclick`/`onsubmit`).
- `localStorage` persistence happens in exactly one place (the state module).
- Stray `console.log` in `GroupAvatar.svelte` is removed.
- `setInterval` in `Counter.svelte` is cleared via the `$effect` cleanup
  function on unmount, not via shared `intervalId` state.
- `deno task dev` runs without console errors and the full game loop
  (add → start → countdown → pick → repeat → finish → restart) works.
- `deno lint` passes and `deno fmt --check` reports no diffs.
