<script lang="ts">
  let bookMap = new Map();
  let debugText = "";

  //https://www.youtube.com/watch?v=9Tl3OmwrSaM

  async function runToRead() {
    debugText = "WOWO";
    async function scrollAndWaitForContent() {
      let lastHeight = 0;
      while (true) {
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const newHeight = document.body.scrollHeight;
        if (newHeight === lastHeight) break;
        lastHeight = newHeight;
      }
    }

    // Call the scrolling function
    await scrollAndWaitForContent();
    const bookPanes = document.querySelectorAll(".book-pane-content");

    // Iterate and extract through each book pane
    bookPanes.forEach((bookPane) => {
      const titleElement = bookPane.querySelector(".book-title-author-and-series h3 a");
      const authorElement = bookPane.querySelector('.book-title-author-and-series p a[href^="/authors/"]');
      if (titleElement && authorElement) {
        const title = titleElement.textContent?.trim() || "";
        const author = authorElement.textContent?.trim() || "";
        if (bookMap.get(title)) return;
        bookMap.set(title, author);
      }
    });
  }
</script>

<main>
  <h1>Storygraph Printer</h1>
  <p>Made by <a href="https://colloquial.studio/">Colloquial Studio</a></p>
  <section>
    <p><a href="mailto:colloquialstudios@gmail.com">Contact</a></p>
    <p>&nbsp/&nbsp</p>
    <p><a href="https://colloquial.studio/donate">Donate</a></p>
  </section>
</main>

<style>
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
  }
  section p {
    padding-right: 5px;
  }
</style>
