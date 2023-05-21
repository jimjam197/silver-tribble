import qs from 'rounds.js'
const rounds = require('./rounds.js');

const round = document.getElementById('round-num').innerText;

let player1Points = 0;
let player2Points = 0;
let currentPlayer = 'Player 1';

// Function to close the modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'none';
}

// Attach click event listener to the grid container
document.getElementById('grid-container').addEventListener('click', (event) => {
  const target = event.target;
  const isCell = target.classList.contains('grid-cell');
  if (!isCell) return;

  const row = target.dataset.row;
  const col = target.dataset.col;

  // Get the question object based on the row, column, and round
  const qObj = rounds[col - 1].categories[round - 1].questions[row - 1];
  console.log(qObj);

  const modal = document.getElementById(`modal-r${row}c${col}`);
  modal.style.display = 'block';

  const span = modal.querySelector('.close');
  const btn = modal.querySelector('button');
  const input = modal.querySelector('input');
  const modalText = modal.querySelector('p');

  // Set the modal text to the corresponding question
  modalText.textContent = qObj.question;

  // Button click handler to check the submitted answer and update points
  btn.addEventListener('click', () => {
    const submittedAnswer = input.value.trim().toLowerCase();
    const correctAnswer = qObj.answer.toLowerCase();

    if (submittedAnswer === correctAnswer) {
      // Answer is correct
      alert('Correct!');
      // Perform actions for a correct answer
      if (currentPlayer === 'Player 1') {
        player1Points++;
      } else {
        player2Points++;
      }
    } else {
      // Answer is incorrect
      alert('Incorrect!');
    }

    // Update turn
    currentPlayer = currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1';

    // Update score display
    document.getElementById('player1-points').textContent = player1Points;
    document.getElementById('player2-points').textContent = player2Points;
    document.getElementById('current-turn').textContent = currentPlayer;

    closeModal(`modal-r${row}c${col}`);
  });

  // Close button click handler to close the modal
  span.addEventListener('click', () => {
    closeModal(`modal-r${row}c${col}`);
  });

  // Close the modal when clicking outside the modal
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal(`modal-r${row}c${col}`);
    }
  });
});
