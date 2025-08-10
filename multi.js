const board = document.getElementById("game-board");
const score1Display = document.getElementById("score1");
const score2Display = document.getElementById("score2");
const turnDisplay = document.getElementById("turn");
const scoreboard = document.getElementById("scoreboard");
const menuBottom = document.getElementById("menu-bottom");

let pairsCount;
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let currentPlayer = 1;
let score1 = 0;
let score2 = 0;

const emojis = ["🍎","🍌","🍇","🍉","🍒","🍍","🥭","🥝","🍑","🍓","🍋","🍈","🍐","🥥","🍊","🫐"];

// ======= Winner Popup =======
function showWinnerPopup(message) {
    const popup = document.createElement("div");
    popup.classList.add("winner-popup");
    popup.innerHTML = `
        <div class="popup-content">
            <h2>${message}</h2>
            <button class="btn" id="close-popup">OK</button>
        </div>
    `;
    document.body.appendChild(popup);

    document.getElementById("close-popup").addEventListener("click", () => {
        popup.remove();
    });
}

function startGame(pairs) {
    pairsCount = pairs;
    score1 = 0;
    score2 = 0;
    matchedPairs = 0;
    currentPlayer = 1;

    score1Display.textContent = score1;
    score2Display.textContent = score2;
    turnDisplay.textContent = "Player 1";
    document.body.classList.remove("player2-bg");
    document.body.classList.add("player1-bg");

    scoreboard.classList.remove("hidden");
    menuBottom.classList.remove("hidden");

    // Create deck
    let gameEmojis = emojis.slice(0, pairs);
    cards = [...gameEmojis, ...gameEmojis]
        .sort(() => Math.random() - 0.5);

    // Adjust grid size
    if (pairs === 6) board.style.gridTemplateColumns = "repeat(4, var(--card-easy-w))";
    if (pairs === 10) board.style.gridTemplateColumns = "repeat(5, var(--card-normal-w))";
    if (pairs === 16) board.style.gridTemplateColumns = "repeat(8, var(--card-hard-w))";

    // Render cards
    board.innerHTML = "";
    cards.forEach(emoji => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">${emoji}</div>
                <div class="card-back">?</div>
            </div>
        `;
        card.dataset.value = emoji;
        card.addEventListener("click", () => flipCard(card));
        board.appendChild(card);
    });
}

function flipCard(card) {
    if (card.classList.contains("flipped") || flippedCards.length === 2) return;

    card.classList.add("flipped");
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 700);
    }
}

function checkMatch() {
    const [first, second] = flippedCards;
    if (first.dataset.value === second.dataset.value) {
        matchedPairs++;
        if (currentPlayer === 1) {
            score1++;
            score1Display.textContent = score1;
        } else {
            score2++;
            score2Display.textContent = score2;
        }
        first.classList.add("matched");
        second.classList.add("matched");

        // Check winner if all pairs matched
        if (matchedPairs === pairsCount) {
            setTimeout(() => {
                if (score1 > score2) {
                    showWinnerPopup(`🎉 Player 1 Wins! 🏆<br>Final Score: ${score1} - ${score2}`);
                } else if (score2 > score1) {
                    showWinnerPopup(`🎉 Player 2 Wins! 🏆<br>Final Score: ${score2} - ${score1}`);
                } else {
                    showWinnerPopup(`🤝 It's a Tie!<br>Final Score: ${score1} - ${score2}`);
                }
            }, 500);
        }

    } else {
        first.classList.remove("flipped");
        second.classList.remove("flipped");
        switchTurn();
    }
    flippedCards = [];
}

function switchTurn() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    turnDisplay.textContent = `Player ${currentPlayer}`;
    if (currentPlayer === 1) {
        document.body.classList.remove("player2-bg");
        document.body.classList.add("player1-bg");
    } else {
        document.body.classList.remove("player1-bg");
        document.body.classList.add("player2-bg");
    }
}
