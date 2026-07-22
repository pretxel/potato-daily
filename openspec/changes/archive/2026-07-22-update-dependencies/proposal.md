## Why

The project currently resolves an aging mix of direct npm packages and a legacy
standard-library URL mapping, including build and test dependencies that are
several major releases behind. Updating and normalizing these declarations now
reduces security and compatibility risk while keeping future maintenance
predictable under Deno.

## What Changes

- Update all direct runtime, build, localization, and test dependencies to
  current stable versions that work together on the supported Deno 2 runtime.
- Replace the legacy standard-library URL mapping with the corresponding JSR
  package declaration.
- Consolidate direct dependency declarations in `deno.json` so tasks and config
  files consume consistent aliases instead of independently versioned inline
  specifiers.
- Regenerate `deno.lock` from the normalized declarations and remove obsolete
  resolutions.
- Adapt configuration or application/test code only where required by upstream
  breaking changes, while preserving existing user-visible behavior.
- Verify formatting, linting, tests, production build, and dependency freshness.

## Capabilities

### New Capabilities

- `dependency-management`: Defines how direct dependencies are declared,
  upgraded, locked, and validated for this Deno application.

### Modified Capabilities

None.

## Impact

Primary changes affect `deno.json`, `deno.lock`, `svelte.config.js`, and
`vite.config.mts`. Tests or source files may receive compatibility-only edits if
required by new Svelte, Vite, Vitest, jsdom, Testing Library, or localization
releases. The application API and user-facing behavior are not intended to
change.
