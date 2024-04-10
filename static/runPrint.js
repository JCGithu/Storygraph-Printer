
let bookMap = new Map();
let URL = window.location.href;
let targetElement, priorElement;

let SGPsettings = {
  enable: false,
  default: "{title} // {author}",
};

// Function to retrieve settings from Chrome storage
async function retrieveSettings() {
  await chrome.storage.sync.get(['SGPsettings']).then((result) => {
    if (result.SGPsettings) {
      SGPsettings = result.SGPsettings;
      console.log("Storygraph Printer settings:", SGPsettings);
    } else {
      console.log("Settings not found, using default settings.");
    }
    if (SGPsettings.enable) generateExtension();
  });
}

// Call the retrieveSettings function when the content script runs
retrieveSettings();

const URLArray = ['to-read',"currently-reading","owned-books","five_star_reads","books-read"];

window.addEventListener("turbo:load", (event) => {
  setTimeout(()=> {
    URL = location.href;
    if (document.getElementById('storygraphPrinter')) return;
    if (URLArray.some(substring => URL.includes(substring)) && SGPsettings.enable) generateExtension();
  }, 200)
});

function generateExtension(){
  targetElement = null;
  priorElement = null;
  if (URL.includes('to-read')){
    targetElement = document.getElementsByClassName('to-read-books');
    if (targetElement[0]) targetElement = targetElement[0];
    priorElement = document.getElementById('up-next-section');
  } else if (URL.includes("currently-reading") || URL.includes("owned-books") || URL.includes("five_star_reads")) {
    targetElement = document.getElementsByClassName('container');
    if (targetElement[0]) targetElement = targetElement[0];
  } else if (URL.includes("books-read")){
    targetElement = document.getElementsByClassName('container');
    if (targetElement[1]) targetElement = targetElement[1].firstElementChild;
    priorElement = targetElement.querySelectorAll('form')[1];
  }
  
  
  let exportText = SGPsettings.default;
  
  function mapToString(map) {
    let result = "<ul>";
    map.forEach((value, key) => {
      console.log(value);
      let lineText = exportText.replace('{title}', key).replace('{author}', value.author).replace('{year}', value.year).replace('{series}', value.series ? value.series : '');
      result += `<li>${lineText}</li>`;
    });
    result += "</ul>";
    return result;
  }
  
  
  let resultBlock = document.createElement('div');
  resultBlock.classList.add('px-5');
  
  let textInput = document.createElement('input');
  textInput.type = 'search';
  textInput.name = 'PrinterExport';
  textInput.setAttribute('autocomplete', 'off');
  textInput.value = exportText;
  textInput.classList.add('search-field', 'block', 'w-full', 'pl-3', 'pr-6' , 'sm:pr-7', 'py-2', 'border-2', 'border-darkGrey' ,'dark:border-darkerGrey', 'rounded-md', 'leading-5', 'bg-white', 'dark:bg-darkestGrey', 'focus:outline-none', 'focus:ring-1', 'focus:ring-cyan-600','dark:focus:ring-cyan-400', 'focus:border-cyan-600', 'dark:focus:border-cyan-400', 'text-sm', 'md:text-xs', 'lg:text-sm', 'font-body')
  textInput.role ="combobox"
  textInput.addEventListener('change', (e)=> {
    exportText = e.target.value;
  })
  let subtitle = document.createElement('p');
  subtitle.classList.add('mb-3', 'text-xs');
  subtitle.innerText = 'Format the output here.';
  let subtitle2 = document.createElement('i');
  subtitle2.classList.add('text-xs', 'text-cyan-700','dark:text-cyan-500');
  subtitle2.innerText = "Only books visible on the page will show, so filtering will work. To get a full list scroll until the page is completely loaded. \n Settings can be changed in the extension."
  resultBlock.appendChild(subtitle);
  resultBlock.appendChild(textInput);
  resultBlock.appendChild(subtitle2);
  resultBlock.style.display = "none";
  
  let resultTarget = document.createElement('div');
  resultTarget.classList.add('mt-4');
  resultBlock.appendChild(resultTarget);
  
  // The Work
  function runStorygraphPrinter(){
    bookMap = new Map();
    const bookPanes = document.querySelectorAll(".book-pane-content");
  
      // Iterate and extract through each book pane
      bookPanes.forEach((bookPane) => {
        const bookElement = bookPane.querySelector('.book-title-author-and-series');
        const titleElement = bookElement.querySelector("h3 a");
        const authorElement = bookElement.querySelector('p a[href^="/authors/"]');
        if (!titleElement && !authorElement) return;
        const seriesLink = bookElement.querySelector('a[href^="/series/"]');
        const title = titleElement.textContent?.trim() || "";
        const author = authorElement.textContent?.trim() || "";
        if (bookMap.get(title)) return;
        let year = bookElement.nextElementSibling.querySelector('.toggle-edition-info-link').textContent.trim().split(' ').pop();
        if (!parseInt(year)) year = "TBC";
        if (seriesLink) {
          seriesName = seriesLink.textContent;
          let series = seriesName;
          let seriesNumber = seriesLink.nextElementSibling;
          if (seriesNumber) series = `${seriesName} ${seriesNumber.textContent}`;
          bookMap.set(title, {author, series, year});
        } else {
          bookMap.set(title, {author, series:null, year});
        }
      });
      hidden = false;
      showBlock();
      resultTarget.innerHTML = mapToString(bookMap);
  }
  
  
  // Making Element
  let mainDiv = document.createElement('div');
  mainDiv.id = 'storygraphPrinter'
  
  let hr = document.createElement('hr');
  hr.classList.add('text-darkGrey');
  hr.classList.add('dark:text-darkerGrey');
  hr.classList.add('mt-6');
  mainDiv.appendChild(hr);
  
  let bodyDiv = document.createElement('div');
  bodyDiv.classList.add('flex', 'justify-between','items-center', 'px-1');
  
  let titleBox = document.createElement('div');
  titleBox.classList.add('-mx-3', 'cursor-pointer');
  let secondTitleBox = document.createElement('div');
  secondTitleBox.classList.add('pt-4');
  
  let downArrow = document.createElement('svg');
  downArrow.classList.add('inline-block', 'chevron-down', 'w-6', 'hidden');
  downArrow.role = 'button';
  downArrow.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="text-darkestGrey dark:text-grey fill-current icon-cheveron-down"><path class="secondary" fill-rule="evenodd" d="M15.3 10.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.4l3.3 3.29 3.3-3.3z"></path></svg>';
  downArrow.setAttribute('viewBox', '0 0 20 20');
  let rightArrow = document.createElement('svg');
  rightArrow.classList.add('inline-block', 'chevron-right', 'w-6');
  rightArrow.role = 'button';
  rightArrow.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="text-darkestGrey dark:text-grey fill-current icon-cheveron-right"><path class="secondary" d="M10.3 8.7a1 1 0 0 1 1.4-1.4l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.4-1.4l3.29-3.3-3.3-3.3z"></path></svg>';
  rightArrow.setAttribute('viewBox', '0 0 20 20');
  
  let titleSpan = document.createElement('span');
  titleSpan.innerText = 'Storygraph Printer';
  titleSpan.classList.add('font-semibold');
  titleSpan.classList.add('pt-4');
  
  secondTitleBox.appendChild(downArrow);
  secondTitleBox.appendChild(rightArrow);
  secondTitleBox.appendChild(titleSpan);
  titleBox.appendChild(secondTitleBox);
  
  function hideBlock (){
    rightArrow.classList.remove('hidden');
    downArrow.classList.add('hidden');
    resultBlock.style.display = 'none';
  }
  
  function showBlock(){
    rightArrow.classList.add('hidden');
    downArrow.classList.remove('hidden');
    resultBlock.style.display = 'block';
  }
  
  let hidden = true;
  titleBox.addEventListener('click', ()=>{
    if (hidden){
      showBlock();
    } else {
      hideBlock();
    }
    hidden = !hidden;
  })
  
  bodyDiv.appendChild(titleBox);
  
  let testButton = document.createElement('button');
  testButton.innerText = 'Run!';
  testButton.type = 'button'
  testButton.classList.add('secondary-btn');
  testButton.addEventListener('click', runStorygraphPrinter)
  bodyDiv.appendChild(testButton);
  
  //Final Add;
  if (targetElement){
    mainDiv.appendChild(bodyDiv);
    mainDiv.appendChild(resultBlock);
    if (priorElement){
      targetElement.insertBefore(mainDiv, priorElement);
    } else {
      targetElement.appendChild(mainDiv);
    }
  }
  
}

