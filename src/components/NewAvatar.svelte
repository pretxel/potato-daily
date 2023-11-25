<script>
  import { _ } from "svelte-i18n";
  import { people } from "../peopleStore.js";

  let name = "";
  function handleNew(event) {
    event.preventDefault();
    if (name !== "") {
      $people = [
        ...$people,
        {
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + name,
          name,
        },
      ];

      const avatars = [...$people];
      localStorage.setItem("people", JSON.stringify(avatars));
      name = "";
    }
  }
</script>

<div>
  <form>
    <span>{$_("page_add_new_avatar")}</span>
    <input bind:value={name} />
    <button on:click={handleNew}>{$_("page_button_add")}</button>
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
</style>
