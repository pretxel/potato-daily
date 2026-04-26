# Plan: UX Enhancements (Empty State, Loading Feedback, Error Handling)

## Problem / Motivation

Several user-visible rough edges exist today:

1. **Empty state.** A brand-new user lands on the app, dismisses the intro,
   and sees… nothing — just the "Add new avatar" form. There is no copy
   explaining "you have no players yet, add one to start". The Start button
   is correctly hidden when `people.length === 0`
   (`GroupAvatar.svelte:136`), but no replacement guidance appears.

2. **No avatar load feedback.** `NewAvatar.svelte:12` builds an image URL
   pointing at `https://api.dicebear.com/7.x/avataaars/svg?seed={name}` and
   adds the entry immediately. The avatar is then fetched lazily by the
   `<img>` tag in `Avatar.svelte:27`. There is no loading shimmer/skeleton,
   no spinner, and no fallback if the request 404s, errors, or DiceBear is
   blocked. The user sees a broken-image icon.

3. **Add-form has no validation feedback.** Submitting an empty name silently
   does nothing (`NewAvatar.svelte:8`). Submitting a duplicate name creates
   a duplicate entry that renders identically to the first (same
   DiceBear seed). There is no character limit hint and no trim of
   leading/trailing whitespace.

4. **No undo for removal.** Clicking the close button on
   `Avatar.svelte:9-15` deletes the person from `localStorage` immediately
   with no confirmation and no undo. Easy to mis-click during a meeting.

