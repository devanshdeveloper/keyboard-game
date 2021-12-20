export const randomText =
  "Computers are like bikinis. They save people a lot of guesswork. Technology is a word that describes something that doesn’t work yet. Science and technology revolutionize our lives, but memory, tradition and myth frame our response. The human spirit must prevail over technology. Technology has to be invented or adopted. The problem with Google is you have 360 degrees of omnidirectional information on a linear basis, but the algorithms for irony and ambiguity are not there. And those are the algorithms of wisdom. The greatest achievement of humanity is not its works of art, science, or technology, but the recognition of its own dysfunction. Computers are useless. They can only give you answers. First we thought the PC was a calculator. Then we found out how to turn numbers into letters with ASCII — and we thought it was a typewriter. Then we discovered graphics, and we thought it was a television. With the World Wide Web, we’ve realized it’s a brochure. The great myth of our times is that technology is communication. We are stuck with technology when what we really want is just stuff that works. Technology is the campfire around which we tell our stories. TV and the Internet are good because they keep stupid people from spending too much time out in public. This is why I loved technology: if you used it right, it could give you power and privacy. Technology is nothing. What’s important is that you have a faith in people, that they’re basically good and smart, and if you give them tools, they’ll do wonderful things with them. The art challenges the technology, and the technology inspires the art. Just because something doesn’t do what you planned it to do doesn’t mean it’s useless. It is through science that we prove, but through intuition that we discover. Humanity is acquiring all the right technology for all the wrong reasons. All of our technology is completely unnecessary to a happy life."
    .split(". ")
    .sort(() => Math.random() - 0.5)
    .join(". ")
    .substring(0, 1000);
export function getStyle(elem, prop) {
  return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0;
}

export function setStyle(elem, prop, value) {
  elem.style.setProperty(prop, value);
}

export function incrementStyle(elem, prop, inc) {
  setStyle(elem, prop, getStyle(elem, prop) + inc);
}

export function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function isAlphabet(char) {
  return `abcdefghijklmnopqrstuvwxyz,.?';:1234567890!@#$%^&*()" `.includes(
    char.toLowerCase()
  );
}

export function isOnScreen(el) {
  return el.getBoundingClientRect().x + 50 > 0;
}

export function lsItem(key, value) {
  if (value) localStorage.setItem(key, JSON.stringify(value));
  else {
    let temp = localStorage.getItem(key);
    if (temp) return JSON.parse(temp);
  }
}

class Modal {
  constructor({ heading = "", text, btns = [] } = {}) {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("wrapper");
    if (heading) {
      const headingEl = document.createElement("span");
      headingEl.innerHTML = heading;
      this.wrapper.append(headingEl);
    }
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = text;
    const btnDiv = document.createElement("div");
    btns.forEach(({ text, onclick }) => {
      const btn = document.createElement("button");
      btn.innerText = text;
      btn.addEventListener("click", () => {
        this.wrapper.remove();
        onclick();
      });
      btnDiv.append(btn);
    });
    modal.append(btnDiv);
    this.wrapper.append(modal);
    document.body.append(this.wrapper);
  }
}

export function useModal({
  heading = "",
  text = "",
  btns = [{ text: "Close", onclick: () => {} }],
} = {}) {
  return new Modal({ heading, text, btns });
}
