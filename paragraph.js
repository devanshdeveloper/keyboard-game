import { isAlphabet } from "./utility.js";

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
  subPara(start, end) {
    return this.p.substring(start, end);
  }
  isCorrect(key) {
    let bool = key === this.currentChar;
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
        this.timer = ((Date.now() - start) / 1000).toFixed(2);
        this.showTime.innerHTML = `Time : ${this.timer}s`;
      }, 100);
    }
    this.currentIndex++;
    this.paraIndex++;
    if (this.paragraph[this.paraIndex] === " ") {
      this.paraIndex++;
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
  getWPM() {
    return (this.wordIndex / (this.timer / 60)).toFixed(2);
  }
  stopTimer() {
    clearInterval(this.timerInterval);
  }
  getInsights() {
    let tempObj = {};
    for (let i = 0; i < this.paragraph.length; i++) {
      const e = this.paragraph[i];
      tempObj[e] = (tempObj[e] || 0) + 1;
    }
    return tempObj;
  }
}
