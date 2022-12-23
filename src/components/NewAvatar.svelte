<script>
  import { people } from "../peopleStore.js";

  let name = "";
  function handleNew(event) {
    event.preventDefault();
    if (name !== "") {
      $people = [
        ...$people,
        {
          image: "https://avatars.dicebear.com/api/male/",
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
    <span>Add new avatar</span>
    <input bind:value={name} />
    <button on:click={handleNew}>Add</button>
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
