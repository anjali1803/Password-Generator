const length = document.querySelector(".length");
const slider = document.querySelector(".slider");
const indicator = document.querySelector(".indicator");
const display = document.querySelector(".display");
const copied = document.querySelector(".copied");
const copy = document.querySelector(".copy");

const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const numbers = document.querySelector("#numbers");
const symbols = document.querySelector("#symbols");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const generateButton = document.querySelector(".generate-btn");

const allSymbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
let checkCount = 1;
let passwordLength = 11;
let password = "";

uppercase.checked = true;
handleSlider();

function handleSlider() {
  passwordLength = slider.value;
  length.innerText = passwordLength;

  const min = slider.min;
  const max = slider.max;
  slider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

slider.addEventListener("input", handleSlider);

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomNum() {
  return randomInt(0, 9);
}

function randomUppercase() {
  return String.fromCharCode(randomInt(65, 91));
}

function randomLowercase() {
  return String.fromCharCode(randomInt(97, 123));
}

function randomSymbol() {
  let randIndex = randomInt(0, allSymbols.length);
  return allSymbols.charAt(randIndex);
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0 0 10px ${color}`;
}

function calStrength() {
  let hasUppercase = uppercase.checked;
  let hasLowercase = lowercase.checked;
  let hasNumbers = numbers.checked;
  let hasSymbols = symbols.checked;

  if (hasUppercase && hasLowercase && (hasNumbers || hasSymbols) && passwordLength >= 8) {
    setIndicator("lightgreen");
  } else if ((hasUppercase || hasLowercase) && (hasNumbers || hasSymbols) && passwordLength >= 6) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

function checkboxCounting() {
  checkCount = 0;
  allCheckbox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  if (checkCount > passwordLength) {
    slider.value = checkCount;
    handleSlider();
  }
}

allCheckbox.forEach((checkbox) => {
  checkbox.addEventListener("change", checkboxCounting);
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join("");
}

async function copyContent() {
  try {
    if (password === "") {
      alert("Password not generated yet!");
      throw "Nothing to copy";
    }
    await navigator.clipboard.writeText(password);
    copied.innerText = "Copied";
  } catch (e) {
    copied.innerText = e;
  }
  copied.style.opacity = "1";
  setTimeout(() => {
    copied.style.opacity = "0";
  }, 1500);
}

copy.addEventListener("click", copyContent);

function generatePassword() {
  if (checkCount < 1) {
    alert("Please select at least 1 checkbox.");
    return;
  }

  password = "";
  let passArray = [];

  if (uppercase.checked) passArray.push(randomUppercase);
  if (lowercase.checked) passArray.push(randomLowercase);
  if (numbers.checked) passArray.push(randomNum);
  if (symbols.checked) passArray.push(randomSymbol);

  for (let i = 0; i < passArray.length; i++) {
    password += passArray[i]();
  }

  for (let i = 0; i < passwordLength - passArray.length; i++) {
    let randomIndex = randomInt(0, passArray.length);
    password += passArray[randomIndex]();
  }

  password = shuffleArray(Array.from(password));
  display.value = password;
  calStrength();
}

generateButton.addEventListener("click", generatePassword);
