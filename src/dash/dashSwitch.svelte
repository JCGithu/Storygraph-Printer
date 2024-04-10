<script lang="ts">
  import { createEventDispatcher } from "svelte";

  //PROPS
  export let name: string;
  export let id = name;
  export let subtitle = "";
  export let faded = false;
  export let value = false;
  export let center = false;
  export let customClass = "";
  export let flexDirection = "column";

  const dispatch = createEventDispatcher();

  function toggleButton() {
    value = !value;
    dispatch("change");
  }
</script>

<div class="inputBlock inputBlockVert {customClass}" class:faded class:center style:--flex={flexDirection}>
  <h2 class="inputName">{name}</h2>
  {#if subtitle.length}
    <p class="inputSubtitle">{subtitle}</p>
  {/if}
  <button on:click={toggleButton} on:submit={toggleButton} class:switchEnabled={value} {id}>
    <span class:toggleOn={value} />
  </button>
</div>

<style lang="scss">
  @use "dashDefault.scss";
  @use "dashVariables.scss" as *;

  .inputBlock {
    display: flex;
    flex-direction: var(--flex) !important;
    justify-content: space-between;
  }

  button {
    position: relative;
    display: inline-flex;
    align-items: center;
    border-radius: 9999px;
    border-width: 0px;
    height: 1.5rem;
    width: 2.75rem;
    cursor: pointer;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    background-color: $off;
  }

  .switchEnabled {
    background-color: $on;
  }

  .center {
    display: flex;
    align-items: center;
  }

  span {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background-color: $fontColour;
    border-radius: 9999px;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateX(-0.25rem);
  }

  .toggleOn {
    transform: translateX(1.1rem);
  }
</style>
