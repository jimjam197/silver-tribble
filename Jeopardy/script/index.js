import qs from './rounds.js';

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'none';
}

for (let i = 1; i < 6; i++) {
  for (const div of document.querySelectorAll(`.r${i}`)) {
    const divClasses = div.className.split(' ');
    const colClass = divClasses.find(c => c.startsWith('c'));
    const j = colClass[1];
    const round = document.getElementById('round-num').innerText;

    div.addEventListener('click', () => {
      const qObj = qs[parseInt(j) - 1][parseInt(round) - 1][i.toString() + '00'];
      console.log(qObj);

      const modal = document.getElementById(`modal-r${i}c${j}`);
      modal.style.display = 'block';

      let span = modal.querySelector('.close');
      let btn = modal.querySelector('button');

      btn.onclick = function () {
        modal.style.display = 'none';
      };

      span.onclick = function () {
        modal.style.display = 'none';
      };

      window.onclick = function (event) {
        if (event.target === modal) {
          modal.style.display = 'none';
        }
      };
    });
  }
}
