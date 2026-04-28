<script>
  import { appState } from "../state.svelte.js";

  let { onDone } = $props();

  $effect(() => {
    const id = setInterval(() => {
      appState.count -= 1;
    }, 1000);
    return () => clearInterval(id);
  });

  $effect(() => {
    if (appState.count === 0) {
      onDone?.();
    }
  });
</script>

<div
  class="counter-wrapper"
  role="timer"
  aria-live="assertive"
  aria-atomic="true"
  aria-label="Picking in {appState.count}"
>
  {#key appState.count}
    <span class="number">{appState.count}</span>
  {/key}
</div>

<style>
  .counter-wrapper {
    margin: var(--space-xl) 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .number {
    font-family: var(--font-display);
    font-size: clamp(3.5em, 14vw, 5em);
    font-weight: 700;
    color: var(--color-accent);
    line-height: 1;
    display: inline-block;
    text-shadow: 0 0 40px var(--color-accent-glow);
    animation: counter-pulse 0.45s var(--transition-spring) both;
  }

  @keyframes counter-pulse {
    0% {
      transform: scale(1.25);
      opacity: 0.7;
    }
    60% {
      transform: scale(0.95);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
