<script>
  import { _, isLoading } from "svelte-i18n";
  import { fade } from "svelte/transition";
  import { appState } from "./state.svelte.js";
  import GroupAvatar from "./components/GroupAvatar.svelte";

  const prefersReducedMotion = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let showIntro = $state(true);
  let showAvatars = $state(false);

  $effect(() => {
    appState.peopleToPlay = [...appState.people];
  });

  function handleClick() {
    showIntro = false;
    setTimeout(() => {
      showAvatars = true;
    }, prefersReducedMotion ? 0 : 800);
  }
</script>

<main>
  <img width="130" height="400" class="logo" src="/potato.webp" alt="Potato" />

  {#if $isLoading}
    <div class="spinner" aria-label="Loading" role="status"></div>
  {:else}
    <h1>{$_("page_title")}</h1>
    {#if showIntro}
      <div out:fade={{ duration: prefersReducedMotion ? 0 : 500 }}>
        <p>{$_("page_parraf_1")}</p>
        <p>{$_("page_parraf_2")}</p>
        <p>{$_("page_parraf_3")}</p>
        <button onclick={handleClick}>{$_("page_button_start")}</button>
      </div>
    {/if}

    {#if showAvatars}
      <div in:fade={{ duration: prefersReducedMotion ? 0 : 500 }}>
        <GroupAvatar />
      </div>
    {/if}
  {/if}
</main>

<style>
  .logo {
    height: 130px;
  }

  p {
    text-align: justify;
  }
</style>
