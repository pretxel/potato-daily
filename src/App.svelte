<script>
  import { _, isLoading } from 'svelte-i18n'
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

  

  {#if $isLoading}
  Please wait...
  {:else}
    <h1>{$_('page_title')}</h1>
    {#if showIntro}
      <div out:fade={{ duration: 500 }}>
      
        <p>{$_('page_parraf_1')}</p>
        <p>{$_('page_parraf_2')}</p>
        <p>{$_('page_parraf_3')}</p>
        <button on:click={handleClick}>{$_('page_button_start')}</button>
      </div>
    {/if}

    {#if showAvatars}
      <div in:fade={{ duration: 500 }}>
        <GroupAvatar people={peopleValue} {editable} />
      </div>
    {/if}
  {/if}
</main>

<style>
  .logo {
    height: 130px;
  }

  p{
    text-align: justify;
  }
</style>
