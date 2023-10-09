const RANDOM_QUOTE_API_URL = "https://api.quotable.io/random";
const quoteDisplayElement = document.querySelector(".quote-display");
const quoteInputElement = document.querySelector(".quote-input");
const timerElement = document.querySelector(".timer");
const startBtn = document.querySelector(".start-btn");
const resetBtn = document.querySelector(".reset-btn");

const allFingers = document.querySelectorAll(".hand span");
const leftHandFingers = document.querySelectorAll(".left-hand span");
const rightHandFingers = document.querySelectorAll(".right-hand span");

const leftHandLetters = "qwertasdfgzxcvb";
const rightHandLetters = "yuiophjkl;nm,.'";
const firstFingerLetters = "qaz";
const secondFingerLetters = "wsxyhnujm";
const thirdFingerLetters = "edcik,";
const fourthFingerLetters = "rfvtgbol.";
const fifthFingerLetters = "p;'";

const leftHandLettersArr = leftHandLetters.split("");
const rightHandLettersArr = rightHandLetters.split("");
const firstFingerLettersArr = firstFingerLetters.split("");
const secondFingerLettersArr = secondFingerLetters.split("");
const thirdFingerLettersArr = thirdFingerLetters.split("");
const fourthFingerLettersArr = fourthFingerLetters.split("");
const fifthFingerLettersArr = fifthFingerLetters.split("");

const keys = document.querySelectorAll(".key");
const space = document.querySelector(".space");
const shift = document.querySelector(".leftshift");

let points = 0;
let pointsAccumulator = 0;
const pointsDisplay = document.querySelector(".points-count");

const modal = document.querySelector(".modal");
const modalMsg = document.querySelector(".modal-message");
const closeBtn = document.querySelector(".close-btn");
const modalPoints = document.querySelector(".modal-points-count");

let timeleft = 60;
let timeInterval;

const checkIfCorrect = () => {
  const arrayQuote = quoteDisplayElement.querySelectorAll("span");
  const arrayValue = quoteInputElement.value.split("");

  points = 0 + pointsAccumulator;

  //Dla każdej litery z cytatu sprawdza czy jest równa odpowiadającej jej literze
  // w inpucie. Jeżeli
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      // renderNewQuote();
      // correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
      points++;
    } else {
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      // correct = false;
      points--;
    }
  });

  if (arrayValue.length == arrayQuote.length) {
    quoteInputElement.value = null;
    quoteDisplayElement.innerText = "";
    pointsAccumulator = points;
    renderNewQuote();
  }

  pointsDisplay.textContent = `${points}`;

  checkNextLetter();
};

const checkNextLetter = () => {
  let nextLetter;
  const arrayQuote = quoteDisplayElement.querySelectorAll("span");
  const arrayValue = quoteInputElement.value.split("");

  //Jeżeli długość znaków w inpucie jest większa niż
  //w cytacie, to
  if (arrayValue.length < arrayQuote.length) {
    if (arrayValue == "") {
      nextLetter = arrayQuote[0].innerText;
    } else {
      nextLetter = arrayQuote[arrayValue.length].innerText;
    }
    handleHandAndKeys(nextLetter);
  }
};

const handleHandAndKeys = (nextLetter) => {
  const arrayQuote = quoteDisplayElement.querySelectorAll("span");
  const arrayValue = quoteInputElement.value.split("");
  let fingerToActive;
  let nextLetterSmall = nextLetter.toLowerCase();

  allFingers.forEach((finger) => {
    finger.classList.remove("active-finger");
  });

  keys.forEach((key) => {
    key.classList.remove("active-key");
    key.classList.remove("wrong-key");

    if (nextLetter.toUpperCase() === key.textContent) {
      key.classList.add("active-key");
    }

    if (arrayValue != "") {
      if (
        arrayValue[arrayValue.length - 1] !=
        arrayQuote[arrayValue.length - 1].textContent
      ) {
        if (arrayValue[arrayValue.length - 1] != " ") {
          if (
            arrayValue[arrayValue.length - 1].toUpperCase() === key.textContent
          ) {
            key.classList.add("wrong-key");
          }
        } else {
          space.classList.add("wrong-key");
        }
      }
    }
  });

  if (leftHandLettersArr.includes(nextLetterSmall)) {
    if (firstFingerLettersArr.includes(nextLetterSmall)) {
      fingerToActive = leftHandFingers[0];
    } else if (secondFingerLettersArr.includes(nextLetterSmall)) {
      fingerToActive = leftHandFingers[1];
    } else if (thirdFingerLettersArr.includes(nextLetterSmall)) {
      fingerToActive = leftHandFingers[2];
    } else if (fourthFingerLettersArr.includes(nextLetterSmall)) {
      fingerToActive = leftHandFingers[3];
    } else {
      fingerToActive = leftHandFingers[4];
    }
  } else if (rightHandLettersArr.includes(nextLetterSmall)) {
    if (secondFingerLettersArr.includes(nextLetterSmall)) {
      fingerToActive = rightHandFingers[1];
    } else if (thirdFingerLettersArr.includes(nextLetterSmall)) {
      fingerToActive = rightHandFingers[2];
    } else if (fourthFingerLettersArr.includes(nextLetterSmall)) {
      fingerToActive = rightHandFingers[3];
    } else {
      fingerToActive = rightHandFingers[4];
    }
  } else {
    fingerToActive = leftHandFingers[4];
    space.classList.add("active-key");
  }

  if (/[A-Z]/.test(nextLetter)) {
    shift.classList.add("active-key");
    leftHandFingers[0].classList.add("active-finger");
  }

  fingerToActive.classList.add("active-finger");
};

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then((response) => response.json())
    .then((data) => data.content);
}

