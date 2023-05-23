const qs = require('./rounds.js');

let player1Points = 0
let player2Points = 0
let currentPlayer = 'Player 1'

// Function to close the modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  modal.style.display = 'none'
}

// Loop through rows and columns
for (let i = 1; i < 6; i++) {
  for (const div of document.querySelectorAll(`.r${i}`)) {
    const divClasses = div.className.split(' ')
    const colClass = divClasses.find(c => c.startsWith('c'))
    const j = colClass[1]
    const round = document.getElementById('round-num').innerText

    // Add click event listener to each div
    div.addEventListener('click', () => {
      const qObj = qs[parseInt(j) - 1][parseInt(round) - 1][i.toString() + '00']
      console.log(qObj)

      const modal = document.getElementById(`modal-r${i}c${j}`)
      modal.style.display = 'block'

      let span = modal.querySelector('.close')
      let btn = modal.querySelector('button')
      let input = modal.querySelector('input')
      let modalText = modal.querySelector('p')

      // Set the modal text to the corresponding question
      modalText.textContent = qObj.question

      // Button click handler to check the submitted answer and update points
      btn.onclick = function () {
        const submittedAnswer = input.value.trim().toLowerCase()
        const correctAnswer = qObj.answer.toLowerCase()

        if (submittedAnswer === correctAnswer) {
          // Answer is correct
          alert('Correct!')
          // Perform actions for a correct answer
          if (currentPlayer === 'Player 1') {
            player1Points++
          } else {
            player2Points++
          }
        } else {
          // Answer is incorrect
          alert('Incorrect!')
          //Inform result
        }

        // Update turn
        currentPlayer = currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1'

        // Update score display
        document.getElementById('player1-points').textContent = player1Points
        document.getElementById('player2-points').textContent = player2Points
        document.getElementById('current-turn').textContent = currentPlayer

        modal.style.display = 'none'
      }

      // Close button click handler to close the modal
      span.onclick = function () {
        modal.style.display = 'none'
      }

      // Close the modal when clicking outside the modal
      window.onclick = function (event) {
        if (event.target === modal) {
          modal.style.display = 'none'
        }
      }
    })
  }
}
