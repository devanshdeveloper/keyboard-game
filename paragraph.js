import { isAlphabet, lsItem } from "./utility.js";

export class Paragraph {
  constructor(paragraph) {
    this.paraIndex = 0;
    this.wordIndex = 0;
    this.evalPra(paragraph);
    this.corrected = 0;
    this.currentIndex = 0;
    this.contiIncorrect = 0;
    this.isVoilated = false;
    this.showTime = document.getElementById("showTime");
    this.highestWPMEL = document.getElementById("highestWPM");
    const lsWPM = lsItem("wpm");
    if (lsWPM) this.hiWPM = +lsWPM;
    else this.hiWPM = 0;
  }
  get isEnded() {
    return this.length < this.i + 1;
  }
  get length() {
    return this.paragraphWithoutSpaces.length;
  }
  get p() {
    return this.paragraph;
  }
  get i() {
    return this.currentIndex;
  }
  get currentChar() {
    return this.paragraphWithoutSpaces[this.i];
  }
  get currentWord() {
    return this.words[this.wordIndex];
  }
  get wpm() {
    if (this.i < 10) return;
    return (this.wordIndex / (this.timer / 60)).toFixed(2);
  }
  subPara(start, end) {
    return this.p.substring(start, end);
  }
  set hiWPM(value) {
    if (!value || isNaN(value)) return;
    this.highestWPMEL.innerText = `Highest WPM : ${value}`;
    this.highestWPM = +value;
  }
  isCorrect(key) {
    const bool = key === this.currentChar;
    if (bool) {
      this.corrected++;
      this.contiIncorrect = 0;
    } else {
      this.contiIncorrect++;
      if (this.contiIncorrect > 10) this.isVoilated = true;
    }
    return bool;
  }
  isNextWord() {
    if (this.currentIndex === 0) {
      var start = Date.now();
      this.timerInterval = setInterval(() => {
        const wpm = this.wpm || "";
        this.timer = ((Date.now() - start) / 1000).toFixed(2);
        this.showTime.innerHTML = `WPM : ${wpm}<br>Time : ${this.timer}s`;
        if (+wpm > this.highestWPM) this.hiWPM = wpm;
      }, 100);
    }
    this.currentIndex++;
    this.paraIndex++;
    if (this.paragraph[this.paraIndex] === " ") {
      this.paraIndx++;
      this.wordIndex++;
      return true;
    }
    return false;
  }
  evalPra(str) {
    this.words = [];
    this.paragraphWithoutSpaces = "";
    this.paragraph = "";
    let tempString = "";
    for (let i = 0; i < str.length; i++) {
      const e = str[i];
      if (isAlphabet(e)) {
        this.paragraph += e;
        if (e === " ") {
          if (tempString) this.words.push(tempString);
          tempString = "";
        } else {
          this.paragraphWithoutSpaces += e;
          tempString += e;
          if (i === str.length - 1 && tempString) this.words.push(tempString);
        }
      }
    }
  }
  speakWord(word) {
    speechSynthesis.speak(new SpeechSynthesisUtterance(word));
  }
  stopTimer() {
    clearInterval(this.timerInterval);
  }
  reset() {
    this.showTime.innerText = "";
    this.timer = 0;
    this.paraIndex = 0;
    this.wordIndex = 0;
    this.corrected = 0;
    this.currentIndex = 0;
    this.contiIncorrect = 0;
    this.isVoilated = false;
  }
}
