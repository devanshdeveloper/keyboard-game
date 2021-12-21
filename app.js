import { Paragraph } from "./paragraph.js";
import {
  getStyle,
  incrementStyle,
  isAlphabet,
  randomText,
  isOnScreen,
  randomNumberBetween,
  setStyle,
  useModal,
} from "./utility.js";
// variables
let para,
  lastTime,
  AllCharsEl,
  speed,
  incrementSpeedScale,
  toSpeak,
  isGameOver = false,
  speedScale = 1;
// elements
const startScreen = document.querySelector(".startScreen");
const world = document.querySelector(".world");
const form = startScreen.querySelector("form");
const inputText = document.getElementById("inputText");
const inputSpeed = document.getElementById("inputSpeed");
const inputSpeedScale = document.getElementById("inputSpeedScale");
const getRandomBtn = document.getElementById("getRandomBtn");
const detail = document.getElementById("detail");
const inputSpeak = document.getElementById("inputSpeak");

// onload
addEventListener("DOMContentLoaded", () => {
  const queryPara = new URL(location).searchParams.get("para");
  if (queryPara) handleStart(queryPara);
  else {
    world.style.display = "none";
    // events
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handleStart(
        inputText.value,
        inputSpeed.value,
        inputSpeedScale.value,
        inputSpeak.checked
      );
    });
    getRandomBtn.addEventListener("click", () => {
      inputText.value = randomText;
    });
    inputText.addEventListener("focus", () =>
      navigator.clipboard.readText().then((text) => (inputText.value = text))
    );
  }
});

// handlers
function handleStart(
  text,
  paraSpeed = 1,
  paraSpeedScale = 1,
  paraToSpeak = false
) {
  if (!text)
    return useModal({
      text: "No Text Found",
    });
  else if (text.length > 1000)
    return useModal({
      text: "Text Limit : 1000",
    });
  else para = new Paragraph(text);
  speed = 0.025 * (paraSpeed / 100);
  incrementSpeedScale = 0.000025 * (paraSpeedScale / 100);
  startScreen.style.display = "none";
  world.style.display = "flex";
  toSpeak = paraToSpeak;
  if (innerWidth < 600) {
    window.inputKey = document.createElement("input");
    inputKey.type = "password";
    document.body.append(inputKey);
    inputKey.addEventListener("input", handleInputPress);
    inputKey.focus();
    document.addEventListener("click", () => inputKey.focus());
  } else addEventListener("keydown", handlePress);
  createWorld();
  requestAnimationFrame(animateWorld);
  if (toSpeak) para.speakWord(para.currentWord);
  addEventListener("beforeunload", () => lsItem("wpm", para.highestWPM));
}

function handleInputPress() {
  handlePress({ key: inputKey.value[para.i] || " " });
}

function handleLose(reason) {
  if (isGameOver) return;
  isGameOver = true;
  para.stopTimer();
  if (innerWidth < 600) inputKey.removeEventListener("input", handleInputPress);
  else removeEventListener("keydown", handlePress);
  useModal({
    heading: reason,
    text:
      para.i > 10
        ? `
    <span>Accuracy : ${((para.corrected / para.i) * 100).toFixed(2)}%<br>
    Completed : ${((para.i / para.length) * 100).toFixed(2)}%<br>
    WPM : ${para.wpm}<br>
    Time : ${para.timer}s<br></span>`
        : "Press Restart",
    btns: [
      {
        text: "Restart",
        onclick: handleRestart,
      },
      {
        text: "Reset",
        onclick: () => location.replace(location.origin),
      },
    ],
  });
  AllCharsEl.forEach((e) => e.classList.remove("selected", "green", "red"));
  setStyle(world, "--left", 0);
}

function handlePress({ altKey, ctrlKey, key }) {
  if (altKey || ctrlKey) return;
  if (key === " ") moveWorld(200);
  else if (isAlphabet(key)) pressed(key);
}

function handleRestart() {
  isGameOver = false;
  speedScale = 1;
  lastTime = null;
  para.reset();
  detail.innerHTML = "";
  if (innerWidth < 600) {
    inputKey.value = "";
    inputKey.addEventListener("input", handleInputPress);
    inputKey.focus();
  } else addEventListener("keydown", handlePress);
  requestAnimationFrame(animateWorld);
}

/*
functions
*/
// world
function createWorld() {
  const worldHeight = (innerWidth > 600 ? innerHeight : innerHeight / 2) - 100;
  let left = innerWidth;
  let prevWidth = 0;
  para.words.forEach((word) => {
    const wordDiv = document.createElement("div");
    for (let i = 0; i < word.length; i++) {
      const charDiv = document.createElement("div");
      charDiv.classList.add("char");
      charDiv.innerText = word[i];
      wordDiv.append(charDiv);
    }
    world.append(wordDiv);
    wordDiv.classList.add("word");
    setStyle(wordDiv, "--top", randomNumberBetween(50, worldHeight));
    left += randomNumberBetween(50, 200) + prevWidth;
    prevWidth = wordDiv.offsetWidth;
    setStyle(wordDiv, "--left", left);
  });
  world.style.width = left + prevWidth + innerWidth + "px";
  AllCharsEl = document.querySelectorAll(".char");
  currentEl().classList.add("selected");
}

function animateWorld(time) {
  if (isGameOver) return;
  if (!lastTime) {
    lastTime = time;
    requestAnimationFrame(animateWorld);
    return;
  }
  const delta = time - lastTime;
  moveWorld(delta);
  updateSpeedScale(delta);
  lastTime = time;
  if (checkLose()) handleLose("Toooo Late To Press...");
  else requestAnimationFrame(animateWorld);
}

function moveWorld(delta) {
  incrementStyle(world, "--left", delta * speedScale * speed * -1);
}

function updateSpeedScale(delta) {
  speedScale += delta * incrementSpeedScale;
}

function checkLose() {
  return !isOnScreen(currentEl()) || getStyle(world, "--left") > world.width;
}

function currentEl() {
  return AllCharsEl[para.i];
}

function pressed(key) {
  currentEl().classList.remove("selected");
  if (para.isCorrect(key)) currentEl().classList.add("green");
  else currentEl().classList.add("red");
  const isNext = para.isNextWord();
  if (toSpeak && isNext) para.speakWord(para.currentWord);
  if (para.isEnded) return handleLose("Compeleted");
  if (para.isVoilated) return handleLose("Violated The Rules");
  currentEl().classList.add("selected");
  if (innerWidth > 600)
    detail.innerHTML = `
  Accuracy : ${((para.corrected / para.i) * 100).toFixed(2)}%<br>
  Completed : ${((para.i / para.length) * 100).toFixed(2)}%<br>
  Pressed : ${key}<br>
  `;
}
