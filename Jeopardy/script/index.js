import { qs } from "./rounds.js";

//Shortcuts to session storage
function getPlayerXName(playerId) {
  return window.sessionStorage.getItem(`player${playerId}Name`);
}
function setPlayerXName(playerId, value) {
  window.sessionStorage.setItem(`player${playerId}Name`, value);
}
function getPlayerXPoints(playerId) {
  return parseInt(window.sessionStorage.getItem(`player${playerId}Points`), 10);
}
function setPlayerXPoints(playerId, value) {
  window.sessionStorage.setItem(`player${playerId}Points`, value);
}
function getCurrentPlayer() {
  return window.sessionStorage.getItem("currentPlayer");
}
function setCurrentPlayer(value) {
  window.sessionStorage.setItem("currentPlayer", value);
}
function switchPlayer() {
  setCurrentPlayer(
    getCurrentPlayer() === getPlayerXName(1)
      ? getPlayerXName(2)
      : getPlayerXName(1)
  );
}

document.getElementById("start-game-button")?.addEventListener("click", () => {
  // clear session storage to avoid keeping old data
  window.sessionStorage.clear();

  let player1Name = document.getElementById("player1-name").value;
  let player2Name = document.getElementById("player2-name").value;

  setPlayerXName(1, player1Name);
  setPlayerXName(2, player2Name);

  // Initializing points
  setPlayerXPoints(1, 0);
  setPlayerXPoints(2, 0);
  setCurrentPlayer(player1Name);

  window.location.href = "Round.1.html";
});

// Only set the scoreboard if we are on a round page (contains div with class points-container)
if (document.getElementsByClassName("points-container").length > 0) {
  document.getElementById(
    "current-turn"
  ).textContent = `It's ${getCurrentPlayer()}'s turn`; // VITO had to change from current-turn-display to current-turn
  document.getElementById("player1-display").textContent = getPlayerXName(1);
  document.getElementById("player2-display").textContent = getPlayerXName(2);
}

let currentRound = 1;
let selectedQuestions = [];

for (let i = 0; i < 5; i++) {
  selectedQuestions[i] = [];
  for (let j = 0; j < 6; j++) {
    selectedQuestions[i][j] = false;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  for (let i = 1; i <= 5; i++) {
    for (let j = 1; j <= 6; j++) {
      const gridItem = document.querySelector(`.q.r${i}.c${j}`);
      gridItem?.addEventListener("click", () => {
        if (!selectedQuestions[i - 1][j - 1]) {
          displayQuestion(i, j);
          selectedQuestions[i - 1][j - 1] = true;
          gridItem.classList.add("selected"); // Add a class to mark selected questions
        }
      });
    }
  }
});

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
        if (getCurrentPlayer() === getPlayerXName(1)) {
          setPlayerXPoints(1, getPlayerXPoints(1) + qObj.points * 2);
        } else {
          setPlayerXPoints(2, getPlayerXPoints(2) + qObj.points * 2);
        }
      } else {
        if (getCurrentPlayer() === getPlayerXName(1)) {
          console.log("setting p1 pts", qObj.points);
          setPlayerXPoints(1, getPlayerXPoints(1) + qObj.points);
        } else {
          setPlayerXPoints(2, getPlayerXPoints(2) + qObj.points);
        }
      }

      document.getElementById("player1-points").textContent =
        getPlayerXPoints(1);
      document.getElementById("player2-points").textContent =
        getPlayerXPoints(2);

      switchPlayer();

      document.getElementById(
        "current-turn"
      ).textContent = `It's ${getCurrentPlayer()}'s turn`;

      modal.style.display = "none";
      endRound();
    } else {
      alert("Incorrect!");

      switchPlayer();

      document.getElementById(
        "current-turn"
      ).textContent = `It's ${getCurrentPlayer()}'s turn`;
    }
  };

  span.onclick = function () {
    modal.style.display = "none";
  };
}

function passQuestion(i, j) {
  switchPlayer();

  document.getElementById("current-turn").textContent = getCurrentPlayer();
  setPlayerXPoints(1, getPlayerXPoints(1) - 100);
  setPlayerXPoints(2, getPlayerXPoints(2) - 100);

  document.getElementById("player1-points").textContent = getPlayerXPoints(1);
  document.getElementById("player2-points").textContent = getPlayerXPoints(2);

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
    const passButton = document.querySelector(`.pass.r${i}.c${j}`);
    passButton?.addEventListener("click", () => {
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

document.getElementById("round2Button")?.addEventListener("click", () => {
  if (currentRound === 1 && isBoardCleared()) {
    currentRound = 2;
    document.getElementById("round-num").textContent = currentRound;
    document.getElementById("round2Button").disabled = true;
    resetBoard();
  }
});

document.getElementById("finalRoundButton")?.addEventListener("click", () => {
  if (currentRound === 2 && isBoardCleared()) {
    currentRound = 3;
    document.getElementById("round-num").textContent = currentRound;
    document.getElementById("finalRoundButton").disabled = true;
    resetBoard();
  }

});

document.addEventListener("DOMContentLoaded", function () {
  const currentPlayerTurn = document.querySelector(".Player-turn p");
  const finalCategory = document.querySelector(".final-cat p");
  const finalQuestion = document.querySelector(".final-question p");
  const finalAnswer = document.querySelector(".final-answer p");
  const betAmount = document.querySelector(".bet-amount p");

  // Set the current player's turn
  currentPlayerTurn.textContent = `It's ${getCurrentPlayer()}'s turn`;

  // Import the finalRoundQuestion object from rounds.js
  const finalRoundQuestion = {
    category: "Final",
    question: "What was the ideal party based on in 2E?",
    answer: "The Golden Girls",
    bet: 0, // Initialize the bet to 0
  };

  // Set the final category and question from the finalRoundQuestion object
  finalCategory.textContent = finalRoundQuestion.category;
  finalQuestion.textContent = finalRoundQuestion.question;

  
  // Set the bet amount from the finalRoundQuestion object
  betAmount.textContent = `Bet: $${finalRoundQuestion.bet}`;

  // Add an event listener to the "Place Bet" button
  const placeBetButton = document.getElementById("place-bet-button");
  placeBetButton.addEventListener("click", function () {
    // Get the bet amount from the input field
    const betInput = document.getElementById("bet-amount"); // Updated ID here
    const bet = parseInt(betInput.value, 10);

    if (!isNaN(bet)) {
      finalRoundQuestion.bet = bet; // Update the bet amount
      betAmount.textContent = `Bet: $${finalRoundQuestion.bet}`;
    } else {
      alert("Invalid bet. Please enter a valid number.");
    }
  });

});
