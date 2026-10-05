## Context

The project pins dependencies in `deno.json` with caret ranges. Several packages have newer stable releases available. The dependency graph is resolved by Deno via npm specifiers and JSR, with a `deno.lock` ensuring deterministic installs. All runtime and build behavior must remain unchanged post-upgrade.

Current versions vs latest stable:

| Package | Before | Latest | Final |
|---|---|---|---|
| `@std/http` (JSR) | ^1.1.2 | ^1.1.4 | ^1.1.4 |
| `@sveltejs/vite-plugin-svelte` | ^7.2.0 | ^7.3.1 | ^7.3.1 |
| `svelte` | ^5.56.7 | ^5.57.1 | ^5.57.1 |
| `vite` | ^8.1.5 | ^8.3.2 | ^8.3.2 |
| `vitest` (+ `vitest/config`) | ^4.1.10 | ^5.0.3 | ^5.0.3 |
| `@testing-library/jest-dom` | ^7.0.0 | ^7.0.1 | ^7.0.1 |
| `jsdom` | ^29.1.1 | ^30.1.2 | ^29.1.1 (capped, see record) |
| `svelte-i18n` | ^4.0.1 | ^4.0.1 | ^4.0.1 |
| `@testing-library/svelte` | ^5.4.2 | ^5.4.2 | ^5.4.2 |

## Goals / Non-Goals

**Goals:**
- Bump `@std/http`, `@sveltejs/vite-plugin-svelte`, `svelte`, `vite`, `vitest`, `@testing-library/jest-dom`, and `jsdom` to latest stable releases
- Regenerate lockfile so the resolved graph matches updated declarations
- Verify formatting, linting, tests, and the production build pass

**Non-Goals:**
- Adding new dependencies or removing existing ones
- Refactoring application code beyond API compatibility fixes
- Upgrading transitive-only dependencies independently
- Changing the Deno runtime version

## Decisions

### Update strategy: bump all at once
Single atomic commit upgrading all dependencies together rather than one-by-one CI rounds. Rationale: the dependency count is small, interdependencies are known (e.g., `@sveltejs/vite-plugin-svelte` peers with both `svelte` and `vite`), and a single pass catches cross-package incompatibilities early.

### jsdom 29 → 30 major bump
jsdom 30 is a major release. We bump it alongside the others and fix any test failures that surface. If 30 introduces breaking API changes that require non-trivial source edits, we may cap at the latest 29.x release instead, following the spec's fallback rule for incompatible releases.

### vitest 4 → 5 major bump
vitest 5 is a major release. Bumped alongside the others; the existing suite passes unchanged on vitest 5 with jsdom 29. The `vitest/config` import alias in `deno.json` is a separate entry that `deno update` does not move, so it is bumped by hand to keep both aliases on the same version.

### Lockfile regeneration via `deno install`
After editing `deno.json`, run `deno install` to regenerate `deno.lock` from the new version constraints. No manual lockfile edits.

## Risks / Trade-offs

- **jsdom 30 breaking changes** → Tests may fail after the bump. If fixes are non-trivial, fall back to latest 29.x and document the incompatibility.
- **vite plugin compatibility** → `@sveltejs/vite-plugin-svelte 7.3.1` must be compatible with both svelte 5.57.1 and vite 8.3.2. Verified via npm peer dependency ranges before committing.
- **`svelte-i18n` compat with svelte 5.57.1** → svelte-i18n 4.x targets svelte 3/4. It currently works with svelte 5 via compatibility layer. The 5.57.1 minor is unlikely to break this but we verify.

## Implementation Record

### jsdom 30.0.1 — incompatible with Deno 2
**Date**: 2026-08-08
**Decision**: Capped at jsdom 29.1.1

jsdom 30.0.1 pulls in undici 8.x which calls `webidl.util.markAsUncloneable()` during initialization. This function is not available in Deno's Node.js compat layer, causing all vitest forks to crash before any test runs.

```
TypeError: webidl.util.markAsUncloneable is not a function
 ❯ new CacheStorage node_modules/.deno/undici@8.10.0/node_modules/undici/lib/web/cache/cachestorage.js:20:17
 ❯ require(...) node_modules/.deno/jsdom@30.0.1/node_modules/jsdom/lib/api.js:12:33
```

Latest compatible: jsdom 29.1.1. Re-evaluate when Deno's Node.js compat layer adds `webidl.util` support.

### jsdom 30.1.2 — still incompatible
**Date**: 2026-10-06
**Decision**: Remain on jsdom 29.1.1

Re-tested with jsdom 30.1.2 (now resolving undici 8.11.2). Same failure: `TypeError: webidl.util.markAsUncloneable is not a function` from `undici/lib/web/cache/cachestorage.js`, so every vitest fork fails to start. Behavior is identical under vitest 4.1.11 and 5.0.3.

### Final verification
**Date**: 2026-10-06

`deno lint`, `deno fmt --check`, `deno task test` (3 files, 28 tests) and `deno task build` all pass on the final versions listed above.
