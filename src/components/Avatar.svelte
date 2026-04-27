<script>
  import { scale } from "svelte/transition";
  import { appState } from "../state.svelte.js";

  let { name, image, editable, index, dimmed = false } = $props();

  const prefersReducedMotion = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function elasticOut(t) {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) *
        Math.sin((t * 10 - 0.75) * c4) + 1;
  }

  function handleRemove() {
    const copy = [...appState.people];
    copy.splice(index, 1);
    appState.people = copy;
  }
</script>

<li
  in:scale={{
    duration: prefersReducedMotion ? 0 : 350,
    start: 0.5,
    opacity: 0,
    easing: elasticOut,
  }}
  out:scale={{
    duration: prefersReducedMotion ? 0 : 200,
    start: 0.7,
    opacity: 0,
  }}
  class:dimmed
>
  {#if editable}
    <button
      class="close"
      type="button"
      aria-label="Remove {name}"
      title="Remove {name}"
      onclick={handleRemove}
    >
      <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false">
        <line x1="1" y1="1" x2="9" y2="9" />
        <line x1="9" y1="1" x2="1" y2="9" />
      </svg>
    </button>
  {/if}
  <img src={image} alt={name} />
  <span>{name}</span>
</li>

<style>
  li {
    list-style-type: none;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    cursor: default;
    transition:
      transform var(--transition-base),
      filter var(--transition-base);
  }

  li.dimmed {
    filter: grayscale(0.45) opacity(0.65);
  }

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid transparent;
    display: block;
    transition:
      transform var(--transition-base),
      box-shadow var(--transition-base),
      border-color var(--transition-base);
  }

  li:hover img {
    transform: translateY(-4px);
    box-shadow:
      0 8px 20px rgba(0, 0, 0, 0.4),
      0 0 16px var(--color-accent-glow);
  }

  span {
    font-family: var(--font-body);
    font-size: 0.78em;
    font-weight: 500;
    color: var(--color-text-muted);
    max-width: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .close {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 22px;
    height: 22px;
    padding: 0;
    margin: 0;
    background: var(--color-surface-alt);
    border: 1.5px solid rgba(245, 236, 215, 0.2);
    border-radius: 50% !important;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition:
      background var(--transition-fast),
      transform var(--transition-fast);
  }

  .close:hover {
    background: rgba(255, 107, 107, 0.2);
    transform: scale(1.15) !important;
    box-shadow: none !important;
    filter: none !important;
  }

  .close svg {
    width: 10px;
    height: 10px;
    stroke: var(--color-danger);
    stroke-width: 2;
    stroke-linecap: round;
  }

  .close:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
</style>
