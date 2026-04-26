<script>
  import { _ } from "svelte-i18n";
  import { appState } from "../state.svelte.js";

  let name = $state("");
  let error = $state("");

  function handleNew(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed === "") {
      return;
    }
    const isDuplicate = appState.people.some(
      (p) => p.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (isDuplicate) {
      error = $_("error_duplicate_name");
      return;
    }
    appState.people = [
      ...appState.people,
      {
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
          encodeURIComponent(trimmed),
        name: trimmed,
      },
    ];
    name = "";
    error = "";
  }
</script>

<div>
  <form onsubmit={handleNew}>
    <label for="new-avatar-name">{$_("page_add_new_avatar")}</label>
    <input id="new-avatar-name" bind:value={name} />
    {#if error}
      <p class="error" role="alert">{error}</p>
    {/if}
    <button type="submit">{$_("page_button_add")}</button>
  </form>
</div>

<style>
  div {
    margin-top: 50px;
  }

  input {
    padding: 0.7em 1.2em;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .error {
    color: #ff6b6b;
    margin: 0;
    font-size: 0.9em;
  }
</style>
