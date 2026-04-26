# Plan: Add Testing Setup (Vitest + @testing-library/svelte)

## Problem / Motivation

The repository has zero automated tests. There is no `tests/` directory, no
test runner in `deno.json` tasks, and CI (`.github/workflows/deploy.yml`) only
runs `deno task build`. Several pieces of logic are easy to break silently:

- `peopleStore.js` hydrates from `localStorage` at module import — a parse
  failure or schema change crashes the whole app on load.
- `GroupAvatar.svelte:30` computes the random index with
  `Math.round(Math.random() * (totalPeople - 0) + 0)`, which is biased toward
  the endpoints (the standard mistake — `Math.floor` is correct). A test that
  pins `Math.random` would catch this.
- The mode transitions (`EDIT` → `STARTED` → `FINISHED` and back) live in
  `GroupAvatar.svelte` and have no regression coverage.
- Adding/removing avatars rewrites `localStorage` from two different files
  (`Avatar.svelte`, `NewAvatar.svelte`); a test would lock in the contract.

We need a low-friction test stack that fits the Deno-first toolchain.

## Proposed Solution

Use **Vitest** as the runner (it integrates with Vite, which is already the
build tool) plus **@testing-library/svelte** for component tests and
**jsdom** for the DOM. Run Vitest through Deno the same way Vite runs today
(`deno run -A --node-modules-dir npm:vitest`), so we keep the no-Node policy.

### Step 1 — Wire up Vitest

- Add `vitest.config.mts` (or extend `vite.config.mts` with a `test` block) with:
  - `environment: 'jsdom'`
  - `globals: true`
  - `setupFiles: ['./tests/setup.ts']`
  - `include: ['tests/**/*.test.{js,ts,svelte.test.js}']`
- Add tasks to `deno.json`:
  - `"test": "deno run -A --node-modules-dir npm:vitest run"`
  - `"test:watch": "deno run -A --node-modules-dir npm:vitest"`
- Pin imports: `npm:vitest@^2`, `npm:@testing-library/svelte@^5`,
  `npm:@testing-library/jest-dom@^6`, `npm:jsdom@^25`. Add a top-level
  `import` line in `vite.config.mts` so Deno populates `node_modules`, matching
  the existing pattern.

### Step 2 — Test setup file

`tests/setup.ts`:

- Import `@testing-library/jest-dom/vitest` for matchers.
- Reset `localStorage` and `vi.useRealTimers()` in `afterEach`.
- Stub `svelte-i18n` in tests by registering a tiny English locale synchronously
  so component tests do not need to wait for `isLoading`.

### Step 3 — Author the first round of tests

**Unit (`tests/state.test.js`)** — covers the persistence + reset behavior of
the store (or rune-based state, if the Svelte 5 migration has happened).
Cases: hydrates from localStorage on import, falls back to `[]` when key
missing, re-persists on add/remove.

**Logic (`tests/random.test.js`)** — extract `choosePerson`'s index calc into a
pure helper `pickRandomIndex(length, rng = Math.random)` and assert the
distribution and bounds with a stubbed RNG. This both covers the off-by-one in
`Math.round` and creates the seam needed to fix it.

**Component (`tests/GroupAvatar.test.js`)**:

- Renders empty when `people` is `[]` and hides the start button.
- Clicking start transitions to `STARTED`, runs the timer to zero (via
  `vi.useFakeTimers()`), and selects an avatar.
- After all avatars are picked, mode flips to `FINISHED` and the
  `page_button_again` button appears.
- `Restart` resets state.

**Component (`tests/NewAvatar.test.js`)**:

- Submits with empty name → no addition.
- Submits with name → adds entry with `image` URL containing the seed.

**Component (`tests/Avatar.test.js`)**:

- Renders close button only when `editable={true}`.
- Clicking close removes the row from `people` and from `localStorage`.

### Step 4 — CI integration

Add a `test` job to `.github/workflows/deploy.yml` that runs before `build`:

```yaml
- name: Test
  env:
    DENO_DIR: .deno
  run: deno task test
```

Cache `.deno/` between runs (already set via `DENO_DIR`).

### Step 5 — Coverage (optional follow-up)

Add `@vitest/coverage-v8` and a `test:coverage` task. Set a soft floor (e.g.
60%) and revisit after the suite stabilizes — do not gate CI on it from day one.

## Files Affected

- `deno.json` — add tasks, possibly extend `lint.include` to cover `tests/`.
- `vite.config.mts` — add `test` block or add `vitest.config.mts`.
- `vitest.config.mts` (new, optional)
- `tests/setup.ts` (new)
- `tests/state.test.js` (new)
- `tests/random.test.js` (new)
- `tests/GroupAvatar.test.js` (new)
- `tests/NewAvatar.test.js` (new)
- `tests/Avatar.test.js` (new)
- `.github/workflows/deploy.yml` — add test step.
- Minor source change: extract `pickRandomIndex` to a pure function in
  `src/lib/random.js` to make it testable.

## Effort Estimate

**M** — wiring Vitest under Deno's `--node-modules-dir` flow takes a couple of
hours of trial and error the first time. After that, the four component tests
are quick to write. Plan ~1 day end-to-end including CI.

## Acceptance Criteria

- `deno task test` runs and passes locally.
- At least the five test files listed above exist with assertions, not just
  scaffolding.
- A test exists that would fail on the current `Math.round`-based random index
  (proving the bug is covered before it is fixed).
- CI runs the test suite on push and fails the workflow on a red test.
- `tests/setup.ts` resets `localStorage` between tests so suites are isolated.
- README (or a new `tests/README.md`) documents how to run the suite.
