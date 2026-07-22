# Dependency Management Specification

## Purpose

Define how the project declares, resolves, upgrades, and validates dependencies
while preserving deterministic builds and existing application behavior.

## Requirements

### Requirement: Canonical direct dependency declarations
The project SHALL declare every direct runtime, build, localization, test, and
Deno standard-library dependency in `deno.json`, with one authoritative version
constraint for each package family. Tasks and configuration modules MUST consume
those declarations without introducing independent inline version constraints.

#### Scenario: Dependency inventory is centralized
- **WHEN** the dependency declarations, Deno tasks, and configuration imports are inspected
- **THEN** every directly used external package resolves through a `deno.json` alias and no task or configuration module declares a competing version

#### Scenario: Deno standard library uses JSR
- **WHEN** the file-server dependency is resolved
- **THEN** it resolves through a versioned JSR standard-library declaration and no legacy standard-library URL mapping remains

### Requirement: Stable and compatible direct dependencies
The project SHALL resolve each direct dependency to the newest stable release
available at implementation time that is mutually compatible with the other
direct packages and the supported Deno 2 runtime. If the newest release cannot
support that runtime or peer graph, the project MUST use and document the newest
compatible stable release instead.

#### Scenario: Latest stable versions are compatible
- **WHEN** dependency freshness and package peer requirements are checked after the upgrade
- **THEN** no newer supported stable direct dependency is reported and the resolved graph contains no direct-package peer incompatibility

#### Scenario: Latest release is incompatible
- **WHEN** a package's newest stable release does not support the project's Deno runtime or required peer graph
- **THEN** the newest compatible stable release is selected and the incompatibility is documented in the implementation record

### Requirement: Deterministic dependency resolution
The project SHALL maintain a Deno-generated `deno.lock` synchronized with the
canonical declarations and SHALL NOT rely on manually edited lockfile
resolutions.

#### Scenario: Frozen resolution succeeds
- **WHEN** dependencies are installed or checked with frozen lockfile enforcement
- **THEN** resolution succeeds without changing `deno.json` or `deno.lock`

#### Scenario: Lockfile contains the upgraded graph
- **WHEN** the regenerated lockfile is reviewed
- **THEN** direct resolutions match the declared constraints and obsolete direct resolutions from superseded versions are absent

### Requirement: Dependency upgrades preserve application behavior
The upgraded project MUST pass formatting, linting, automated tests, and the
production build, and SHALL preserve the existing startup, localization,
participant management, countdown, and winner-selection behavior.

#### Scenario: Automated quality gates pass
- **WHEN** the full repository validation suite is run against the upgraded dependency graph
- **THEN** formatting checks, linting, automated tests, and the production build all complete successfully

#### Scenario: Core workflow remains functional
- **WHEN** a user starts the application, changes locale, adds and removes participants, runs the countdown, and selects a winner
- **THEN** each workflow behaves as before the dependency upgrade without new runtime or browser-console errors

### Requirement: Compatibility edits remain scoped
The implementation SHALL limit source, test, and tool-configuration changes to
adjustments required by upgraded dependency APIs or configuration contracts.

#### Scenario: Compatibility change is introduced
- **WHEN** an upgraded dependency breaks an existing check or uses a documented replacement API
- **THEN** the smallest compatible adjustment is applied and covered by the relevant validation check
