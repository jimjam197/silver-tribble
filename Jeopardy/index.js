import qs from './qs_rounds.js'
// import qs from './qs_rounds.js

for (let i = 1; i < 6; i++) {
    for (const div of document.querySelectorAll(`.r${i}`)) {
        // i is row number
        const divClasses = div.className.split(' ')
        // console.log(divClasses)

        // j is column number
        const colClass = divClasses.find(c => c.startsWith('c'))
        const j = colClass[1]

        const round = document.getElementById('round-num').innerText
        div.addEventListener('click', () => {
            // is telling the webpage to wait and listen for someone to click the div element
            const qObj = qs[parseInt(j) - 1][parseInt(round) - 1][i.toString() + '00']//This tells the computer to convert strings into numbers and mnus 1 from each and then adding 00 to the end of it
            console.log(qObj)//overall its sayying find me this info and show it when clicked on the element
        })
    }
}

// Get the modal
var modal = document.getElementById("myModal");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks on the button, open the modal
btn.onclick = function () {
    modal.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}