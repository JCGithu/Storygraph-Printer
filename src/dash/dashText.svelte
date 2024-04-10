<script lang="ts">
  //PROPS
  export let name: string;
  export let id = name;
  export let subtitle = "";
  export let faded = false;
  export let value: string;
  export let customClass = "";

  export let grid = false;
  export let grouped = false;
</script>

<div class="inputBlock inputBlockVert {customClass}" class:grid class:grouped class:faded style:--flex={"column"}>
  <h2 class="inputName">{name}</h2>
  {#if subtitle.length}
    <p class="inputSubtitle">{subtitle}</p>
  {/if}
  <input type="text" {id} aria-label={id} bind:value on:change />
</div>

<style lang="scss">
  @use "./dashDefault.scss";
  @use "./dashVariables.scss" as *;

  input[type="text"] {
    height: 1.2rem;
    border: none !important;
    border-radius: 8px;
    font-family: $font;
    padding: calc($fontSize * 0.5);
    margin-top: calc($fontSize * 0.5);
    margin-bottom: calc($fontSize * 0.5);
    height: calc($fontSize * 1.2);
    font-size: calc($fontSize * 0.8);
  }
</style>