5. **`Counter.svelte` blocks attention with no context.** A bare number
   appears, ticks down, and disappears. There is no "Picking in 3..." copy,
   and the styling of the box looks like a button (it has rounded corners,
   border, and padding identical to the page's button styles).

6. **Stale i18n loading state.** `App.svelte:31-32` shows the literal string
   "Please wait..." (in English, hardcoded) while `svelte-i18n` initializes.
   For ES/FR users this flickers English text.

7. **No persistence of "last picked" history.** The selected person panel
   is wiped the moment the next round starts. No way to see "we already
   picked X, Y, Z this session".

8. **Restart UX is brittle.** After "FINISHED" the only path back is the
   "Again" button. There is no way to add a new person mid-game without a
   full reset.

## Proposed Solution

Treat each of the above as a discrete, optional improvement and pick them
off in order of impact. Steps 1, 2, 3, and 5 are the minimum viable polish.

### Step 1 — Empty-state copy

In `GroupAvatar.svelte`, when `people.length === 0` and `mode === EDIT`,
render a friendly empty-state block above the `<NewAvatar />` form:

```svelte
{#if mode === MODES.edit && people.length === 0}
  <p class="empty-state">{$_('page_empty_state')}</p>
{/if}
```

Add `page_empty_state` to all three locale JSON files: e.g. "Add at least
one person to get started." Style it muted (e.g. `opacity: 0.7`) and
center-aligned.

### Step 2 — Avatar loading + error handling

Create a small `LazyAvatarImage.svelte` wrapper:

- Renders a placeholder (CSS gradient circle or initials of `name`) while the
  underlying `<img>` is loading.
- Listens for `on:load` to reveal the image, and `on:error` to swap to a
  fallback initials avatar (no network needed). Use a stable color derived
  from a hash of `name` so duplicates still differ visually.
- Uses `loading="lazy"` and `decoding="async"`.

Refactor `Avatar.svelte` to use this wrapper instead of a raw `<img>`. This
also handles the case where the user is offline or DiceBear is blocked by
a corporate firewall.

Optional follow-up: pre-fetch and cache the SVG payload to `localStorage` (or
IndexedDB) so the avatar survives offline. This is a stretch goal — defer.

### Step 3 — Form validation + duplicate prevention

`NewAvatar.svelte`:

- Trim the input on submit. Reject empty strings *and* whitespace-only.
- Reject duplicates (case-insensitive) and surface a small inline error:
  `"Name already added"`. Add the i18n key.
- Cap length at e.g. 30 characters via `maxlength`.
- After successful add, focus the input and clear it (already clears, but
  also re-focus so the user can keep typing).
- Show a polite live-region message ("Added {name}") — coordinated with the
  accessibility plan.

### Step 4 — Undo on remove (toast)

Add a tiny in-app toast component (`src/components/Toast.svelte`) that
renders a single transient message at the bottom of the screen with an
"Undo" button. When `Avatar.svelte`'s remove button is clicked:

- Capture the removed entry and its index in a module-level `lastRemoved`
  state.
- Show the toast for ~5 seconds.
- "Undo" re-inserts at the original index and clears `lastRemoved`.

Implementation note: this pairs naturally with the runes migration
(plan-svelte5-runes-migration) — defer until after that lands so the toast
plugs into the new state module cleanly.

### Step 5 — Counter context and styling

`Counter.svelte`:

- Add accompanying copy: "Picking in {countValue}…" (i18n key
  `page_counter_picking_in`).
- Restyle so it does not look like a button — drop the `border` and
  `border-radius` from the inner span and rely on font-size/weight for
  emphasis.
- Pulse animation on each tick (respecting `prefers-reduced-motion`).

### Step 6 — i18n-aware loading state

`App.svelte`:

- Replace `Please wait...` literal with a non-translated, language-neutral
  fallback (e.g., a spinner SVG with `aria-label="Loading"`). Or detect
  `navigator.language` once and pick the right pre-translated string from a
  hardcoded map of three values. The spinner is simpler and recommended.

### Step 7 — Session "already picked" list

`GroupAvatar.svelte`:

- Add a `pickedHistory` state that grows each time `choosePerson` is called.
- Render a small horizontal strip below the selected-avatar panel showing
  prior picks at half opacity, captioned `"Already picked"` (new i18n key).
- Reset on `initToPlay`.

### Step 8 — Allow adding mid-session

The current `editable` flag flips to `false` on Start (`GroupAvatar.svelte:71`),
hiding `<NewAvatar />` entirely. Decision needed: either keep the form
visible so people can add late-arrivers (and queue them into `peopleToPlay`),
or surface a small "Add another" button after FINISHED that returns to EDIT
without wiping picked history.

Recommend the second approach since it preserves game flow.

## Files Affected

- `src/components/GroupAvatar.svelte` — empty state, picked-history, restart
  flow.
- `src/components/NewAvatar.svelte` — validation, duplicate check.
- `src/components/Avatar.svelte` — replace raw `<img>` with
  `LazyAvatarImage`.
- `src/components/LazyAvatarImage.svelte` — new.
- `src/components/Toast.svelte` — new.
- `src/components/Counter.svelte` — context copy, styling.
- `src/App.svelte` — replace "Please wait..." with spinner.
- `locales/en.json`, `locales/es.json`, `locales/fr.json` — new keys:
  `page_empty_state`, `page_counter_picking_in`, `error_duplicate_name`,
  `error_empty_name`, `page_already_picked`, `toast_removed`,
  `toast_undo`, `toast_loading`.
- `src/styles/animations.css` (optional) — for counter pulse and toast
  slide-in.

## Effort Estimate

**L** — eight discrete improvements that span every component plus two new
components and i18n updates across three locales. Plan ~2 days, or break
into shippable chunks (Steps 1+3+5+6 first as MVP, ~½ day; rest as
follow-ups).

## Acceptance Criteria

- A new user sees clear copy explaining how to start when `people` is empty.
- Adding an avatar with an unreachable DiceBear API still renders something
  recognizable (initials placeholder, no broken-image icon).
- Submitting an empty or duplicate name shows an inline error and does not
  add an entry.
- Removing an avatar shows a toast with a working Undo button for ≥5
  seconds.
- The countdown reads as "Picking in 3…" / equivalent in active locale, not
  a bare number.
- The initial `Please wait...` string is replaced with a locale-neutral
  spinner.
- Picked-history strip persists across rounds within a session and resets
  on Restart.
- After FINISHED, the user can add a new person without losing the picked
  history.
- All new copy is translated in EN, ES, and FR.
