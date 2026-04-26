<script>
  import { appState } from "../state.svelte.js";

  let { name, image, editable, index } = $props();

  function handleRemove() {
    const copy = [...appState.people];
    copy.splice(index, 1);
    appState.people = copy;
  }
</script>

<li>
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
  img {
    width: 80px;
    border-radius: 50%;
  }

  li {
    list-style-type: none;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .close {
    position: absolute;
    top: 0;
    right: 0;
    width: 24px;
    height: 24px;
    padding: 0;
    margin: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .close svg {
    width: 16px;
    height: 16px;
    stroke: #ff4d4f;
    stroke-width: 2;
    stroke-linecap: round;
  }

  .close:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
    border-radius: 4px;
  }
</style>
