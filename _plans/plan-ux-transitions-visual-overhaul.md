# Plan: UX Overhaul — Transitions & Visual Attraction

## Context

Potato Daily is a Svelte 5 standup picker with a playful potato mascot. The current UI is the unmodified Vite dark starter kit (Inter font, #646cff blue, flat #242424 background, only a 500ms fade transition). The goal is to make every interaction feel theatrical and fun — like a game-show raffle — with animated reveals, warm colors, and micro-interactions throughout.

**Aesthetic direction:** Warm game-show energy. Deep espresso background, amber/caramel accent, Fraunces serif display font + DM Sans body. Atmospheric grain overlay. Everything animate-in, nothing appears abruptly.

---

## Files to Modify

| File | What changes |
|------|-------------|
| `index.html` | Add Google Fonts preconnect + stylesheet link |
| `src/app.css` | Full token system + global styles + background atmosphere |
| `src/App.svelte` | Logo bob, staggered intro reveal |
| `src/components/GroupAvatar.svelte` | Winner card glow, confetti burst, dimmed avatars, fly transition |
| `src/components/Avatar.svelte` | Enter/exit scale transitions, hover lift, `dimmed` prop |
| `src/components/Counter.svelte` | Dramatic pulsing number, keyed re-render |
| `src/components/NewAvatar.svelte` | Themed input/card, shake-on-error animation |

---

## Step-by-Step Implementation

### 1. `index.html` — Google Fonts

Add after the `<meta name="keywords">` line:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;1,9..144,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
```

### 2. `src/app.css` — Full replacement

Replace entire file with token-based system:

**:root tokens:**
```css
--color-bg:           #1C1109;
--color-surface:      #2A1A0A;
--color-surface-alt:  #3A2412;
--color-text:         #F5ECD7;
--color-text-muted:   rgba(245, 236, 215, 0.55);
--color-accent:       #F5A623;
--color-accent-hover: #D4762A;
--color-accent-glow:  rgba(245, 166, 35, 0.35);
--color-danger:       #FF6B6B;
--color-winner-glow:  rgba(245, 166, 35, 0.6);
--font-display: 'Fraunces', Georgia, serif;
--font-body:    'DM Sans', system-ui, Arial, sans-serif;
--radius-sm: 6px; --radius-md: 12px; --radius-lg: 20px; --radius-pill: 100px;
--transition-fast: 0.12s ease; --transition-base: 0.22s ease;
--transition-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--shadow-glow:   0 0 20px var(--color-accent-glow);
--shadow-winner: 0 0 0 3px var(--color-accent), 0 0 32px var(--color-winner-glow);
```

**Atmospheric background** — two pseudo-elements on `body`:
- `body::before`: two radial-gradient warm glows (amber at top, lighter at bottom-right)
- `body::after`: SVG feTurbulence grain at `opacity: 0.035`, tiled 200×200px

```css
body::before {
  content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%,  rgba(212,118,42,0.12) 0%, transparent 70%),
    radial-gradient(ellipse 60% 40% at 80% 100%, rgba(245,166,35,0.07) 0%, transparent 60%);
}
body::after {
  content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
}
```

**Button redesign** — pill shape, amber fill, hover scale + glow, active scale-down:
```css
button {
  font-family: var(--font-body); font-weight: 600; color: var(--color-bg);
  background-color: var(--color-accent); border: none;
  border-radius: var(--radius-pill); padding: 0.65em 1.8em; cursor: pointer;
  transition: filter var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
}
button:hover  { filter: brightness(1.1); transform: scale(1.02); box-shadow: var(--shadow-glow); }
button:active { transform: scale(0.98); }
```

**Reduced motion blanket override:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

Keep `#app { position: relative; z-index: 1; }` so it renders above the atmosphere layers.
Remove `color-scheme: light dark` and `button.start` — the amber button is the universal primary style.

### 3. `src/App.svelte` — Logo bob + staggered reveal

Add `class="intro-stage"` to `<main>`. Add `class="logo"` stays but add the bob animation.
Add `class="stagger-N"` (1–5) to: `<h1>`, each `<p>`, and a wrapper `<div>` around the button.