// 1.1 Pozyskuje cytat i wstawia do elementu quoteDisplay w formie spanów.
async function renderNewQuote() {
  const quote = await getRandomQuote();
  quoteDisplayElement.innerText = "";
  quote.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });
  checkNextLetter();
}

// 1.2 do zmiennej startTime pozyskuje aktualną datę,
// następnie porównuje co sekundę aktualną datę ze zmienną startTime
// i ustawia treść timera na różnicę między 60 i getTimerTime()
let startTime;
const startTimer = () => {
  startBtn.disabled = true;
  startTime = new Date();
  timeInterval = setInterval(() => {
    timerElement.innerText = 60 - getTimerTime();
    if (getTimerTime() === 60) {
      showResult();
      clearInterval(timeInterval);
      setModalMessage();
      quoteInputElement.disabled = true;
    }
  }, 1000);
};

const getTimerTime = () => {
  return Math.floor((new Date() - startTime) / 1000);
};

const enableQuoteInput = () => {
  quoteInputElement.disabled = false;
};

const showResult = () => {
  modal.classList.add("active-modal");
  modalPoints.textContent = `${points}`;
};

const resetAll = () => {
  startBtn.disabled = false;
  quoteDisplayElement.innerHTML = "";
  quoteInputElement.value = null;
  pointsDisplay.textContent = "0";
  timerElement.innerText = 60;
  startBtn.disabled = false;
  pointsAccumulator = 0;
  clearInterval(timeInterval);
  allFingers.forEach((finger) => {
    finger.classList.remove("active-finger");
  });
  keys.forEach((key) => {
    key.classList.remove("active-key");
    key.classList.remove("wrong-key");
  });
};

const setModalMessage = () => {
  if (points < 0) {
    modalMsg.textContent = "You had one simple task...";
  } else if (points < 50) {
    modalMsg.textContent =
      "Thanks for your engagement but my grandpa would write faster.";
  } else if (points < 150) {
    modalMsg.textContent =
      "It seems you know how the keyboard works, but it wasn't very fast.";
  } else if (points < 200) {
    modalMsg.textContent =
      "That was not so bad but i hope you will practise more.";
  } else if (points < 250) {
    modalMsg.textContent =
      "Overall it wasn't bad, but it can still be better, right?";
  } else if (points < 300) {
    modalMsg.textContent =
      "That's a preety good score. If you practise more, you'll write really fast!";
  } else if (points <= 400) {
    modalMsg.textContent =
      "Wow, very nice score. Keep practise, and you'll become a master";
  } else if (points >= 500) {
    modalMsg.textContent = "Damn! That was incredible, you're really fast!";
  }
};

const closeModal = () => {
  modal.classList.remove("active-modal");
  resetAll();
};

quoteInputElement.addEventListener("input", checkIfCorrect);

startBtn.addEventListener("click", renderNewQuote);
startBtn.addEventListener("click", startTimer);
startBtn.addEventListener("click", enableQuoteInput);
resetBtn.addEventListener("click", resetAll);
closeBtn.addEventListener("click", closeModal);

if (window.innerWidth < 1000) {
  alert(
    "This website was created to use on desktop devices. It won't be displayed well on mobile devices."
  );
} else {
  alert(
    "Welcome to the Quick Typing game. Click start and try to rewrite the quote as fast as you can. Good luck!"
  );
}
