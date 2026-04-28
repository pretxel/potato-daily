<script>
  import { _ } from "svelte-i18n";
  import { fly } from "svelte/transition";
  import { appState } from "../state.svelte.js";
  import Counter from "./Counter.svelte";
  import Avatar from "./Avatar.svelte";
  import NewAvatar from "./NewAvatar.svelte";

  const MODES = { edit: "EDIT", started: "STARTED", finished: "FINISHED" };
  const DEFAULT_COUNTER = 3;

  const prefersReducedMotion = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let mode = $state(MODES.edit);
  const editable = $derived(mode === MODES.edit);
  const labelStart = $derived(
    mode === MODES.started ? $_("page_button_next") : $_("page_button_start"),
  );

  const CONFETTI = [
    { color: "#F5A623", x: -45, delay: 0 },
    { color: "#D4762A", x: 25, delay: 60 },
    { color: "#F5ECD7", x: -15, delay: 120 },
    { color: "#FF6B6B", x: 55, delay: 40 },
    { color: "#F5A623", x: -65, delay: 90 },
    { color: "#FFD700", x: 10, delay: 30 },
    { color: "#D4762A", x: -30, delay: 150 },
    { color: "#F5ECD7", x: 70, delay: 75 },
    { color: "#FF6B6B", x: -50, delay: 110 },
    { color: "#F5A623", x: 40, delay: 20 },
  ];

  function choosePerson() {
    const peopleT = [...appState.peopleToPlay];
    const selectedIndex = Math.floor(Math.random() * peopleT.length);
    appState.avatarSelected = peopleT.splice(selectedIndex, 1)[0];
    appState.peopleToPlay = peopleT;
    if (peopleT.length === 0) {
      mode = MODES.finished;
    }
  }

  function initToPlay() {
    mode = MODES.edit;
    appState.avatarSelected = {};
    appState.peopleToPlay = [...appState.people];
  }

  function handleStart(event) {
    event.preventDefault();
    mode = MODES.started;
    appState.count = DEFAULT_COUNTER;
    appState.startingCounter = true;
  }

  function handleRestart(event) {
    event.preventDefault();
    initToPlay();
  }

  function handleCounterDone() {
    appState.startingCounter = false;
    choosePerson();
  }

  initToPlay();
</script>

{#if mode === MODES.edit}
  <ul class="avatar-grid">
    {#each appState.people as item, index}
      <Avatar name={item.name} image={item.image} {editable} {index} />
    {/each}
  </ul>
{/if}

{#if mode === MODES.started}
  <ul class="avatar-grid">
    {#each appState.peopleToPlay as item, index}
      <Avatar
        name={item.name}
        image={item.image}
        {editable}
        {index}
        dimmed={true}
      />
    {/each}
  </ul>
{/if}

{#if mode === MODES.edit && appState.people.length === 0}
  <p class="empty-state">{$_("page_empty_state")}</p>
{/if}

{#if editable}
  <NewAvatar />
{/if}

{#if appState.startingCounter}
  <Counter onDone={handleCounterDone} />
{/if}

{#if !appState.startingCounter && appState.avatarSelected.name}
  <div
    class="selected"
    aria-live="polite"
    in:fly={{ y: 28, duration: prefersReducedMotion ? 0 : 400, opacity: 0 }}
  >
    <div class="confetti-container" aria-hidden="true">
      {#each CONFETTI as p, i}
        <div
          class="confetti-particle"
          style="--c-color:{p.color};--c-x:{p.x}px;--c-delay:{p.delay}ms;--c-rot:{(i *
          47) % 360}deg"
        ></div>
      {/each}
    </div>

    <h3>{$_("page_avatar_selected")}</h3>
    <ul class="winner-grid">
      <Avatar
        name={appState.avatarSelected.name}
        image={appState.avatarSelected.image}
        editable={false}
        index={0}
      />
    </ul>
  </div>
{/if}

{#if (mode === MODES.started || mode === MODES.edit) &&
  appState.people.length > 0}
  <button class="action-btn" onclick={handleStart}>{labelStart}</button>
{/if}

{#if mode === MODES.finished}
  <button class="action-btn" onclick={handleRestart}>
    {$_("page_button_again")}
  </button>
{/if}

<style>
  .avatar-grid {
    display: flex;
    justify-content: center;
    gap: clamp(12px, 4vw, 24px);
    flex-basis: auto;
    padding: 0;
    margin: var(--space-lg) 0;
    flex-wrap: wrap;
    list-style: none;
  }

  .selected {
    position: relative;
    background: linear-gradient(
      135deg,
      var(--color-surface) 0%,
      var(--color-surface-alt) 100%
    );
    border-radius: var(--radius-lg);
    width: min(180px, 100%);
    margin: var(--space-lg) auto;
    padding: var(--space-md) var(--space-md) var(--space-lg);
    box-shadow: var(--shadow-winner);
    overflow: visible;
  }

  .selected::after {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: calc(var(--radius-lg) + 2px);
    background: linear-gradient(
      135deg,
      var(--color-accent),
      var(--color-accent-hover)
    );
    z-index: -1;
    animation: winner-glow-pulse 1.8s ease-in-out infinite;
  }

  @keyframes winner-glow-pulse {
    0%,
    100% {
      opacity: 0.7;
      filter: blur(2px);
    }
    50% {
      opacity: 1;
      filter: blur(6px);
    }
  }

  .selected h3 {
    margin: 0 0 var(--space-md);
    padding-top: var(--space-sm);
    font-style: italic;
    letter-spacing: 0.04em;
  }

  .winner-grid {
    display: flex;
    justify-content: center;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .winner-grid :global(img) {
    border: 2px solid var(--color-accent);
    box-shadow:
      0 0 0 3px var(--color-accent-glow),
      var(--shadow-glow);
    width: clamp(80px, 22vw, 90px);
    height: clamp(80px, 22vw, 90px);
  }

  .confetti-container {
    position: absolute;
    top: 0;
    left: 50%;
    width: 0;
    height: 0;
    pointer-events: none;
    z-index: 10;
  }

  .confetti-particle {
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: var(--c-color);
    border-radius: 2px;
    top: 0;
    left: 0;
    transform-origin: center bottom;
    animation: confetti-burst 0.9s ease-out both;
    animation-delay: var(--c-delay);
  }

  .confetti-particle:nth-child(even) {
    border-radius: 50%;
    width: 6px;
    height: 6px;
  }

  @keyframes confetti-burst {
    0% {
      transform: translate(0, 0) rotate(0deg) scale(1);
      opacity: 1;
    }
    70% {
      opacity: 1;
    }
    100% {
      transform: translate(var(--c-x), -120px) rotate(var(--c-rot)) scale(0.4);
      opacity: 0;
    }
  }

  .action-btn {
    margin-top: var(--space-lg);
    width: 100%;
    max-width: 280px;
    padding: 0.8em 2em;
    font-size: 1.05em;
  }

  .empty-state {
    color: var(--color-text-muted);
    margin: var(--space-xl) 0 var(--space-lg);
    font-style: italic;
  }
</style>
