import qs from './qs_rounds.js'
// import qs from './qs_original.js'

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
    const qObj = qs[parseInt(j) - 1][parseInt(round) - 1][i.toString() + '00']//is telling the computer to go and find some info and turning the string into a number and adding 00 to the end
    console.log(qObj)//overall its sayying find me this info and show it when i click on the element
})
}
}

    