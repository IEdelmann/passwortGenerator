/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

// Get the Node.js modules;
const fs = require("fs");
const path = require("path");
const {clipboard} = require("electron");

let generatedPassword = [];
let dataArray;
let generatorOption = 0;

// At start, load the dictionary and the dom elements;
dataArray = loadDictionary();

const buttonWeak = document.getElementById("weak");
const buttonMiddle = document.getElementById("middle");
const buttonStrong = document.getElementById("strong");
const output = document.getElementById("output-field");
const cpyButton = document.getElementById("cpy-clipboard");

function loadDictionary() {
  let importFileName = path.join(__dirname, "germanDictionaryNouns.txt");
  const dataImport = fs.readFileSync(importFileName, {encoding: "utf-8", flag: "r"});

  return dataImport.split("\n");
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Alert button action;
const alertPlaceholder = document.getElementById("cpyAlert");

const copyAlert = (message, type) => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div id="alert-element" class="alert alert-${type} mt-4 mx-5" role="alert">`,
    `<div id="alert-message">${message}</div>`,
    `</div>`
  ].join('');

  alertPlaceholder.append(wrapper);
}

if (cpyButton) {
  cpyButton.addEventListener("click", () => {
    if (document.getElementById("alert-element")) {
      clearAlert();
    }

    if (generatedPassword.length !== 0) {
      let tempPassword = generatedPassword.join();
      let repPassword = tempPassword.replace(/,/g, "");
      clipboard.writeText(repPassword);

      copyAlert("PASSWORT KOPIERT!", "success");

    } else {
      copyAlert("NICHTS ZUM KOPIEREN VORHANDEN!", "danger");
    }

  });
}

const clearAlert = () => {
  const alertElement = document.getElementById("alert-element");
  const alertMessage = document.getElementById("alert-message");

  alertElement.remove();
  alertMessage.remove();
}

// Password option of generating a random words from the german Scrabble dictionary;
// And also general mechanics of the buttons;
if (buttonWeak) {
  buttonWeak.addEventListener("click", () => {
    buttonActionWeak();
    clearAlert();
  });
}

if (buttonMiddle) {
  buttonMiddle.addEventListener("click", () => {
    buttonActionMiddle();
    clearAlert();
  });
}

if (buttonStrong) {
  buttonStrong.addEventListener("click", () => {
    buttonActionStrong();
    clearAlert();
  });
}

function buttonActionWeak() {
  if (generatorOption === 0) {
    getWords(3);
  } else {
    generateRandomCharacters(8);
  }
}

function buttonActionMiddle() {
  if (generatorOption === 0) {
    getWords(5);
  } else {
    generateRandomCharacters(12);
  }
}

function buttonActionStrong() {
  if (generatorOption === 0) {
    getWords(7);
  } else {
    generateRandomCharacters(16);
  }
}

function getWords(amount) {
  generatedPassword = [];

  for (let i = 0; i < amount; i++) {
    generatedPassword.push(dataArray[getRandomNumber(0, dataArray.length)]);
  }

  renderOutput(generatedPassword);
}

function renderOutput(array) {
  output.innerHTML = "";

  let tempPassword = array.join();
  output.innerHTML = tempPassword.replace(/,/g, "");
}

// Password option of generating a string of random letters, numbers and special characters;
const alphabetLarge = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const alphabetSmall = alphabetLarge.toLowerCase();
const numeric = "0123456789";
const specialChars = "!§$%&/()=?";

const alphabetLargeArray = alphabetLarge.split("");
const alphabetSmallArray = alphabetSmall.split("");
const numericArray = numeric.split("");
const specialCharsArray = specialChars.split("");

const radioButtonOne = document.getElementById("btnRadio1");
const radioButtonTwo = document.getElementById("btnRadio2");

if (radioButtonOne) {
  radioButtonOne.addEventListener("click", () => {
    generatorOption = 0;
  });
}

if (radioButtonTwo) {
  radioButtonTwo.addEventListener("click", () => {
    generatorOption = 1;
  });
}

function generateRandomCharacters(amountOfChars) {
  let randomCharArray = generateRandomArray(amountOfChars);
  generatedPassword = randomCharArray;
  renderOutput(randomCharArray);
}

function generateRandomArray(amountOfChars) {
  let tempPasswordString = [];

  if (amountOfChars === 16) {
    let randomUpperCaseLetters = getRandomNumber(3, 6);
    let randomLowerCaseLetters = getRandomNumber(2, 5);
    let randomSpecialCharacters = getRandomNumber(3, 5);
    let randomNumericChars = amountOfChars - randomUpperCaseLetters - randomLowerCaseLetters - randomSpecialCharacters;

    for (let i = 0; i < randomUpperCaseLetters; i++) {
      tempPasswordString.push(alphabetLargeArray[getRandomNumber(0, 23)]);
    }

    for (let i = 0; i < randomLowerCaseLetters; i++) {
      tempPasswordString.push(alphabetSmallArray[getRandomNumber(0, 23)]);
    }

    for (let i = 0; i < randomSpecialCharacters; i++) {
      tempPasswordString.push(specialCharsArray[getRandomNumber(0, 9)])
    }

    for (let i = 0; i < randomNumericChars; i++) {
      tempPasswordString.push(numericArray[getRandomNumber(0, 9)]);
    }

    return shuffle(tempPasswordString);
  }

  if (amountOfChars === 12) {
    let randomUpperCaseLetters = getRandomNumber(2, 5);
    let randomLowerCaseLetters = getRandomNumber(3, 5);
    let randomNumericChars = amountOfChars - randomUpperCaseLetters - randomLowerCaseLetters;

    for (let i = 0; i < randomUpperCaseLetters; i++) {
      tempPasswordString.push(alphabetLargeArray[getRandomNumber(0, 23)]);
    }

    for (let i = 0; i < randomLowerCaseLetters; i++) {
      tempPasswordString.push(alphabetSmallArray[getRandomNumber(0, 23)]);
    }

    for (let i = 0; i < randomNumericChars; i++) {
      tempPasswordString.push(numericArray[getRandomNumber(0, 9)]);
    }

    return shuffle(tempPasswordString);

  } else {
    let randomUpperCaseLetters = getRandomNumber(2, 5);
    let randomLowerCaseLetters = amountOfChars - randomUpperCaseLetters;

    for (let i = 0; i < randomUpperCaseLetters; i++) {
      tempPasswordString.push(alphabetLargeArray[getRandomNumber(0, 23)]);
    }

    for (let i = 0; i < randomLowerCaseLetters; i++) {
      tempPasswordString.push(alphabetSmallArray[getRandomNumber(0, 23)]);
    }

    return shuffle(tempPasswordString);
  }
}

function shuffle(values) {
  let index = values.length, randomIndex;

  while (index !== 0) {
    randomIndex = Math.floor(Math.random() * index);
    index--;

    [values[index], values[randomIndex]] = [values[randomIndex], values[index]];
  }

  return values;
}