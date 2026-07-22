# Dependency Upgrade Implementation Record

## Baseline

- Captured: 2026-07-22
- Runtime: Deno 2.7.13
- Lockfile format: version 5

| Group | Direct package | Declared constraint | Resolved version | Declaration source |
| --- | --- | --- | --- | --- |
| Svelte/Vite | `svelte` | `^5` | 5.55.5 | `vite.config.mts` |
| Svelte/Vite | `vite` | `^5` plus an unversioned task specifier | 5.4.21 | `vite.config.mts`, `deno.json` tasks |
| Svelte/Vite | `@sveltejs/vite-plugin-svelte` | `^4` | 4.0.4 | `svelte.config.js`, `vite.config.mts` |
| Testing | `vitest` | `^2.1.0` | 2.1.9 | `deno.json` imports and task |
| Testing | `jsdom` | `^25` | 25.0.1 | `deno.json` |
| Testing | `@testing-library/svelte` | `^5.2.0` | 5.3.1 | `deno.json`, `vite.config.mts` |
| Testing | `@testing-library/jest-dom` | `^6.5.0` | 6.9.1 | `deno.json` |
| Localization | `svelte-i18n` | `^4.0.0` | 4.0.1 | `vite.config.mts` |
| Deno standard library | `@std/http` | legacy import-map alias plus floating JSR task specifier | not locked | `deno.json` |

The baseline has multiple version sources for Vite, Vitest, the Svelte plugin,
and Testing Library. Only dependencies already declared in the import map are
fully reported by `deno outdated`.

## Declaration Normalization

All direct packages and required subpaths now have canonical aliases in
`deno.json`. Deno tasks, `svelte.config.js`, and `vite.config.mts` use bare
aliases, and a repository scan found no remaining inline `npm:` or `jsr:`
specifier outside the manifest and lockfile. `vite.config.mts` now imports
`defineConfig` from `vitest/config` so its `test` block type-checks.

## Baseline Validation

All pre-upgrade checks passed on 2026-07-22:

- `deno fmt --check`: 14 files checked
- `deno lint`: 8 files checked
- `deno task test`: 3 files and 28 tests passed with Vitest 2.1.9
- `deno task build`: production build completed with Vite 5.4.21

## Selected Upgrade Versions

Registry metadata captured on 2026-07-22 selected these current stable releases:

| Group | Direct package | Selected version | Compatibility evidence |
| --- | --- | --- | --- |
| Svelte/Vite | `svelte` | 5.56.7 | Satisfies the plugin's `^5.46.4` peer range |
| Svelte/Vite | `vite` | 8.1.5 | Satisfies plugin 7.2 and Vitest 4.1 peer ranges |
| Svelte/Vite | `@sveltejs/vite-plugin-svelte` | 7.2.0 | Supports Svelte 5 and Vite 8 |
| Testing | `vitest` | 4.1.10 | Supports Vite 6 through 8 and jsdom |
| Testing | `jsdom` | 29.1.1 | Current stable DOM environment |
| Testing | `@testing-library/svelte` | 5.4.2 | Supports Svelte 3 through 5, Vite, and Vitest |
| Testing | `@testing-library/jest-dom` | 7.0.0 | Its DOM peer is satisfied by Testing Library's resolved graph |
| Localization | `svelte-i18n` | 4.0.1 | Supports Svelte 3 through 5 |
| Deno standard library | `@std/http` | 1.1.2 | Current stable JSR release |

Deno 2.7.13 exposes Node compatibility version 24.2.0, satisfying the strictest
declared Node engine ranges (Vite 8, the Svelte plugin, jsdom 29, and jest-dom
7). No package required an exception from its current stable release.

### Compatibility finding

After upgrading Svelte/Vite first, Vitest 2 reproducibly started its internal
Vite 5 server while loading the Vite-8-only Svelte plugin 7 and failed during
server configuration. Updating the two Vitest aliases together to 4.1.10 made
the runner resolve the compatible Vite generation; all 28 tests passed without
application or test-code changes.

## Lockfile Audit

`deno install --reload --lockfile-only` regenerated the dependency graph. The
lockfile contains one direct resolution for each dependency family at the
selected versions. Obsolete Vite 5, Vitest 2, jsdom 25, Svelte plugin 4, and
jest-dom 6 direct resolutions are absent.

`deno install --frozen --lockfile-only` completed successfully, and SHA-256
checksums confirmed that neither `deno.json` nor `deno.lock` changed.

## Final Validation

- `deno fmt --check`: 14 files checked successfully
- `deno lint`: 8 files checked successfully
- `deno task test`: 3 files and 28 tests passed with Vitest 4.1.10
- `deno task build`: 146 modules built successfully with Vite 8.1.5
- `deno outdated --latest`: no outdated direct dependency reported
- Production serving: `deno task serve` returned the built application over HTTP
- Browser smoke: EN, ES, and FR start labels rendered correctly; adding,
  removing, and re-adding Alice/Bob worked; two countdowns selected both
  winners; restart returned to edit mode; no runtime or console error was
  captured

Final scope review found no application-source or test-code changes. Outside the
manifest and generated lockfile, `svelte.config.js` only switches to the
canonical plugin alias, and `vite.config.mts` only switches to canonical aliases
plus the correctly typed `vitest/config` helper for its existing test block.
