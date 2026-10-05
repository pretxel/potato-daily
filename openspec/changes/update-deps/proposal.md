## Why

The project's direct dependencies have drifted from their latest stable releases. Updating them ensures access to bug fixes, performance improvements, and continued compatibility with Deno 2.

## What Changes

- Update all npm-based dependencies declared in `deno.json` to their latest stable versions compatible with Deno 2
- Update the JSR `@std/http` dependency to the latest compatible release
- Regenerate `deno.lock` to reflect the updated resolution graph
- Apply any necessary API compatibility adjustments in source or test code

## Capabilities

### New Capabilities
<!-- No new capabilities introduced — this is a maintenance change. -->

### Modified Capabilities
- `dependency-management`: Updated direct dependency version constraints to latest stable releases; lockfile regenerated to match

## Impact

- `deno.json` — version constraint bumps for all direct dependencies
- `deno.lock` — regenerated to reflect updated resolution graph
- Source and test files — minor compatibility edits if any upgraded package introduces breaking API changes
- CI — artifact build verification remains unchanged
