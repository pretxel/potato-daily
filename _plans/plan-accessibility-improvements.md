# Plan: Accessibility Improvements

## Problem / Motivation

The app is keyboard- and screen-reader-hostile in several places. A quick audit
of the components surfaces the following issues:

- **No semantic landmarks beyond `<main>`.** The intro, avatar list, and
  countdown are visually separate but share one region.
- **Avatar list uses `<ul>` with non-list `<li>` content** but the parent in
  `App.svelte` does not label it. Screen readers announce a bare list with no
  context.
- **The remove (X) button in `Avatar.svelte`** is implemented as a `<button>`
  with a CSS background image, no visible text, and a `aria-label="Remove
  {name}"` — the label is fine, but the button has no keyboard focus styles
  beyond the browser default and is positioned with `position: absolute`
  inside an `<li>` without a focus-visible outline.
- **The "Add new avatar" form in `NewAvatar.svelte`** has an `<input>` with no
  `<label>` (only a sibling `<span>`), no `id`/`for` association, no
  `name`/`autocomplete`, and the submit button is `type="button"` by default
  but inside a `<form>` it will submit on Enter — confusing for assistive tech.
  The form also has no `aria-live` feedback when an avatar is added.
- **`Counter.svelte`** updates a number every second with no `aria-live`
  region, so screen-reader users do not hear the countdown. It also has no
  `role="timer"`.
- **The avatar reveal panel** (`GroupAvatar.svelte:122-134`) appears
  silently — no `aria-live="polite"` announcement of "Selected: {name}".
- **Focus management is missing entirely.** Clicking "Start" in `App.svelte`
  hides the intro and reveals the avatar list 800ms later via `setTimeout`;
  focus stays on the (now-removed) button. Same for restart.
- **Color contrast** of `#1a1a1a` on the dark background of the selected-avatar
  panel may fail WCAG AA — needs verification.
- **Language attribute.** `index.html` likely hardcodes `lang="en"` while the
  app supports EN/ES/FR via `svelte-i18n`. The `<html lang>` should follow the
  active locale.
- **Reduced motion.** `App.svelte` uses `fade` transitions unconditionally;
  users with `prefers-reduced-motion: reduce` get the same animation.

## Proposed Solution

Address each item in priority order. Items 1-5 are the highest impact and
should land first; the rest are polish.

### Step 1 — Form labeling and live regions

`NewAvatar.svelte`:

- Replace `<span>{$_("page_add_new_avatar")}</span>` with a real `<label
  for="new-avatar-name">`. Add `id="new-avatar-name"` to the input.
- Add `name="name"`, `autocomplete="off"`, `required`, and a `maxlength` to the
  input.
- Set `<button type="submit">` and move `handleNew` to `on:submit` on the form.
- Add `<p aria-live="polite" class="sr-only">{announcement}</p>` and set its
  text to `"Added {name}"` after a successful add.

### Step 2 — Counter live region and timer role

`Counter.svelte`:

- Wrap the count in a `<div role="timer" aria-live="assertive"
  aria-atomic="true">` so each tick is announced. Use `aria-label` on the
  outer element to provide context: "Countdown to picking a person".
- Respect `prefers-reduced-motion` by removing the `transition` on the span
  border when the user opts out (media query in CSS is enough).

### Step 3 — Selected-avatar announcement and focus

`GroupAvatar.svelte`:

- Wrap the "selected" panel in `<section aria-live="polite"
  aria-labelledby="selected-heading">` and give the existing `<h3>` that id.
- After a person is picked, programmatically move focus to the section's
  heading so keyboard users land on the result. Use `tabindex="-1"` on the
  heading and a `bind:this` ref + `.focus()` inside `$effect` (post-rune
  migration) or `tick().then(...)` today.

### Step 4 — Avatar removal usability

`Avatar.svelte`:

- Replace the PNG-from-the-internet close icon (`pngkey.com`) with an inline
  SVG or a CSS `mask` so it survives offline use and inherits color. The
  current external image is also a privacy/availability issue — see
  plan-ux-enhancements for offline avatar handling.
- Add a visible `:focus-visible` outline with sufficient contrast (e.g.
  `outline: 2px solid #fff; outline-offset: 2px`).
- Add `title="Remove {name}"` for sighted mouse users.
- Wrap each `<li>` in `aria-label` or use `<figure>`/`<figcaption>` so the
  name is associated with the image semantically (instead of just an `alt`).

### Step 5 — Focus management on view transitions

`App.svelte`:

- After clicking the intro start button, focus the heading of the avatar list
  once it mounts. Use a `bind:this` to `<GroupAvatar>` and expose a
  `focusEntry()` method, or move the heading into `App.svelte`.
- After clicking restart in `GroupAvatar.svelte`, focus the first avatar's
  remove button (or the heading).

### Step 6 — Document language sync with i18n

In `src/i18n.js` (or wherever the locale resolves), add an `$effect` /
`onMount` that runs `document.documentElement.lang = $locale` so screen readers
switch pronunciation when locale changes.

### Step 7 — Reduced motion

In `App.svelte`, gate the `fade` transition:

```svelte
{#if showIntro}
  <div out:fade={{ duration: prefersReducedMotion ? 0 : 500 }}>...</div>
{/if}
```

Where `prefersReducedMotion` reads
`window.matchMedia('(prefers-reduced-motion: reduce)').matches` once on mount.

### Step 8 — Color contrast pass

Run the page through Chrome DevTools' "Issues" tab or axe DevTools. Adjust
text colors on `#1a1a1a` backgrounds to meet WCAG AA (4.5:1 for normal text).

### Step 9 — Add a small `.sr-only` utility

Add to a global stylesheet (or `App.svelte` `:global`):

```css
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0);
  white-space: nowrap; border: 0;
}
```

### Step 10 — Verify

- Run axe DevTools or Lighthouse "Accessibility" audit, target ≥95.
- Manual keyboard pass: Tab through every control, confirm visible focus, confirm
  Enter and Space activate buttons, confirm Escape does nothing destructive.
- Manual screen reader pass with VoiceOver: announce countdown each second,
  announce the selected name when picked, announce "Added {name}" after submit.

## Files Affected

- `src/App.svelte`
- `src/i18n.js`
- `src/components/GroupAvatar.svelte`
- `src/components/Counter.svelte`
- `src/components/Avatar.svelte`
- `src/components/NewAvatar.svelte`
- `index.html` (lang attribute baseline + viewport check)
- `locales/en.json`, `locales/es.json`, `locales/fr.json` — new keys for
  `aria_label_remove`, `aria_label_countdown`, `aria_label_added` etc.
- A new `src/styles/a11y.css` (or inline in `App.svelte`) for `.sr-only` and
  reduced-motion media queries.

## Effort Estimate

**M** — many small, surgical changes across every component, plus i18n keys for
three locales and a verification pass. Plan ~1 day.

## Acceptance Criteria

- Lighthouse Accessibility score ≥95 on the local build.
- Every `<input>` has an associated `<label>`; `axe` reports no
  `label`/`aria-required-parent`/`color-contrast` violations.
- Countdown ticks are announced by VoiceOver / NVDA (verified manually).
- The selected-avatar panel triggers a polite live-region announcement.
- All interactive elements have a visible `:focus-visible` outline.
- After clicking "Start" or "Again", keyboard focus moves to a sensible new
  element rather than disappearing into the body.
- `prefers-reduced-motion: reduce` disables the intro fade.
- `<html lang>` updates when the i18n locale changes.
- Translation keys for new ARIA strings exist in EN/ES/FR.
