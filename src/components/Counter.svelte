<script>
  import { _ } from "svelte-i18n";
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

<div role="timer" aria-live="assertive" aria-atomic="true">
  <p class="label">
    {$_("page_counter_picking_in", { values: { count: appState.count } })}
  </p>
  <span>
    {appState.count}
  </span>
</div>

<style>
  div {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .label {
    margin: 0 0 0.4em 0;
    font-size: 0.95em;
    opacity: 0.8;
  }
  span {
    padding: 0.5em 1.2em;
    margin-top: 20px;
    font-size: 1.5em;
    font-weight: 500;
    font-family: inherit;
    background-color: transparent;
  }
</style>
