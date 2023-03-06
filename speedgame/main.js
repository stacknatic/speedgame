const score = document.querySelector('#score')
const gameScore = document.querySelector('#game-score')
const symbols = document.querySelectorAll('.symbol')
const symbol1 = document.querySelector('.symbol1')
const symbol2 = document.querySelector('.symbol2')
const symbol3 = document.querySelector('.symbol3')
const symbol4 = document.querySelector('.symbol4')
const start = document.querySelector('#start')
const end = document.querySelector('#stop')

const startLabel = document.querySelector('.start-button')
const endLabel = document.querySelector('.end-button')

let point = 0

let rounds = 0

let timeout = 1000

const modalClose = document.querySelector('.modal-close-button')

const modalContainer = document.querySelector('.modal-container')

const feedback = document.querySelector('.feedback')

const fastShutter = document.querySelector('#fast-shutter')

const slowShutter = document.querySelector('#slow-shutter')

fastShutter.playbackRate = 1.0

let intervalId = setInterval(timer, timeout)
function timer () {
  if (start.checked === true) {
    for (const each of symbolsArray) {
      each.disabled = false
    }
    startLabel.style.display = 'none'
    endLabel.style.display = 'block'

    end.checked = false
    shuffle()
    clearInterval(intervalId)
    timeout -= 5
    fastShutter.playbackRate += 0.025

    intervalId = setInterval(timer, timeout)

    rounds++
  } else if (end.checked === true) {
    if (rounds >= 1) {
      modalContainer.classList.add('visible')
      gameScore.textContent = `You took ${point} shots.`
      feedbackMessage()
    }
    endLabel.style.display = 'none'
    startLabel.style.display = 'block'

    clearInterval(intervalId)
    score.textContent = point

    for (const each of symbolsArray) {
      each.disabled = true
    }
    rounds = 0
    point = 0
  }

  if (rounds - point >= 4) {
    end.checked = true
    start.checked = false
    clearInterval(intervalId)
    fastShutter.playbackRate = 0.25
    timeout = 1000
    slowShutter.play()
    for (const each of symbolsArray) {
      each.disabled = true
    }
    endLabel.style.display = 'none'
    startLabel.style.display = 'block'

    modalContainer.classList.add('visible')

    gameScore.textContent = `You took ${point} shots.`

    feedbackMessage()

    score.textContent = 0

    rounds = 0
    point = 0
  }
}

start.addEventListener('change', timer)
end.addEventListener('change', timer)

const symbolsArray = [symbol1, symbol2, symbol3, symbol4]

let active = 0

function shuffle () {
  let newNumber = 0
  newNumber = Math.floor(Math.random(symbolsArray.length) * 4)

  switch (randomNumber()) {
    case 0:
      resetSymbol()
      symbol1.classList.add('pic')

      symbol1.value = 0
      active = 0

      break
    case 1:
      resetSymbol()

      symbol2.classList.add('pic')

      symbol2.value = 1
      active = 1

      break
    case 2:
      resetSymbol()

      symbol3.classList.add('pic')

      symbol3.value = 2
      active = 2

      break
    case 3:
      resetSymbol()

      symbol4.classList.add('pic')

      symbol4.value = 3
      active = 3

      break
  }
  function randomNumber () {
    while (newNumber === active) {
      newNumber = Math.floor(Math.random(symbolsArray.length) * 3)
    }
    return newNumber
  }
}

for (const each of symbolsArray) {
  each.addEventListener('click', checkPick)
}

function checkPick () {
  if (start.checked === true && +this.value === active) {
    this.disabled = true
    fastShutter.play()

    point++
    score.textContent = point
  } else if (start.checked === true && this.value !== active) {
    clearInterval(intervalId)
    slowShutter.play()
    fastShutter.playbackRate = 0.25
    score.textContent = 0

    modalContainer.classList.add('visible')
    gameScore.textContent = `You took ${point} shots.`

    feedbackMessage()

    timeout = 1000
    start.checked = false
    end.checked = true
    endLabel.style.display = 'none'
    startLabel.style.display = 'block'

    rounds = 0
    point = 0

    for (const each of symbolsArray) {
      each.disabled = true
    }
  }
}

const resetSymbol = () => {
  for (const symbol of symbols) {
    symbol.style.backgroundColor = 'gray'
    symbol.classList.remove('pic')

    symbol.value = 5
  }
}

const closeModal = () => {
  modalContainer.classList.remove('visible')
}

const feedbackMessage = () => {
  if (point < 10) {
    feedback.textContent = "You're kinda slow"
  } else if (point > 10 && point < 20) {
    feedback.textContent = 'Fair, but you could do better!'
  } else if (point > 20 && point < 30) {
    feedback.textContent = 'Well aimed!'
  } else if (point > 30 && point < 40) {
    feedback.textContent = 'Good focus!'
  } else {
    feedback.textContent = 'Nice and steady shots!'
  }
}

modalClose.addEventListener('click', closeModal)
