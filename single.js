const board = document.getElementById("game-board"); // changed from "board" to match your HTML
const levelDisplay = document.getElementById("level");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");

let level = 1;
let timeLeft;
let timerInterval;
let score = 0;
let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 0;

function startLevel() {
    board.innerHTML = "";
    flippedCards = [];
    matchedPairs = 0;

    if (level <= 2) totalPairs = 4;
    else if (level <= 6) totalPairs = 6;
    else if (level <= 12) totalPairs = 8;
    else if (level <= 20) totalPairs = 10;
    else totalPairs = 12;

    board.className = "board"; // reset and keep board styling
    if (totalPairs <= 4) board.classList.add("easy-mode");
    else if (totalPairs <= 8) board.classList.add("normal-mode");
    else board.classList.add("hard-mode");

    const emojis = ['🍎','🍌','🍇','🍓','🍍','🥝','🍒','🍑','🍉','🍋','🥥','🍆'];
    let cardsArray = emojis.slice(0, totalPairs);
    cardsArray = [...cardsArray, ...cardsArray].sort(() => Math.random() - 0.5);

    cardsArray.forEach(emoji => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.emoji = emoji;

        const inner = document.createElement("div");
        inner.classList.add("card-inner");

        const front = document.createElement("div");
        front.classList.add("card-front");
        front.textContent = emoji;

        const back = document.createElement("div");
        back.classList.add("card-back");
        back.textContent = "?";

        inner.appendChild(front);
        inner.appendChild(back);
        card.appendChild(inner);

        card.addEventListener("click", () => flipCard(card));

        board.appendChild(card);
    });

    if (totalPairs <= 4) timeLeft = 120;
    else if (totalPairs <= 8) timeLeft = 180;
    else timeLeft = 240;

    updateHUD();
    startTimer();
}

function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains("flipped") && !card.classList.contains("matched")) {
        card.classList.add("flipped");
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 700);
        }
    }
}

function checkMatch() {
    const [first, second] = flippedCards;
    if (first.dataset.emoji === second.dataset.emoji) {
        first.classList.add("matched", "hidden-space");
        second.classList.add("matched", "hidden-space");
        matchedPairs++;
        score += 10 + timeLeft;
        if (matchedPairs === totalPairs) {
            clearInterval(timerInterval);
            level++;
            setTimeout(startLevel, 1000);
        }
    } else {
        first.classList.remove("flipped");
        second.classList.remove("flipped");
    }
    flippedCards = [];
    updateHUD();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateHUD();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time's up! Game Over.");
            level = 1;
            score = 0;
            startLevel();
        }
    }, 1000);
}

function updateHUD() {
    levelDisplay.textContent = `Level: ${level}`;
    timerDisplay.textContent = `⏳ ${timeLeft}s`;
    scoreDisplay.textContent = `Score: ${score}`;
}

document.getElementById("resetLevel").addEventListener("click", startLevel);
document.getElementById("fullReset").addEventListener("click", () => {
    level = 1;
    score = 0;
    startLevel();
});

startLevel();
