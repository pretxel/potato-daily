<script>
  import { _ } from "svelte-i18n";
  import { appState } from "../state.svelte.js";
  import Counter from "./Counter.svelte";
  import Avatar from "./Avatar.svelte";
  import NewAvatar from "./NewAvatar.svelte";

  const MODES = { edit: "EDIT", started: "STARTED", finished: "FINISHED" };
  const DEFAULT_COUNTER = 3;

  let mode = $state(MODES.edit);
  const editable = $derived(mode === MODES.edit);
  const labelStart = $derived(
    mode === MODES.started ? $_("page_button_next") : $_("page_button_start"),
  );

  function choosePerson() {
    const peopleT = [...appState.peopleToPlay];
    const selectedIndex = Math.floor(Math.random() * peopleT.length);
    appState.avatarSelected = peopleT.splice(selectedIndex, 1)[0];
    appState.peopleToPlay = peopleT;
    if (peopleT.length === 0) {
      mode = MODES.finished;
    }
  }

  function initToPlay() {
    mode = MODES.edit;
    appState.avatarSelected = {};
    appState.peopleToPlay = [...appState.people];
  }

  function handleStart(event) {
    event.preventDefault();
    mode = MODES.started;
    appState.count = DEFAULT_COUNTER;
    appState.startingCounter = true;
  }

  function handleRestart(event) {
    event.preventDefault();
    initToPlay();
  }

  function handleCounterDone() {
    appState.startingCounter = false;
    choosePerson();
  }

  initToPlay();
</script>

{#if mode === MODES.edit}
  <ul>
    {#each appState.people as item, index}
      <Avatar name={item.name} image={item.image} {editable} {index} />
    {/each}
  </ul>
{/if}

{#if mode === MODES.started}
  <ul>
    {#each appState.peopleToPlay as item, index}
      <Avatar name={item.name} image={item.image} {editable} {index} />
    {/each}
  </ul>
{/if}

{#if mode === MODES.edit && appState.people.length === 0}
  <p class="empty-state">{$_("page_empty_state")}</p>
{/if}

{#if editable}
  <NewAvatar />
{/if}

{#if appState.startingCounter}
  <Counter onDone={handleCounterDone} />
{/if}

{#if !appState.startingCounter && appState.avatarSelected.name}
  <div class="selected" aria-live="polite">
    <h3>{$_("page_avatar_selected")}</h3>
    <ul>
      <Avatar
        name={appState.avatarSelected.name}
        image={appState.avatarSelected.image}
        editable={false}
        index={0}
      />
    </ul>
  </div>
{/if}

{#if (mode === MODES.started || mode === MODES.edit) && appState.people.length > 0}
  <button class="start" onclick={handleStart}>{labelStart}</button>
{/if}

{#if mode === MODES.finished}
  <button class="start" onclick={handleRestart}
    >{$_("page_button_again")}</button
  >
{/if}

<style>
  ul {
    display: flex;
    justify-content: center;
    gap: 30px;
    flex-basis: auto;
    padding: 0;
    flex-wrap: wrap;
  }

  button {
    margin-top: 10px;
    width: 100%;
  }

  .selected {
    background-color: #1a1a1a;
    border-radius: 20px;
    width: 150px;
    margin: auto;
  }

  .selected h3 {
    margin: 10px;
    padding-top: 10px;
  }

  .empty-state {
    opacity: 0.7;
    margin: 1.5em 0;
  }
</style>
