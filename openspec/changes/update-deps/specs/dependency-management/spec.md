## MODIFIED Requirements

### Requirement: Stable and compatible direct dependencies
The project SHALL resolve each direct dependency to the newest stable release available at implementation time that is mutually compatible with the other direct packages and the supported Deno 2 runtime. If the newest release cannot support that runtime or peer graph, the project MUST use and document the newest compatible stable release instead.

#### Scenario: Latest stable versions are compatible
- **WHEN** dependency freshness and package peer requirements are checked after upgrading to `@sveltejs/vite-plugin-svelte@^7.3.1`, `svelte@^5.57.1`, `vite@^8.3.2`, `vitest@^5.0.3`, `@testing-library/jest-dom@^7.0.1`, and `@std/http@^1.1.4`, with `jsdom` held at `^29.1.1`
- **THEN** no newer supported stable direct dependency is reported other than the documented-incompatible `jsdom@30`, and the resolved graph contains no direct-package peer incompatibility

#### Scenario: Latest release is incompatible
- **WHEN** a package's newest stable release does not support the project's Deno runtime or required peer graph
- **THEN** the newest compatible stable release is selected and the incompatibility is documented in the implementation record
