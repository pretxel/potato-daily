<script>
  import { onMount } from "svelte";
  import { count, intervalId } from "../peopleStore.js";

  let countValue;

  count.subscribe((value) => {
    countValue = value;
  });

  onMount(() => {
    const intervalIdT = setInterval(() => {
      count.update((n) => n - 1);
    }, 1000);
    intervalId.set(intervalIdT);
  });
</script>

<div>
  <span>
    {countValue}
  </span>
</div>

<style>
  div {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  span {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.5em 1.2em;
    margin-top: 20px;
    font-size: 1.5em;
    font-weight: 500;
    font-family: inherit;
    background-color: #1a1a1a;
    transition: border-color 0.25s;
  }
</style>
