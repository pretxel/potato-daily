<script>
  export let name;
  export let image;
  export let editable;
  export let index;

  import { people } from "../peopleStore.js";

  function handleRemove() {
    const peppleCopy = [...$people];
    peppleCopy.splice(index, 1);
    $people = peppleCopy;
    const avatars = [...$people];
    localStorage.setItem("people", JSON.stringify(avatars));
  }
</script>

<li>
  {#if editable}
    <button
      class="close"
      type="button"
      aria-label="Remove {name}"
      on:click={handleRemove}
    ></button>
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
  }

  .close::after {
    position: absolute;
    top: 0;
    right: 0;
    content: "";
    background-image: url("https://www.pngkey.com/png/full/408-4088745_red-close-icon-png.png");
    background-size: 20px 20px;
    width: 20px;
    height: 20px;
    display: inline-block;
  }
</style>
