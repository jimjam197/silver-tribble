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

if (document.getElementsByClassName("points-container").length > 0) {
  document.getElementById(
    "current-turn"
  ).textContent = `It's ${getCurrentPlayer()}'s turn`;
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

document.addEventListener("DOMContentLoaded", function () {
  const currentPlayerTurn = document.querySelector(".Player-turn p");
  const finalCategory = document.querySelector(".final-cat p");
  const finalQuestionButton = document.getElementById("show-answer-button"); // Update to select by ID
  const finalAnswerElement = document.querySelector(".final-answer p");
  const player1BetInput = document.getElementById("player1-bet-input");
  const player2BetInput = document.getElementById("player2-bet-input");
  const player1BetDisplay = document.getElementById("player1-bet-display");
  const player2BetDisplay = document.getElementById("player2-bet-display");
  const modal = document.getElementById("final-modal");
  const modalContent = modal.querySelector(".modal-content");

  // Initialize players' names and scores
  const player1Name = getPlayerXName(1);
  const player2Name = getPlayerXName(2);

  let currentPlayer = player1Name
    ? player1Name
    : player2Name
    ? player2Name
    : "Player 1";

  // Function to switch players
  function switchPlayer() {
    currentPlayer = currentPlayer === player1Name ? player2Name : player1Name;
    currentPlayerTurn.textContent = `It's ${currentPlayer}'s turn`;
  }

  // Set the current player's turn
  currentPlayerTurn.textContent = `It's ${currentPlayer}'s turn`;

  // Import the finalRoundQuestion object from rounds.js
  const finalRoundQuestion = {
    category: "Final",
    question: "What was the ideal party based on in 2E?",
    answer: "The Golden Girls",
    player1Bet: 0,
    player2Bet: 0,
  };

  // Set the final question from the finalRoundQuestion object
  finalQuestionButton.textContent = "Click to Reveal Final Question";

  // Add an event listener to the "Place Bets" button
  const placeBetButton = document.getElementById("place-bets-button"); // Update to select by ID
  placeBetButton.addEventListener("click", function () {
    const player1Bet = parseInt(player1BetInput.value, 10);
    const player2Bet = parseInt(player2BetInput.value, 10);

    if (!isNaN(player1Bet) && !isNaN(player2Bet)) {
      finalRoundQuestion.player1Bet = player1Bet;
      finalRoundQuestion.player2Bet = player2Bet;
      updateBetDisplays();
      showModal();
    } else {
      alert("Invalid bets. Please enter valid numbers for both players.");
    }
  });

  function updateBetDisplays() {
    player1BetDisplay.textContent = `${player1Name}'s Bet: $${finalRoundQuestion.player1Bet}`;
    player2BetDisplay.textContent = `${player2Name}'s Bet: $${finalRoundQuestion.player2Bet}`;
  }

  function showModal() {
    modal.style.display = "block"; // Display the modal
  }

  // Add an event listener to the "Click to Reveal Final Question" button
  finalQuestionButton.addEventListener("click", function () {
    finalQuestionButton.style.display = "none";
    showFinalQuestion();
  });

  function showFinalQuestion() {
    const questionText = document.createElement("p");
    questionText.textContent = finalRoundQuestion.question;
    modalContent.innerHTML = ""; // Clear previous content
    modalContent.appendChild(questionText);
  }

  // Add an event listener to a button for showing the answer
  const showAnswerButton = document.getElementById("show-answer-button"); // Update to select by ID
  showAnswerButton.addEventListener("click", function () {
    finalAnswerElement.textContent = `Answer: ${finalRoundQuestion.answer}`;
  });
});
