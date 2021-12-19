import { Paragraph } from "./paragraph.js";
import {
  getStyle,
  incrementStyle,
  isAlphabet,
  randomText,
  isOnScreen,
  randomNumberBetween,
  setStyle,
} from "./utility.js";
// variables
let para,
  lastTime,
  AllCharsEl,
  speed,
  incrementSpeedScale,
  toSpeak,
  speedScale = 1;
// elements
const startScreen = document.querySelector(".startScreen");
const wrapper = document.querySelector(".wrapper");
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
  wrapper.style.display = "none";
  let queryPara = new URL(location).searchParams.get("para");
  if (queryPara) handleStart(queryPara, 1, 1, false);
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
function handleStart(text, paraSpeed, paraSpeedScale, paraToSpeak) {
  if (text.length < 2000) para = new Paragraph(text);
  else alert("Text Limit : 2000");
  speed = paraSpeed / 100;
  incrementSpeedScale = paraSpeedScale / 80000;
  startScreen.style.display = "none";
  world.style.display = "flex";
  toSpeak = paraToSpeak;
  createWorld();
  requestAnimationFrame(animateWorld);
  addEventListener("keydown", handlePress);
  if (toSpeak) para.speakWord(para.currentWord);
}

function handleLose() {
  para.stopTimer();
  wrapper.style.display = "flex";
  modal.innerHTML = `
  <span>Accuracy : ${((para.corrected / para.i) * 100).toFixed(2)}%<br>
  Completed : ${((para.i / para.length) * 100).toFixed(2)}%<br>
  WPM : ${para.getWPM()}<br>
  Time : ${para.timer}s<br></span>
  <button>Restart</button>`;
  modal
    .getElementsByTagName("button")[0]
    .addEventListener("click", () => location.reload());
  removeEventListener("keydown", handlePress);
}

function handlePress(e) {
  const { key } = e;
  if (key === " ") moveWorld(200);
  else if (isAlphabet(key)) pressed(key);
}

/*
functions
*/
// world
function createWorld() {
  let left = innerWidth;
  let prevWidth = 0;
  para.words.forEach((word) => {
    const wordDiv = document.createElement("div");
    word.split("").forEach((char) => {
      const charDiv = document.createElement("div");
      charDiv.classList.add("char");
      charDiv.innerText = char;
      wordDiv.append(charDiv);
    });
    world.append(wordDiv);
    wordDiv.classList.add("word");
    setStyle(wordDiv, "--top", randomNumberBetween(50, innerHeight - 100));
    left += randomNumberBetween(50, 75) + prevWidth;
    prevWidth = wordDiv.offsetWidth;
    setStyle(wordDiv, "--left", left);
  });
  world.style.width = left + prevWidth + innerWidth + "px";
  AllCharsEl = document.querySelectorAll(".char");
  currentEl().classList.add("selected");
}

function animateWorld(time) {
  if (!lastTime) {
    lastTime = time;
    requestAnimationFrame(animateWorld);
    return;
  }
  const delta = time - lastTime;
  moveWorld(delta);
  updateSpeedScale(delta);
  lastTime = time;
  if (!checkLose()) requestAnimationFrame(animateWorld);
  else handleLose();
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
  if (para.isEnded) return handleLose();
  currentEl().classList.add("selected");
  detail.innerHTML = `
  Accuracy : ${((para.corrected / para.i) * 100).toFixed(2)}%<br>
  Completed : ${((para.i / para.length) * 100).toFixed(2)}%<br>
  WPM : ${para.getWPM()}<br>
  `;
}
