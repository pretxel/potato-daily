<script>
  import { _ } from "svelte-i18n";
  import { appState } from "../state.svelte.js";

  let name = $state("");
  let error = $state("");
  let shakeError = $state(false);

  function triggerShake() {
    shakeError = false;
    requestAnimationFrame(() => {
      shakeError = true;
      setTimeout(() => {
        shakeError = false;
      }, 500);
    });
  }

  function handleNew(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed === "") {
      triggerShake();
      return;
    }
    const isDuplicate = appState.people.some(
      (p) => p.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (isDuplicate) {
      error = $_("error_duplicate_name");
      triggerShake();
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

<div class="new-avatar-wrapper">
  <form onsubmit={handleNew}>
    <label for="new-avatar-name" class="form-label">
      {$_("page_add_new_avatar")}
    </label>
    <div class="input-row">
      <input
        id="new-avatar-name"
        bind:value={name}
        class:shake={shakeError}
        maxlength="30"
        autocomplete="off"
      />
      <button type="submit" class="add-btn">
        {$_("page_button_add")}
      </button>
    </div>
    {#if error}
      <p class="error" role="alert">{error}</p>
    {/if}
  </form>
</div>

<style>
  .new-avatar-wrapper {
    margin-top: var(--space-xl);
    padding: clamp(var(--space-md), 4vw, var(--space-lg));
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    border: 1px solid rgba(245, 166, 35, 0.12);
  }

  .form-label {
    display: block;
    font-family: var(--font-body);
    font-size: 0.85em;
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: var(--space-sm);
    text-align: left;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .input-row {
    display: flex;
    gap: var(--space-sm);
  }

  input {
    flex: 1;
    min-width: 0;
    font-family: var(--font-body);
    font-size: 16px;
    padding: 0.7em 1em;
    background: var(--color-bg);
    border: 1.5px solid rgba(245, 236, 215, 0.12);
    border-radius: var(--radius-md);
    color: var(--color-text);
    outline: none;
    transition:
      border-color var(--transition-fast),
      box-shadow var(--transition-fast);
  }

  input:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-accent-glow);
  }

  input.shake {
    animation: input-shake 0.45s ease both;
    border-color: var(--color-danger);
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.25);
  }

  @keyframes input-shake {
    0% {
      transform: translateX(0);
    }
    15% {
      transform: translateX(-6px);
    }
    30% {
      transform: translateX(6px);
    }
    45% {
      transform: translateX(-5px);
    }
    60% {
      transform: translateX(5px);
    }
    75% {
      transform: translateX(-3px);
    }
    90% {
      transform: translateX(2px);
    }
    100% {
      transform: translateX(0);
    }
  }

  .add-btn {
    background: transparent;
    color: var(--color-accent);
    border: 1.5px solid var(--color-accent);
    border-radius: var(--radius-md) !important;
    padding: 0.7em 1.2em;
    font-size: 0.95em;
    flex-shrink: 0;
  }

  @media (hover: hover) {
    .add-btn:hover {
      background: var(--color-accent);
      color: var(--color-bg);
      box-shadow: var(--shadow-glow);
    }
  }

  .error {
    color: var(--color-danger);
    margin: 0;
    font-size: 0.85em;
    text-align: left;
    animation: error-in 0.2s ease both;
  }

  @keyframes error-in {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
