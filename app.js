/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided 'shuffle' method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

let cardList = ['anchor', 'bicycle', 'bolt', 'bomb', 'cube', 'diamond', 'leaf', 'paper-plane-o'];
cardList = cardList.concat(cardList);

//Variables
const gameBoardElement = document.querySelector('.game-board');
const moveCountElement = document.querySelector('.moves');
const starCountElement = document.querySelector('.stars');
const timeElapsedElement = document.querySelector('.time-elapsed');

let moveCount = 0;
let starCount = 3;
let lastCardFlipped = null;
let flipOpenCardsTimeout = null;
let startTime = null;
let timerInterval = null;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {

    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
/*
 * Overview:
 * 1. Shuffle the deck array.
 * 2. Clear the visible deck/gameboard in the HTML.
 * For each card in the deck:
 *   3. Create an <li class='card'></li> element to represent the card.
 *   4. Add a click handler to that element.
 *   5. Create an <i class='fa fa-{card}'></i> element to represent the card's icon.
 *   6. Append the <i> (icon) to the <li> (card).
 *   7. Append the fully assembled card <li> to the visible deck/gameboard in the HTML.
 */

//Elapse time
function displayTimeElapsed() {
let elapsedMs = 0;
if (startTime) {
elapsedMs = new Date() - startTime;
}
const elapsed = new Date(0);
elapsed.setUTCMilliseconds(elapsedMs);
timeElapsedElement.innerHTML = elapsed.toISOString().substr(11, 8);
}
//Move count
function displayMoveCount() {
moveCountElement.innerHTML = moveCount;
}
//Star count
function updateStarCount() {
starCount = 3;
if (moveCount > 12) {
    starCount--;
    if (moveCount > 24) {
    starCount--;
    }
}

starCountElement.innerHTML = '';

for (let i = 0; i < starCount; i++) {
    const starElement = document.createElement('li');
    const starElementIcon = document.createElement('i');
    starElementIcon.classList.add('fa', 'fa-star');
    starElement.appendChild(starElementIcon)
    starCountElement.appendChild(starElement);
}
}
//Stop time
function stopTimer() {
if (timerInterval) {
    clearInterval(timerInterval);
}
}
//Start time
function startTimer() {
stopTimer();
startTime = new Date();
timerInterval = setInterval(displayTimeElapsed, 500);
}
//Card flip
function flipOpenCards() {
document.querySelectorAll('.open').forEach(function(openCardElement) {
    openCardElement.classList.remove('open', 'show');
});
}
//Check for win
function checkWin() {
const didWin = [...document.querySelectorAll('.card')].every(function(cardElement) {
    return cardElement.classList.contains('match');
});

if (didWin) {
    stopTimer();
    const winModalElement = document.createElement('div');
    winModalElement.classList.add('win-modal');
    winModalElement.innerHTML = "Congratulations! \n You completed the game within " + moveCount + " moves and earned " + starCount + " stars! Hit restart to play again!"; 
    
    gameBoardElement.appendChild(winModalElement);
}
}

function flipCard(cardElement, card) {
if (!cardElement.classList.contains('show')) {
    
    if (!startTime) {
    startTimer();
    }
    
    if (document.querySelectorAll('.open').length >= 2) {
    if (flipOpenCardsTimeout) {
        clearTimeout(flipOpenCardsTimeout);
        flipOpenCardsTimeout = null;
    }
    flipOpenCards();
    }
    
    cardElement.classList.add('open', 'show');
    //card.classList.add('open', 'show');

    if (lastCardFlipped) {
    
    moveCount++
    displayMoveCount();
    updateStarCount();
    
    if (card === lastCardFlipped) {
        document.querySelectorAll('.open').forEach(function(openCardElement) {
        openCardElement.classList.remove('open');
        openCardElement.classList.add('match');
        });
        checkWin();
    } else {
        flipOpenCardsTimeout = setTimeout(flipOpenCards, 1000);
    }
    
    lastCardFlipped = null;
    } else {
    lastCardFlipped = card;
    }
}
}

function reset() {

moveCount = 0;
starCount = 3;
lastCardFlipped = null;
flipOpenCardsTimeout = null;
startTime = null;
timerInterval = null;
    
gameBoardElement.innerHTML = '';

stopTimer();
displayMoveCount();
updateStarCount();
displayTimeElapsed();

// Shuffle the `cardDeck` string array defined above.
shuffle(cardList);

cardList.forEach(function(card) {

    const cardElement = document.createElement('li');
    cardElement.classList.add('card');
    
    cardElement.addEventListener('click', function() {
    flipCard(cardElement, card);
    });
    
    const cardFaceElement = document.createElement('i');
    
    cardFaceElement.classList.add('fa');
    cardFaceElement.classList.add('fa-' + card);
    
    cardElement.appendChild(cardFaceElement);
    
    gameBoardElement.appendChild(cardElement);
});
}

reset();

