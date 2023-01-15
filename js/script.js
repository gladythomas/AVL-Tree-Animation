//For typewritingeffect
const textDisplay = document.getElementById("answer");
const phrases = [
  "AVL tree is a self-balancing Binary Search Tree (BST) where the difference between heights of left and right subtrees cannot be more than one for all nodes.",
];
let i = 0;
let j = 0;
let currentPhrase = [];
const loop = function () {
  textDisplay.innerHTML = currentPhrase.join("");
  if (i < phrases.length) {
    if (j < phrases[i].length) {
      currentPhrase.push(phrases[i][j]);
      j++;
    }
    if (j == phrases[i].length) {
      i++;
    }
  }
  setTimeout(loop, 50);
};
loop();

//ScrollReveal
ScrollReveal().reveal(".container", { delay: 500 });
