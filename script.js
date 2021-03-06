/*------------------------------------ generate random word */
const link =
  "https://random-words5.p.rapidapi.com/getMultipleRandom?count=10&wordLength=5";
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-host": "random-words5.p.rapidapi.com",
    "x-rapidapi-key": "6c6b5fcbd5msh0ba1b787cc9aea9p10eaf9jsn992d771592a7",
  },
};

let data;
let wordOfTheDay;

// const getData = async () => {
//   const fetchResult = await fetch(link, options);
//   const finalResult = await fetchResult.json();
//   // console.log(finalResult);
//   return finalResult;
// };

let myWords = [];

const generateBtn = document.querySelector("button");
const wordDom = document.querySelector("span");

const setGlobalData = async () => {
  const fetchResult = await fetch(link, options);
  const finalResult = await fetchResult.json();
  data = finalResult;
  wordOfTheDay = data[0];
  myWords = [...myWords, wordOfTheDay]; // add the words to an array
  updateLocalStorageForMyWords();
  wordDom.innerText = `"${wordOfTheDay}"`;
  renderMyWords(myWords);
  return wordOfTheDay;
};

// setGlobalData()

/*------------------------------- random word and get definitions  */

function getDefinition(e, searchWord) {
  e.preventDefault();
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`)
    .then((response) => {
      if (!response.ok) throw new Error(response.status);
      return response.json();
    })
    .then((json) => {
      let meanings = json[0].meanings;
      for (let defs of meanings) {
        for (let def of defs.definitions) {
          meaningDom.innerText = `Definition: 
          ${def.definition}
          Example: 
          "${def.example}"
          `;
        }
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

generateBtn.addEventListener("click", (event) => {
  let todayWord = setGlobalData();
  todayWord.then((word) => {
    getDefinition(event, word);
  });
});

/*------------------------------- local storage and list of words  */

const meaningDom = document.querySelector(".meaning");
const myWordsDom = document.querySelector(".my-words");

function renderMyWords(array) {
  myWordsDom.innerHTML = "";
  array.forEach((element) => {
    if (element !== null) {
      let div = document.createElement("div");
      div.classList.add("list-of-my-words");
      div.textContent = element;
      myWordsDom.appendChild(div);
    }
  });
}

myWordsDom.addEventListener("click", (e) => {
  let targetedWord = e.target.innerText;

  getDefinition(e, targetedWord);
  wordDom.innerText = `"${targetedWord}"`;
});

//localStorage

function updateLocalStorageForMyWords() {
  localStorage.setItem("myWords", JSON.stringify(myWords));
}

if (localStorage.getItem("myWords")) {
  myWords = JSON.parse(localStorage.getItem("myWords"));
  let wordsArr = [];
  myWords.forEach((word) => {
    if (word !== null) {
      wordsArr.push(word);
    }
  });
  renderMyWords(wordsArr);
}

// filter array in dom myWords

function filterArrayInDom() {
  let array = [...myWords];
  let aZArray = array.sort();
  let words = [];
  aZArray.forEach((word) => {
    if (word !== null) {
      words.push(word);
    }
  });
  renderMyWords(words);
}

const checkboxAZ = document.querySelector("#checkbox");

checkboxAZ.addEventListener("click", (e) => {
  if (checkboxAZ.checked) {
    filterArrayInDom();
  } else {
    renderMyWords(myWords);
  }
});