**Style block additions:**
```css
.logo { height: 130px; animation: logo-bob 3.2s ease-in-out infinite; }
@keyframes logo-bob {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}

.stagger-1, .stagger-2, .stagger-3, .stagger-4, .stagger-5 {
  animation: stagger-in 0.55s var(--transition-spring) both;
}
.stagger-1 { animation-delay: 0.05s; }
.stagger-2 { animation-delay: 0.18s; }
.stagger-3 { animation-delay: 0.30s; }
.stagger-4 { animation-delay: 0.42s; }
.stagger-5 { animation-delay: 0.54s; }

@keyframes stagger-in {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

The `h1` is outside `{#if showIntro}` so `.stagger-1` fires once on mount and settles permanently. The paragraphs and button are inside the intro block — they animate in once and fade out together via `out:fade`.

### 4. `src/components/Counter.svelte` — Dramatic pulse

Replace visible content with a large keyed number. The `{#key}` block forces Svelte to destroy/recreate the `<span>` on each count change, retriggering the CSS animation.

```svelte
<div class="counter-wrapper" role="timer" aria-live="assertive" aria-atomic="true"
     aria-label="Picking in {appState.count}">
  {#key appState.count}
    <span class="number">{appState.count}</span>
  {/key}
</div>
```

```css
.number {
  font-family: var(--font-display); font-size: 5em; font-weight: 700;
  color: var(--color-accent); text-shadow: 0 0 40px var(--color-accent-glow);
  animation: counter-pulse 0.45s var(--transition-spring) both;
}
@keyframes counter-pulse {
  0%   { transform: scale(1.25); opacity: 0.7; }
  60%  { transform: scale(0.95); }
  100% { transform: scale(1.0);  opacity: 1; }
}
```

Remove the `.label` paragraph (redundant now that `aria-label` on the wrapper covers screen readers).

### 5. `src/components/Avatar.svelte` — Enter/exit + hover lift

Add `dimmed = false` to `$props()`. Add `prefersReducedMotion` check. Import `scale` from `svelte/transition`.

Define elastic easing in `<script>`:
```js
function elasticOut(t) {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 :
    Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}
```

Apply to `<li>`:
```svelte
<li
  in:scale={{ duration: prefersReducedMotion ? 0 : 350, start: 0.5, easing: elasticOut }}
  out:scale={{ duration: prefersReducedMotion ? 0 : 200, start: 0.7 }}
  class:dimmed
>
```

Key CSS:
```css
li:hover img { transform: translateY(-4px); box-shadow: 0 8px 20px rgba(0,0,0,0.4), 0 0 16px var(--color-accent-glow); }
li.dimmed    { filter: grayscale(0.45) opacity(0.65); }
img          { transition: transform var(--transition-base), box-shadow var(--transition-base); }
span         { font-size: 0.78em; font-weight: 500; color: var(--color-text-muted); }
```

Style `.close` as a small circle with `background: var(--color-surface-alt)` and `border-radius: 50%`. Override the global pill shape with `border-radius: 50% !important`.

### 6. `src/components/GroupAvatar.svelte` — Winner card + confetti + dimmed avatars

**Script additions:**
- Import `fly` from `svelte/transition`
- Add `prefersReducedMotion` const
- Add `CONFETTI` array: 10 particles, each with `color`, `x` (horizontal travel -65 to +70px), `delay` (0–150ms), derived `rot`

**Template changes:**
- STARTED mode avatars: add `dimmed={true}` prop
- Winner div: add `in:fly={{ y: 28, duration: prefersReducedMotion ? 0 : 400 }}`
- Add confetti container inside `.selected` (before `<h3>`):

```svelte
<div class="confetti-container" aria-hidden="true">
  {#each CONFETTI as p, i}
    <div class="confetti-particle" style="--c-color:{p.color};--c-x:{p.x}px;--c-delay:{p.delay}ms;--c-rot:{(i*47)%360}deg"></div>
  {/each}
</div>
```

**Winner card CSS:**
```css
.selected {
  background: linear-gradient(135deg, var(--color-surface), var(--color-surface-alt));
  border-radius: var(--radius-lg); width: 180px; margin: auto; padding: 16px;
  box-shadow: var(--shadow-winner); overflow: hidden; position: relative;
}
.selected::after {
  content: ''; position: absolute; inset: -2px;
  border-radius: calc(var(--radius-lg) + 2px);
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-hover));
  z-index: -1; animation: winner-glow-pulse 1.8s ease-in-out infinite;
}
@keyframes winner-glow-pulse {
  0%,100% { opacity: 0.7; filter: blur(2px); }
  50%     { opacity: 1.0; filter: blur(6px); }
}
```

**Confetti CSS:**
```css
.confetti-container { position: absolute; top: 0; left: 50%; width: 0; pointer-events: none; z-index: 10; }
.confetti-particle {
  position: absolute; width: 8px; height: 8px; background: var(--c-color); border-radius: 2px;
  animation: confetti-burst 0.9s ease-out both; animation-delay: var(--c-delay);
}
.confetti-particle:nth-child(even) { border-radius: 50%; width: 6px; height: 6px; }
@keyframes confetti-burst {
  0%   { transform: translate(0,0) rotate(0deg) scale(1); opacity: 1; }
  70%  { opacity: 1; }
  100% { transform: translate(var(--c-x), -120px) rotate(var(--c-rot)) scale(0.4); opacity: 0; }
}
```

**Winner avatar glow** via `:global` selector:
```css
.winner-grid :global(img) { border: 2px solid var(--color-accent); box-shadow: 0 0 0 3px var(--color-accent-glow), var(--shadow-glow); }
```

Rename `button.start` references → remove class; global button style handles it. Cap width at `max-width: 280px`.

### 7. `src/components/NewAvatar.svelte` — Themed card + shake error

Wrap form in a styled card div (`.new-avatar-wrapper`): `background: var(--color-surface)`, `border-radius: var(--radius-lg)`, `border: 1px solid rgba(245,166,35,0.12)`.

Change `<label>` to uppercase small caps style. Lay out input + button side by side in `.input-row` (flexbox row).

**Input styling:**
```css
input {
  flex: 1; background: var(--color-bg); border: 1.5px solid rgba(245,236,215,0.12);
  border-radius: var(--radius-md); color: var(--color-text); padding: 0.65em 1em;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
input:focus { border-color: var(--color-accent); box-shadow: 0 0 0 3px var(--color-accent-glow); }
input.shake {
  animation: input-shake 0.45s ease both;
  border-color: var(--color-danger);
}
@keyframes input-shake {
  0%  { transform: translateX(0); }
  15% { transform: translateX(-6px); }
  30% { transform: translateX(6px); }
  45% { transform: translateX(-5px); }
  60% { transform: translateX(5px); }
  75% { transform: translateX(-3px); }
  100% { transform: translateX(0); }
}
```

Shake re-trigger: add `shakeError = $state(false)`. In `handleNew`, on invalid input call `triggerShake()`:
```js
function triggerShake() {
  shakeError = false;
  requestAnimationFrame(() => { shakeError = true; setTimeout(() => { shakeError = false; }, 500); });
}
```

Bind `class:shake={shakeError}` to the `<input>`.

**Add button**: secondary outlined style — `background: transparent`, `color: var(--color-accent)`, `border: 1.5px solid var(--color-accent)`, `border-radius: var(--radius-md) !important`.

---

## Implementation Order

1. `index.html` (fonts only)
2. `src/app.css` (tokens foundation)
3. `src/components/Counter.svelte`
4. `src/components/NewAvatar.svelte`
5. `src/components/Avatar.svelte`
6. `src/components/GroupAvatar.svelte`
7. `src/App.svelte`

---

## Verification

1. `deno task dev` → open `http://127.0.0.1:5173/`
2. **Intro**: logo bobs, title + paragraphs + button stagger in with spring overshoot
3. **Add person**: form card visible, input focus ring amber, duplicate → shake + error, valid → avatar scales in with elastic bounce
4. **Remove person**: avatar scales out and disappears
5. **Start game**: countdown shows large amber pulsing number (each tick re-animates via `{#key}`)
6. **Winner reveal**: card flies in from below, border glows, confetti particles burst upward and fade
7. **Remaining avatars**: desaturated while game runs
8. `deno task test` → 28/28 passing (no logic changed, tests unaffected)
9. `deno task build` → clean build
10. **Reduced motion**: toggle OS setting → all keyframe animations collapse to instant
