const emojis = ["🍎", "🍌", "🍇", "🍒", "🍑", "🍉", "🥝", "🍍", "🍓", "🥥"];
let firstCard, secondCard;
let lockBoard = false;
let playerTurn = 1;
let scores = {1: 0, 2: 0};
let multiplayer = false;
let level = 1;
let cardsCount = 4;

function goHome() {
    document.querySelector(".menu").classList.remove("hidden");
    document.getElementById("multiMenu").classList.add("hidden");
    document.getElementById("gameBoard").classList.add("hidden");
    document.body.style.background = "linear-gradient(135deg, #8EC5FC, #E0C3FC)";
    resetGame();
}

function resetGame() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    scores = {1: 0, 2: 0};
    level = 1;
}

function startSinglePlayer() {
    multiplayer = false;
    cardsCount = 4;
    level = 1;
    document.querySelector(".menu").classList.add("hidden");
    document.getElementById("multiMenu").classList.add("hidden");
    document.getElementById("gameBoard").classList.remove("hidden");
    document.getElementById("playerTurn").textContent = "";
    startLevel();
}

function showMultiplayerMenu() {
    document.querySelector(".menu").classList.add("hidden");
    document.getElementById("multiMenu").classList.remove("hidden");
}

function startMultiplayer(count) {
    multiplayer = true;
    cardsCount = count;
    document.querySelector(".menu").classList.add("hidden");
    document.getElementById("multiMenu").classList.add("hidden");
    document.getElementById("gameBoard").classList.remove("hidden");
    document.getElementById("playerTurn").textContent = `Player ${playerTurn}'s Turn`;
    document.body.style.background = playerTurn === 1 ? "linear-gradient(135deg, #60a5fa, #3b82f6)" : "linear-gradient(135deg, #fbbf24, #f59e0b)";
    createBoard();
}

function startLevel() {
    document.getElementById("levelInfo").textContent = `Level: ${level}`;
    createBoard();
}

function createBoard() {
    const container = document.getElementById("cardsContainer");
    container.innerHTML = "";
    container.style.gridTemplateColumns = `repeat(${Math.ceil(cardsCount / 2)}, 100px)`;
    
    let gameEmojis = [];
    for (let i = 0; i < cardsCount / 2; i++) {
        gameEmojis.push(emojis[i], emojis[i]);
    }

    gameEmojis.sort(() => Math.random() - 0.5);

    gameEmojis.forEach(emoji => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">${emoji}</div>
                <div class="card-back">❓</div>
            </div>
        `;
        card.addEventListener("click", flipCard);
        container.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard || this.classList.contains("flipped")) return;

    this.classList.add("flipped");
    if (!firstCard) {
        firstCard = this;
        return;
    }
    secondCard = this;
    checkMatch();
}

function checkMatch() {
    lockBoard = true;
    const match = firstCard.querySelector(".card-front").textContent === secondCard.querySelector(".card-front").textContent;
    if (match) {
        setTimeout(() => {
            firstCard.style.visibility = "hidden";
            secondCard.style.visibility = "hidden";
            resetFlip();
            if (!multiplayer) checkSinglePlayerProgress();
        }, 500);
        if (multiplayer) {
            scores[playerTurn]++;
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            if (multiplayer) switchPlayer();
            resetFlip();
        }, 800);
    }
}

function resetFlip() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function switchPlayer() {
    playerTurn = playerTurn === 1 ? 2 : 1;
    document.getElementById("playerTurn").textContent = `Player ${playerTurn}'s Turn`;
    document.body.style.background = playerTurn === 1 ? "linear-gradient(135deg, #60a5fa, #3b82f6)" : "linear-gradient(135deg, #fbbf24, #f59e0b)";
}

function checkSinglePlayerProgress() {
    if (document.querySelectorAll(".card:not([style*='hidden'])").length === 0) {
        setTimeout(() => {
            level++;
            if (level <= 5) cardsCount += 2;
            else cardsCount += 4;
            startLevel();
        }, 1000);
    }
}
