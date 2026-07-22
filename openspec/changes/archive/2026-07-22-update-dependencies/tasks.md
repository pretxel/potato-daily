## 1. Establish the Upgrade Baseline

- [x] 1.1 Record every direct dependency declaration and current lockfile resolution, grouped into Svelte/Vite, Vitest/jsdom/Testing Library, localization, and Deno standard-library packages.
- [x] 1.2 Run `deno fmt --check`, `deno lint`, `deno task test`, and `deno task build`; document and resolve any pre-existing failure before attributing failures to upgrades.

## 2. Normalize Dependency Declarations

- [x] 2.1 Replace the legacy standard-library mapping and add canonical `deno.json` aliases for `@std/http`, Svelte, Vite, the Svelte Vite plugin, `svelte-i18n`, Vitest, Testing Library packages, jsdom, and required package subpaths.
- [x] 2.2 Update Deno tasks, `svelte.config.js`, and `vite.config.mts` to consume the canonical aliases without inline version constraints.
- [x] 2.3 Inspect all task and configuration imports and verify that every direct external package has one authoritative version constraint in `deno.json`.

## 3. Upgrade Direct Dependencies

- [x] 3.1 Determine the newest stable releases compatible with the supported Deno 2 runtime, verify package peer requirements, and document any dependency that cannot use its newest stable release.
- [x] 3.2 Upgrade the Svelte, Vite, and Svelte Vite plugin compatibility group; apply only required configuration or source compatibility fixes and rerun the build and relevant tests.
- [x] 3.3 Upgrade the Vitest, jsdom, and Testing Library compatibility group; apply only required test/configuration compatibility fixes and rerun the full automated test suite.
- [x] 3.4 Upgrade `svelte-i18n` and the JSR standard-library dependency, then verify localization and the production file-server entry point still resolve.

## 4. Regenerate and Audit the Lockfile

- [x] 4.1 Use Deno dependency commands to regenerate `deno.lock` from the normalized direct declarations without hand-editing lockfile entries.
- [x] 4.2 Review direct resolutions and duplicate package families, removing obsolete resolutions by correcting declarations where necessary.
- [x] 4.3 Run a frozen-lockfile dependency resolution check and verify that it succeeds without changing `deno.json` or `deno.lock`.

## 5. Validate the Upgraded Application

- [x] 5.1 Run `deno fmt --check`, `deno lint`, `deno task test`, and `deno task build` successfully against the final dependency graph.
- [x] 5.2 Run the dependency freshness check and confirm that no newer supported stable direct dependency or peer incompatibility remains.
- [x] 5.3 Smoke-test startup, EN/ES/FR localization, adding and removing participants, countdown, winner selection, and production serving with no new runtime or browser-console errors.
- [x] 5.4 Review all non-manifest changes and confirm each is a minimal compatibility adjustment tied to an upgraded dependency.
