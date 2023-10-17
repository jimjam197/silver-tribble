import { getPlayerXName, getPlayerXPoints, setCurrentPlayer, switchPlayer } from './index';

document.addEventListener("DOMContentLoaded", function () {
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

  // Select the elements for the final question and modal
  const finalQuestionButton = document.getElementById("show-question-button");
  const finalQuestionText = document.getElementById("final-question");
  const modal = document.getElementById("final-modal");
  const modalContent = modal.querySelector(".modal-content");

  // Add an event listener to the "Show Question" button
  finalQuestionButton.addEventListener("click", function () {
    // Update the modal content with the final question
    modalContent.innerHTML = `<h2>Final Question</h2><p>${finalRoundQuestion.question}</p>`;
    showModal(); // Display the modal
  });

  function updateBetDisplays() {
    player1BetDisplay.textContent = `${player1Name}'s Bet: $${finalRoundQuestion.player1Bet}`;
    player2BetDisplay.textContent = `${player2Name}'s Bet: $${finalRoundQuestion.player2Bet}`;
  }

  function showModal() {
    modal.style.display = "block"; // Display the modal
  }

  // Add an event listener to a button for showing the answer
  const showAnswerButton = document.getElementById("show-answer-button");
  showAnswerButton.addEventListener("click", function () {
    finalAnswerElement.textContent = `Answer: ${finalRoundQuestion.answer}`;
  });
});
