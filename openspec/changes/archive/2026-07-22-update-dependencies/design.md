## Context

The application runs on Deno 2 but uses npm packages for Svelte, Vite,
localization, and browser-oriented tests. Direct dependency versions are split
between `deno.json`, task command strings, `svelte.config.js`, and
`vite.config.mts`; the resulting `deno.lock` currently resolves Vite 5, Vitest
2, jsdom 25, and related packages. The import map also retains a legacy
standard-library URL alias while the file-server task uses JSR directly.

Major upgrades can introduce coupled peer-dependency and configuration changes,
especially across Svelte/Vite and Vitest/jsdom. The migration therefore needs a
single canonical dependency inventory, coordinated upgrade groups, and a
repeatable validation sequence.

## Goals / Non-Goals

**Goals:**

- Declare every direct project dependency in `deno.json` with one authoritative
  version constraint per package family.
- Use JSR for the Deno standard library and npm specifiers for ecosystem packages
  without suitable JSR equivalents.
- Move all direct dependencies to mutually compatible current stable releases
  and regenerate a deterministic lockfile.
- Preserve application behavior while making only compatibility changes required
  by upstream releases.
- Prove the upgraded dependency graph with freshness, format, lint, test, and
  production-build checks.

**Non-Goals:**

- Upgrading the Deno runtime itself or changing the minimum supported Deno 2
  policy.
- Replacing Svelte, Vite, Vitest, jsdom, Testing Library, or `svelte-i18n` with
  different tools.
- Refactoring application features, changing UI behavior, or adding product
  capabilities unrelated to dependency compatibility.
- Pinning transitive packages independently unless necessary to resolve a
  documented incompatibility.

## Decisions

### Centralize direct package declarations in `deno.json`

`deno.json` will contain aliases for the standard-library file server and every
direct npm dependency, including any required subpath aliases. Deno tasks and
JavaScript/TypeScript config files will consume those aliases without embedding
their own version constraints. This gives `deno outdated` a complete inventory
and prevents version drift between application, build, and test entry points.

The alternative of retaining inline versioned specifiers is smaller initially,
but it leaves multiple sources of truth and can allow the lockfile to resolve
parallel versions of the same direct package.

### Prefer JSR for Deno-native packages and npm for the existing web toolchain

The standard-library dependency will use a versioned `jsr:@std/http` mapping.
Svelte, Vite, Vitest, Testing Library, jsdom, and `svelte-i18n` will remain npm
dependencies because they are npm-native ecosystem packages. This follows Deno
package-management conventions without introducing replacement libraries.

Removing the standard-library mapping and keeping only an inline task specifier
was considered, but a named import-map entry keeps all direct versions visible
and managed in one place.

### Upgrade coupled packages as compatibility groups

Implementation will first establish a passing baseline, then update the
Svelte/Vite/plugin group, the Vitest/jsdom/Testing Library group, and the
remaining independent packages. For each group, the newest stable releases
available at implementation time will be selected together and checked against
their peer requirements before moving to the next group.

A single unreviewed bulk rewrite is faster but makes peer conflicts and breaking
configuration changes harder to isolate. Restricting updates to existing semver
ranges was also rejected because it would intentionally retain obsolete major
versions called out by this change.

### Regenerate and validate the lockfile through Deno

Dependency operations will use Deno's package-management commands so
`deno.json` and `deno.lock` stay synchronized. After normalization, the lockfile
will be regenerated/resolved from the declared constraints, and a frozen-lockfile
check will prove that a clean install does not mutate it.

Hand-editing lockfile entries was rejected because it is error-prone and does
not validate the resolved dependency graph.

### Limit compatibility edits to observed upgrade breakage

Configuration, tests, or application code will change only when an upgraded
package requires it. Each edit must be tied to a failing check or documented
upstream API change, and existing user-visible behavior remains the regression
contract.

Proactive framework refactoring was considered but would expand scope and make
dependency regressions harder to distinguish from application changes.

## Risks / Trade-offs

- **Major package releases contain breaking APIs or configuration changes** →
  Upgrade compatibility groups separately and run focused checks after each
  group.
- **Peer requirements select duplicate or incompatible Svelte/Vite versions** →
  Inspect the resolved graph and lockfile, then align direct constraints before
  accepting the upgrade.
- **Newest releases require a newer runtime than the documented Deno 2 baseline**
  → Select the newest stable compatible release and document the constraint
  instead of silently changing runtime support.
- **A regenerated lockfile introduces large transitive churn** → Review direct
  resolutions and duplicate package families, and retain only churn explained by
  the declared upgrades.
- **Automated tests miss browser-only regressions** → Require a production build
  and a short manual smoke test of startup, localization, adding/removing people,
  countdown, and winner selection.

## Migration Plan

1. Record the current direct/resolved dependency inventory and run all existing
   checks as a baseline.
2. Normalize the standard-library and npm aliases in `deno.json`, updating task
   and config imports to consume them.
3. Upgrade each compatibility group to current stable mutually compatible
   releases, applying minimal compatibility fixes and rerunning checks after
   each group.
4. Regenerate `deno.lock`, inspect the resolved graph, and run the complete
   automated and manual validation suite.
5. Roll back by restoring the dependency declarations, config compatibility
   edits, and lockfile together. No persistent application data migration is
   involved.

## Open Questions

None. Exact version numbers will be resolved at implementation time so the
change targets the then-current stable compatible releases rather than versions
that may become stale while the proposal is pending.
