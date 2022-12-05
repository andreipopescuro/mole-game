const holes = document.querySelectorAll(".hole");
const scoreBoard = document.querySelector(".score");
const moles = document.querySelectorAll(".mole");
const startButton = document.querySelector(".start-btn");
const ol = document.querySelector("#ol");
const newScore = document.querySelector("h3");
const newSpan = document.querySelector("#ns");
const form = document.querySelector("#form");
const leaderboard = document.querySelector(".leaderboard");
const toggleLeadebord = document.querySelector(".expand");
const selection = document.querySelector("#level");
const arrowAnimate = document.querySelector(".arrow-left");
let timeDOM = document.querySelector("#time");
let bestScoreDiv = document.querySelector(".best-score");
const userName = document.querySelector("#input");
const formSubmitBtn = document.querySelector("#form-sub");
const animationArrow = document.querySelector(".animation-arrow");

formSubmitBtn.disabled = true;
let bestScore = localStorage.getItem("best-score") || bestScoreDiv.textContent;
bestScoreDiv.textContent = bestScore;

let choose = "easy";
let difficutyChosen;
let showTimeLeft;
let lastHole;
let timeUp = false;
const GAMETIME = 25000;
let score = 0;

function takeDificulty() {
  choose = selection.value;
}

function setLevel(chosen) {
  switch (chosen) {
    case "hard":
      return randomTime(200, 250);
      break;
    case "medium":
      return randomTime(350, 550);
      break;
    case "easy":
      return randomTime(600, 750);
      break;
  }
}

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];
  if (hole === lastHole) {
    console.log("Ah nah thats the same one bud");
    return randomHole(holes);
  }
  lastHole = hole;
  return hole;
}

function peep() {
  const time = setLevel(choose);
  const hole = randomHole(holes);
  hole.classList.add("up");
  setTimeout(() => {
    hole.classList.remove("up");
    if (!timeUp) peep();
  }, time);
}

function startGame() {
  if (leaderboard.classList.contains("active")) {
    leaderboard.classList.remove("active");
  }
  timeDOM.style.color = "white";
  difficutyChosen = choose;
  bestScoreDiv.classList.remove("new-best");
  newScore.classList.remove("new-best-score");
  startButton.classList.remove("inactive");
  newSpan.classList.remove("new");
  newSpan.textContent = "";
  timeDOM.textContent = "25";

  // arrowAnimate.style.animation = "none";
  toggleLeadebord.removeEventListener("click", leaderboardAction);
  arrowAnimate.style.display = "none";
  scoreBoard.textContent = 0;
  timeUp = false;
  score = 0;
  peep();
  setTimeout(() => {
    timeUp = true;
    clearInterval(showTimeLeft);
    if (parseInt(score) > parseInt(bestScore)) {
      bestScoreDiv.classList.add("new-best");
      newScore.classList.add("new-best-score");
      newSpan.textContent = "NEW";
      newSpan.classList.add("new");
    }
    // arrowAnimate.style.animation = "move-left 1s infinite";
    arrowAnimate.style.display = "inline-block";
    formSubmitBtn.disabled = false;
    toggleLeadebord.addEventListener("click", leaderboardAction);
    startButton.classList.add("inactive");
  }, GAMETIME);
  moles.forEach((mole) => mole.addEventListener("click", bonk));
}

function bonk(e) {
  if (!e.isTrusted) return; // cheater!
  score++;
  this.parentNode.classList.remove("up");
  scoreBoard.textContent = score;
  if (parseInt(score) > parseInt(bestScore)) {
    console.log(parseInt(score) > parseInt(bestScore));
    bestScoreDiv.textContent = score;
    localStorage.setItem("best-score", bestScoreDiv.textContent);
  }
}

startButton.addEventListener("click", function () {
  this.disabled = true;
  selection.disabled = true;
  left.style.display = "inline-block";
  showTimeLeft = setInterval(() => {
    let time = timeDOM.textContent;
    time--;
    timeDOM.innerText = time;
    if (Number(timeDOM.innerText) < 10) timeDOM.style.color = "red";
    else timeDOM.style.color = "green";
  }, 999);
  setTimeout(() => {
    this.disabled = false;
    selection.disabled = false;
    formSubmitBtn.disabled = false;
    moles.forEach((mole) => mole.removeEventListener("click", bonk));
  }, GAMETIME);
});

function toggleForm(e) {
  e.preventDefault();
  formSubmitBtn.disabled = true;
  saveScore();
  input.value = "";
}
selection.addEventListener("change", takeDificulty);

function leaderboardAction() {
  leaderboard.classList.toggle("active");
  if (leaderboard.classList.contains("active")) {
    animationArrow.style.display = "none";
    ol.innerHTML = `<div id="head">
    <div class="head-info">
      <span>Nr.</span>
      <span id="space">Name</span>
      <span>Score</span>
      <span>Level</span>
    </div>
  </div>`;
    loadScoreboard();

    window.scrollTo({
      top: leaderboard.offsetTop,
      behavior: "smooth",
    });
  } else {
    animationArrow.style.display = "inline-block";
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}
toggleLeadebord.addEventListener("click", leaderboardAction);
startButton.addEventListener("click", startGame);
form.addEventListener("submit", toggleForm);
//
//
//
//
//
//
//
//
//

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";

import {
  addDoc,
  collection,
  getFirestore,
  query,
  limit,
  onSnapshot,
  orderBy,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDSm4QY6aOuZ4j2TI3RHgm67LHEA-r0kAY",
  authDomain: "mole-game-840fc.firebaseapp.com",
  databaseURL:
    "https://mole-game-840fc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mole-game-840fc",
  storageBucket: "mole-game-840fc.appspot.com",
  messagingSenderId: "369601063587",
  appId: "1:369601063587:web:729d9e5c7d693f4469ad16",
  measurementId: "G-GX0XGT3SJY",
};

const app = initializeApp(firebaseConfig);

async function saveScore() {
  const currentScore = scoreBoard.innerText;
  // Add a new message entry to the Firebase database.
  try {
    await addDoc(collection(getFirestore(), "users"), {
      name: userName.value,
      score: Number(currentScore),
      level: difficutyChosen,
    });
  } catch (error) {
    console.error("Error writing new message to Firebase Database", error);
  }
}
function loadScoreboard() {
  const recentScore = query(
    collection(getFirestore(), "users"),
    orderBy("score", "desc"),
    limit(25)
  );
  onSnapshot(recentScore, function (snapshot) {
    snapshot.docChanges().forEach(function (change) {
      let currentNewScore = change.doc.data();
      displayScore(
        currentNewScore.name,
        currentNewScore.score,
        currentNewScore.level
      );
    });
  });
}

function displayScore(name, score, level) {
  const resp = query(collection(getFirestore(), "users"));

  let newLine = document.createElement("li");
  const newLineDiv = document.createElement("div");
  newLineDiv.classList.add("wrapper-info");
  const playerName = document.createElement("span");
  const playerScore = document.createElement("span");
  const playerDifficuty = document.createElement("span");
  playerName.innerText = name;
  playerScore.innerText = score;
  playerDifficuty.innerText = level;
  newLineDiv.appendChild(playerName);
  newLineDiv.appendChild(playerScore);
  newLineDiv.appendChild(playerDifficuty);
  newLine.appendChild(newLineDiv);
  ol.appendChild(newLine);
}
