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
        <section class="references stagger-6" aria-label={$_("page_references_title")}>
          <h2>{$_("page_references_title")}</h2>
          <ul>
            <li>
              <a
                class="ref-card"
                href="https://pokemon-poker.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div class="ref-thumb ref-thumb--pokemon" aria-hidden="true">
                  <img
                    src="https://s.wordpress.com/mshots/v1/https%3A%2F%2Fpokemon-poker.vercel.app%2F?w=640&h=400"
                    alt=""
                    loading="lazy"
                    width="640"
                    height="400"
                  />
                </div>
                <div class="ref-meta">
                  <span class="ref-title">Pokemon Poker</span>
                  <span class="ref-host">pokemon-poker.vercel.app</span>
                </div>
              </a>
            </li>
            <li>
              <a
                class="ref-card"
                href="https://retro-ball-orpin.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div class="ref-thumb ref-thumb--retro" aria-hidden="true">
                  <img
                    src="https://s.wordpress.com/mshots/v1/https%3A%2F%2Fretro-ball-orpin.vercel.app%2F?w=640&h=400"
                    alt=""
                    loading="lazy"
                    width="640"
                    height="400"
                  />
                </div>
                <div class="ref-meta">
                  <span class="ref-title">Retro Ball</span>
                  <span class="ref-host">retro-ball-orpin.vercel.app</span>
                </div>
              </a>
            </li>
          </ul>
        </section>
      </div>
    {/if}

    {#if showAvatars}
      <div in:fade={{ duration: prefersReducedMotion ? 0 : 500 }}>
        <GroupAvatar />
      </div>
    {/if}
  {/if}
</main>

<footer class="site-footer">
  <p>Made with ❤️ | 2026 | pretxel</p>
</footer>

<style>
  .logo {
    width: auto;
    height: clamp(96px, 24vw, 130px);
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
  .stagger-5,
  .stagger-6 {
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
  .stagger-6 {
    animation-delay: 0.66s;
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
    text-align: left;
    color: var(--color-text-muted);
    line-height: 1.7;
    text-wrap: pretty;
  }

  @media (min-width: 600px) {
    p {
      text-align: justify;
    }
  }

  .references {
    margin-top: var(--space-xl);
    padding-top: var(--space-lg);
    border-top: 1px solid rgba(245, 236, 215, 0.1);
  }

  .references h2 {
    margin: 0 0 var(--space-sm);
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-muted);
  }

  .references ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--space-md);
    grid-template-columns: 1fr;
  }

  @media (min-width: 600px) {
    .references ul {
      grid-template-columns: 1fr 1fr;
    }
  }

  .ref-card {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    background: var(--color-surface);
    border: 1px solid rgba(245, 236, 215, 0.08);
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: var(--shadow-card);
    transition:
      transform var(--transition-base),
      border-color var(--transition-base),
      box-shadow var(--transition-base);
  }

  .ref-card:hover,
  .ref-card:focus-visible {
    transform: translateY(-3px);
    border-color: var(--color-accent);
    box-shadow:
      var(--shadow-card),
      var(--shadow-glow);
    outline: none;
  }

  .ref-thumb {
    position: relative;
    aspect-ratio: 16 / 10;
    overflow: hidden;
  }

  .ref-thumb--pokemon {
    background:
      radial-gradient(circle at 30% 35%, #ffd84a 0%, transparent 55%),
      radial-gradient(circle at 70% 65%, #ef4444 0%, transparent 60%),
      linear-gradient(135deg, #1a1f3a 0%, #0d1126 100%);
  }

  .ref-thumb--retro {
    background:
      repeating-linear-gradient(
        45deg,
        rgba(245, 166, 35, 0.12) 0 12px,
        transparent 12px 24px
      ),
      linear-gradient(135deg, #2a1a0a 0%, #5a2e0d 100%);
  }

  .ref-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform var(--transition-slow);
  }

  .ref-card:hover .ref-thumb img {
    transform: scale(1.04);
  }

  .ref-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: var(--space-md);
  }

  .ref-title {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .ref-host {
    font-size: 0.8rem;
    color: var(--color-text-muted);
  }

  .site-footer {
    position: relative;
    z-index: 1;
    width: 100%;
    padding: var(--space-lg) var(--space-md);
    text-align: center;
  }

  .site-footer p {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 0.85rem;
    text-align: center;
  }
</style>
