<script lang="ts">
  //PROPS
  export let name: string;
  export let id = name;
  export let subtitle = "";
  export let faded = false;
  export let value = false;
  export let customClass = "";
  //CONTEXT
  export let grouped = false;
  export let grid = false;

  function EnterFlip(e: KeyboardEvent) {
    if (e.key != "Enter") return;
    value = !value;
  }
</script>

<div class="inputBlock {customClass}" class:grid class:grouped class:faded class:longTitle={name.length > 15} on:keypress={EnterFlip} role="button" tabindex="0">
  <label style={subtitle ? "flex-direction: column" : ""} class="checkContainer {customClass}">
    <div>
      <h2 class={customClass}>{name}</h2>
      <input class={customClass} type="checkbox" {id} aria-label={id} bind:checked={value} on:change />
      <span class="checkmark {customClass}" />
    </div>
    {#if subtitle}
      <p class="inputSubtitle">{subtitle}</p>
    {/if}
  </label>
</div>

<style lang="scss">
  @use "./dashDefault.scss";
  @use "./dashVariables.scss" as *;

  // Overwriting Default
  .inputBlock {
    grid-template-columns: 1fr;
  }

  //CHECKBOXES
  label {
    font-size: $fontSize;
    font-weight: bold;
    display: flex;
    position: relative;
    user-select: none;
    cursor: pointer;
    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
    span {
      position: relative;
      padding: 0rem 1rem;
      margin: 0 0.5rem;
      border: $fontColour solid 2px;
      border-radius: 0.3rem;
      transition: 0.2s all;
      &:after {
        content: "✔";
        position: absolute;
        display: none;
        border: $fontColour;
        color: $fontColour;
        border-width: 0 0.2rem 0.2rem 0;
      }
    }
    input:focus + span {
      background-color: $highlight;
    }
    &:hover {
      input ~ span {
        background-color: $highlight;
      }
    }
    input:checked ~ span {
      justify-content: center;
      display: flex;
      align-content: center;
      box-shadow: inset 0px 0px 3px $highlight;
      transition: box-shadow 0.2s ease-in-out;
      &:hover {
        box-shadow: inset 0px 0px 3px $fontColour;
      }
      &:after {
        display: flex;
        align-self: center;
        justify-self: center;
      }
    }
  }

  .checkContainer {
    width: 100%;
    div {
      width: 100%;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    span {
      max-height: 2rem;
      height: 2rem;
      justify-content: end;
      align-self: center;
    }
    p {
      margin: 0;
      font-weight: normal;
      padding: 0;
    }
  }

  @container (max-width: 250px) {
    .longTitle {
      h2 {
        font-size: calc($fontSize * 0.8);
      }
    }
    .inputSubtitle {
      font-size: calc($fontSize * 0.7);
    }
  }
</style>
