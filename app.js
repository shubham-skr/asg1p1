/*************************************************
  Functionality - I

  * Show Card Face on clicking any card.

  * Check if highest card button can be enabled.

/*************************************************/

const cards = document.querySelectorAll('.card');

for (let i = 0; i < cards.length; i++) {
  cards[i].addEventListener('click', showCardFace);
}

// Show card face on clicking a card
function showCardFace(event) {
  const targetCard = event.currentTarget;

  if (!targetCard.classList.contains('card-face')) {
    targetCard.classList.add('card-face');

    // change the img inside the card div
    const cardName = targetCard.getAttribute('data-card');
    const suit = cardName.split('-')[0].toLowerCase();
    targetCard.innerHTML = `<img src="./images/${suit}/${cardName}.png" alt="${cardName}" />`;

    // check if button can be enabled
    enableButton(targetCard);
  }
}

// Enable highest card button
function enableButton(currentCard) {
  const playerCards = currentCard.parentElement.children;

  // check if all cards of the player are flipped
  let enable = true;
  for (let i = 0; i < playerCards.length; i++) {
    if (!playerCards[i].classList.contains('card-face')) {
      enable = false;
      break;
    }
  }

  // if all cards of the player is flipped, then enable button
  if (enable === true) {
    let button = currentCard.parentElement.nextElementSibling.firstElementChild;
    button.removeAttribute('disabled');
  }
}

/************************************************************
  Functionality - II

  * Show the highest card of the player.

  * Calculate the value of each card and 
    find the highest card among all the cards of the player.

  * Check if declare winner button can be enabled.

/************************************************************/

const highestCardDivs = document.querySelectorAll('.highest-card');

for (let i = 0; i < highestCardDivs.length; i++) {
  highestCardDivs[i]
    .querySelector('button')
    .addEventListener('click', showHighestCard);
}

// show highest card of the player
function showHighestCard(event) {
  const para = event.currentTarget.nextElementSibling;

  const highestCard = findHighestCard(
    para.parentElement.previousElementSibling
  );

  para.innerText = `${highestCard.cardName} (${highestCard.value})`;

  highestCard.element.classList.add('highest');
  event.currentTarget.parentElement.classList.add('revealed');

  // check if winner button can be enabled
  enableWinnerButton();
}

// find the highest card of the player
function findHighestCard(cardsDiv) {
  playerCards = cardsDiv.children;

  let element = null;
  let cardName = '';
  let maxVal = 0;

  for (let i = 0; i < playerCards.length; i++) {
    let curCard = calcCardValue(playerCards[i].getAttribute('data-card'));
    if (curCard.value > maxVal) {
      maxVal = curCard.value;
      element = playerCards[i];
      cardName = curCard.cardName;
    }
  }

  return { element, cardName, value: maxVal };
}

// calculate the value of the card
function calcCardValue(cardName) {
  const suitWeight = {
    CLUB: 0,
    DIAMOND: 1,
    HEART: 2,
    SPADE: 3,
  };
  const rankWeight = {
    TWO: 0,
    THREE: 1,
    FOUR: 2,
    FIVE: 3,
    SIX: 4,
    SEVEN: 5,
    EIGHT: 6,
    NINE: 7,
    TEN: 8,
    JACK: 9,
    QUEEN: 10,
    KING: 11,
    ACE: 12,
  };

  const [suit, rank] = cardName.split('-');
  const value = rankWeight[rank] * 4 + suitWeight[suit];

  return { cardName, value };
}

// Enable the declare winner button if highest card of all players are revealed
function enableWinnerButton() {
  let enable = true;

  for (let i = 0; i < highestCardDivs.length; i++) {
    if (!highestCardDivs[i].classList.contains('revealed')) {
      enable = false;
    }
  }

  if (enable) {
    document.querySelector('#winner button').removeAttribute('disabled');
  }
}

/**************************************************
  Functionality - III

  * Declare the winner of the game.

/*************************************************/

const winnerBtn = document.getElementById('declare');
winnerBtn.addEventListener('click', declareWinner);

// declare the winner of the game
function declareWinner(event) {
  const winnerPara = event.currentTarget.nextElementSibling;

  const highestCards = document.querySelectorAll('.highest');

  const value0 = calcCardValue(highestCards[0].getAttribute('data-card'));
  const value1 = calcCardValue(highestCards[1].getAttribute('data-card'));

  let winnerCard, loserCard;

  if (value0 > value1) {
    winnerCard = highestCards[0];
    loserCard = highestCards[1];
  } else {
    winnerCard = highestCards[1];
    loserCard = highestCards[0];
  }

  const winnerPlayer = winnerCard.parentElement.parentElement;
  const loserPlayer = loserCard.parentElement.parentElement;

  winnerPlayer.classList.add('winner-player');
  loserPlayer.classList.add('loser-player');

  winnerPara.innerHTML = winnerPlayer.firstElementChild.innerHTML;
}
