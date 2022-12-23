<script>
  import { onMount } from "svelte";
  import { _ } from 'svelte-i18n'
  import {
    count,
    startingCounter,
    intervalId,
    peopleToPlay,
    avatarSelected,
  } from "../peopleStore.js";
  import Counter from "./Counter.svelte";
  import Avatar from "./Avatar.svelte";
  import NewAvatar from "./NewAvatar.svelte";
  export let people;
  export let editable;

  const MODES = { edit: "EDIT", started: "STARTED", finished: "FINISHED" };
  const DEFAULT_COUNTER = 3;

  let showCounter = false;
  let labelStart = $_('page_button_start');
  let mode = MODES.edit;
  let intervalIdTemporal;
  let peopleTemporalM = [];
  let peopleT;
  let avatarSelectedC;

  const choosePerson = () => {
    const totalPeople = peopleT.length - 1;
    const selectedIndex = Math.round(Math.random() * (totalPeople - 0) + 0);
    // const selectedPeople = peopleT[selectedIndex]
    avatarSelected.set(peopleT.splice(selectedIndex, 1)[0]);
    $peopleToPlay = peopleT;
    if (peopleT.length === 0) {
      mode = MODES.finished;
    }
  };

  const initToPlay = () => {
    editable = true;
    mode = MODES.edit;
    avatarSelected.set({});
    labelStart = $_('page_button_start');
    peopleT = [...people];
  };

  startingCounter.subscribe((value) => {
    showCounter = value;
  });

  intervalId.subscribe((value) => {
    intervalIdTemporal = value;
  });

  avatarSelected.subscribe((value) => {
    avatarSelectedC = value;
  });

  count.subscribe((value) => {
    console.log(value);
    if (value === 0) {
      clearInterval(intervalIdTemporal);
      startingCounter.set(false);
      choosePerson();
    }
  });

  function handleStart(event) {
    event.preventDefault();
    mode = MODES.started;
    editable = false;
    startingCounter.set(true);
    count.set(DEFAULT_COUNTER);
    labelStart = $_('page_button_next');
  }

  function handleRestart(event) {
    event.preventDefault();
    initToPlay();
  }

  peopleTemporalM = [...people];

  peopleToPlay.subscribe((value) => {
    peopleT = value;
  });

  onMount(() => {
    initToPlay();
  });
</script>

{#if mode === MODES.edit}
  <ul>
    {#each people as item, index}
      <Avatar
        name={item.name}
        image={`${item.image}${item.name}.svg`}
        {editable}
        {index}
      />
    {/each}
  </ul>
{/if}

{#if mode === MODES.started}
  <ul>
    {#each peopleT as item, index}
      <Avatar
        name={item.name}
        image={`${item.image}${item.name}.svg`}
        {editable}
        {index}
      />
    {/each}
  </ul>
{/if}

{#if editable}
  <NewAvatar />
{/if}

{#if showCounter}
  <Counter />
{/if}

{#if showCounter === false && avatarSelectedC.name}
  <div>
    <h3>{$_('page_avatar_selected')}</h3>
    <ul>
      <Avatar
        name={avatarSelectedC.name}
        image={`${avatarSelectedC.image}${avatarSelectedC.name}.svg`}
        editable={false}
        index={0}
      />
    </ul>
  </div>
{/if}

{#if (mode === MODES.started || mode === MODES.edit) && people.length > 0 }
  <button class="start" on:click={handleStart}>{labelStart}</button>
{/if}

{#if mode === MODES.finished}
  <button class="start" on:click={handleRestart}>{$_('page_button_again')}</button>
{/if}

<style>
  ul {
    max-width: 400px;
    display: flex;
    justify-content: center;
    gap: 30px;
    flex-basis: auto;
    padding: 0;
  }

  button {
    margin-top: 10px;
    width: 100%;
  }

  div {
    background-color: #1a1a1a;
    border-radius: 20px;
    width: 150px;
    margin: auto;
  }

  div h3 {
    margin: 10px;
    padding-top: 10px;
  }
</style>
