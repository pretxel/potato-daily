## 1. Dependency Version Bumps

- [x] 1.1 Bump `@std/http` to `jsr:@std/http@^1.1.4` in `deno.json` imports
- [x] 1.2 Bump `@sveltejs/vite-plugin-svelte` to `npm:@sveltejs/vite-plugin-svelte@^7.3.1`
- [x] 1.3 Bump `svelte` to `npm:svelte@^5.57.1`
- [x] 1.4 Bump `vite` to `npm:vite@^8.3.2`
- [x] 1.5 Bump `jsdom` to `npm:jsdom@^30.1.2` (reverted, see 4.1)
- [x] 1.6 Bump `vitest` and `vitest/config` to `npm:vitest@^5.0.3`
- [x] 1.7 Bump `@testing-library/jest-dom` to `npm:@testing-library/jest-dom@^7.0.1`

## 2. Lockfile and Resolution

- [x] 2.1 Run `deno install` to regenerate `deno.lock` from updated version constraints
- [x] 2.2 Verify lockfile contains no stale resolutions from superseded versions

## 3. Compatibility Fixes

- [x] 3.1 Run `deno fmt` and fix any formatting issues
- [x] 3.2 Run `deno lint` and resolve any new lint violations
- [x] 3.3 Run `deno task test` and fix any test failures caused by dependency API changes
- [x] 3.4 Run `deno task build` and fix any build errors

## 4. Fallback (if jsdom 30 is incompatible)

- [x] 4.1 If jsdom 30 causes non-trivial test failures, revert to latest 29.x (`npm:jsdom@^29.1.1`) and regenerate lockfile
- [x] 4.2 Document any incompatibility in the implementation record
