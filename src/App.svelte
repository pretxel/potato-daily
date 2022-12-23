<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { people, peopleToPlay } from "./peopleStore.js";
  import GroupAvatar from "./components/GroupAvatar.svelte";

  let editable = true;
  let peopleValue;
  let showIntro = true;
  let showAvatars = false;

  onMount(() => {
    people.subscribe((value) => {
      peopleValue = value;
      peopleToPlay.set([...value]);
    });
  });

  function handleClick() {
    showIntro = false;
    setTimeout(() => {
      showAvatars = true;
    }, 800);
  }
</script>

<main>
  <img class="logo" src="/potato.png" alt="Potato" />

  <h1>Potato Daily</h1>

  {#if showIntro}
    <div out:fade={{ duration: 500 }}>
      <p>
        Esta es una descripción de la página donde voy a poner el objetivo y
        porque se usa.
      </p>

      <p>
        Esta es una descripción de la página donde voy a poner el objetivo y
        porque se usa.
      </p>

      <p>
        Esta es una descripción de la página donde voy a poner el objetivo y
        porque se usa.
      </p>
      <button on:click={handleClick}>Start</button>
    </div>
  {/if}

  {#if showAvatars}
    <div in:fade={{ duration: 500 }}>
      <GroupAvatar people={peopleValue} {editable} />
    </div>
  {/if}
</main>

<style>
  .logo {
    height: 130px;
  }
</style>
