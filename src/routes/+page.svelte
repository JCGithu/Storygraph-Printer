<script lang="ts">
  import { onMount } from "svelte";
  import DashText from "../dash/dashText.svelte";
  import DashGroup from "../dash/dashGroup.svelte";
  import DashSwitch from "../dash/dashSwitch.svelte";

  let SGPsettings = {
    enable: true,
    default: "{title} // {author}",
  };

  let saveSettings = () => {};

  onMount(() => {
    saveSettings = () => {
      chrome.storage.sync.set({ SGPsettings }, function () {
        console.log("Settings saved");
      });
    };

    chrome.storage.sync.get(["SGPsettings"], (result) => {
      if (!result.SGPsettings) {
        saveSettings();
      } else {
        SGPsettings = result.SGPsettings;
      }
    });
  });
</script>

<main>
  <h1>Storygraph Printer</h1>
  <p>Made by <a href="https://colloquial.studio/">Colloquial Studio</a></p>
  <section>
    <p><a href="mailto:colloquialstudios@gmail.com">Contact</a></p>
    <p>&nbsp/&nbsp</p>
    <p><a href="https://colloquial.studio/donate">Donate</a></p>
  </section>
  <DashGroup title="Settings">
    <DashText name="Default Output" subtitle="{'{'}author{'}'} {'{'}title{'}'} {'{'}year{'}'} {'{'}series{'}'}" bind:value={SGPsettings.default} on:change={saveSettings} />
    <DashSwitch name="Enable" bind:value={SGPsettings.enable} on:change={saveSettings} flexDirection="row" />
  </DashGroup>
</main>

<style lang="scss">
  @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
  main {
    font-family: "Poppins";
    width: 300px;
    background-color: #fe5f55;
    color: white;
    margin: 0;
    padding: 1rem;
  }
  a {
    color: white;
  }
  p {
    margin: 0;
  }
  section {
    display: flex;
    p {
      padding-right: 5px;
    }
  }
</style>
