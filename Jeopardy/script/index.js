const qs = require("./rounds.js");

let player1Name = "";
let player2Name = "";
let currentPlayer = player1Name;
document.getElementById("start-game-button").addEventListener("click", () => {
  player1Name = document.getElementById("player1-name").value;
  player2Name = document.getElementById("player2-name").value;

  document.getElementById("player1-display").textContent = player1Name;
  document.getElementById("player2-display").textContent = player2Name;

  currentPlayer = player1Name;
  document.getElementById("current-player-display").textContent = currentPlayer;
  document.getElementById(
    "current-turn-display"
  ).textContent = `It's ${currentPlayer}'s turn`;
});

let player1Points = 0;
let player2Points = 0;
let currentRound = 1;
let selectedQuestions = [];

for (let i = 0; i < 5; i++) {
  selectedQuestions[i] = [];
  for (let j = 0; j < 6; j++) {
    selectedQuestions[i][j] = false;
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "none";
}
function displayQuestion(i, j) {
  if (selectedQuestions[i - 1][j - 1]) {
    return;
  }
  const qObj = qs[j - 1][currentRound - 1][i.toString() + "00"];
  const modal = document.getElementById(`modal-r${i}c${j}`);
  modal.style.display = "block";

  const span = modal.querySelector(".close");
  const btn = modal.querySelector("button");
  const input = modal.querySelector("input");
  const modalText = modal.querySelector("p");

  modalText.textContent = qObj.question;

  btn.onclick = function () {
    const submittedAnswer = input.value.trim().toLowerCase();
    const correctAnswer = qObj.answer.toLowerCase();

    if (submittedAnswer === correctAnswer) {
      alert("Correct!");

      if (qObj.isDailyDouble) {
        if (currentPlayer === player1Name) {
          player1Points += qObj.points * 2;
        } else {
          player2Points += qObj.points * 2;
        }
      } else {
        if (currentPlayer === player1Name) {
          player1Points += qObj.points;
        } else {
          player2Points += qObj.points;
        }
      }

      document.getElementById("player1-points").textContent = player1Points;
      document.getElementById("player2-points").textContent = player2Points;

      currentPlayer = currentPlayer === player1Name ? player2Name : player1Name;

      document.getElementById(
        "current-turn-display"
      ).textContent = `It's ${currentPlayer}'s turn`;

      modal.style.display = "none";
      endRound();
    } else {
      alert("Incorrect!");

      currentPlayer = currentPlayer === player1Name ? player2Name : player1Name;

      document.getElementById(
        "current-turn-display"
      ).textContent = `It's ${currentPlayer}'s turn`;
    }
  };

  span.onclick = function () {
    modal.style.display = "none";
  };
}

function passQuestion(i, j) {
  if (currentPlayer === "Player 1") {
    currentPlayer = "Player 2";
  } else {
    currentPlayer = "Player 1";
  }

  document.getElementById("current-turn").textContent = currentPlayer;
  player1Points -= 100;
  player2Points -= 100;

  document.getElementById("player1-points").textContent = player1Points;
  document.getElementById("player2-points").textContent = player2Points;

  closeModal(`modal-r${i}c${j}`);
}

function endRound() {
  if (isBoardCleared() && currentRound < 2) {
    alert(`Move on to Round ${currentRound + 1}`);
    currentRound++;
    document.getElementById("round-num").textContent = currentRound;
    enableNextRoundButton();
  } else if (currentRound === 2 && isBoardCleared()) {
    alert("End of the game. Determine the winner.");
    determineWinner();
  }
}

function isBoardCleared() {
  for (let i = 0; i < selectedQuestions.length; i++) {
    for (let j = 0; j < selectedQuestions[i].length; j++) {
      if (!selectedQuestions[i][j]) {
        return false;
      }
    }
  }
  return true;
}
function determineWinner() {
  let winner;
  if (player1Points > player2Points) {
    winner = "Player 1";
  } else if (player2Points > player1Points) {
    winner = "Player 2";
  } else {
    winner = "It's a tie!";
  }

  alert(`${winner} wins!`);
}

function enableNextRoundButton() {
  if (currentRound === 2) {
    document.getElementById("round2Button").disabled = false;
  }
}
for (let i = 1; i < 6; i++) {
  for (let j = 1; j < 7; j++) {
    const gridItem = document.querySelector(`.q.r${i}.c${j}`);
    gridItem.addEventListener("click", () => {
      if (!selectedQuestions[i - 1][j - 1]) {
        selectedQuestions[i - 1][j - 1] = true;
        displayQuestion(i, j);
      }
    });
  }
}

for (let i = 1; i < 6; i++) {
  for (let j = 1; j < 7; j++) {
    const passButton = document.querySelector(`.pass.r${i}.c${j}`);
    passButton.addEventListener("click", () => {
      passQuestion(i, j);
    });
  }
}

function resetBoard() {
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      selectedQuestions[i][j] = false;
      const gridItem = document.querySelector(`.q.r${i + 1}.c${j + 1}`);
      gridItem.classList.remove("selected");
    }
  }

  currentRound = 1;
  document.getElementById("round-num").textContent = currentRound;

  currentPlayer = "Player 1";
  document.getElementById("current-turn").textContent = currentPlayer;
}

document.getElementById("round2Button").addEventListener("click", () => {
  if (currentRound === 1 && isBoardCleared()) {
    currentRound = 2;
    document.getElementById("round-num").textContent = currentRound;
    document.getElementById("round2Button").disabled = true;
    resetBoard();
  }
});

document.getElementById("finalRoundButton").addEventListener("click", () => {
  if (currentRound === 2 && isBoardCleared()) {
    currentRound = 3;
    document.getElementById("round-num").textContent = currentRound;
    document.getElementById("finalRoundButton").disabled = true;
    resetBoard();
  }
});
