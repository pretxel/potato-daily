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

<main class="intro-stage">
  <img width="130" height="400" class="logo" src="/potato.webp" alt="Potato" />

  {#if $isLoading}
    <div class="spinner" aria-label="Loading" role="status"></div>
  {:else}
    <h1 class="stagger-1">{$_("page_title")}</h1>
    {#if showIntro}
      <div out:fade={{ duration: prefersReducedMotion ? 0 : 500 }}>
        <p class="stagger-2">{$_("page_parraf_1")}</p>
        <p class="stagger-3">{$_("page_parraf_2")}</p>
        <p class="stagger-4">{$_("page_parraf_3")}</p>
        <div class="stagger-5">
          <button onclick={handleClick}>{$_("page_button_start")}</button>
        </div>
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
    animation: logo-bob 3.2s ease-in-out infinite;
  }

  @keyframes logo-bob {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  .stagger-1,
  .stagger-2,
  .stagger-3,
  .stagger-4,
  .stagger-5 {
    animation: stagger-in 0.55s var(--transition-spring) both;
  }

  .stagger-1 {
    animation-delay: 0.05s;
  }
  .stagger-2 {
    animation-delay: 0.18s;
  }
  .stagger-3 {
    animation-delay: 0.3s;
  }
  .stagger-4 {
    animation-delay: 0.42s;
  }
  .stagger-5 {
    animation-delay: 0.54s;
  }

  @keyframes stagger-in {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  p {
    text-align: justify;
    color: var(--color-text-muted);
    line-height: 1.7;
  }
</style>
