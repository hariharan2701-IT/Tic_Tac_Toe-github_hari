const board = document.querySelectorAll('.cell');
const statusDisplay = document.querySelector('.status');
const restartButton = document.querySelector('#restart-btn');
const replayButton = document.querySelector('#replay-btn');
const exitButton = document.querySelector('#exit-btn');
const overlay = document.querySelector('#overlay');
const popup = document.querySelector('#popup');
const player1ScoreDisplay = document.querySelector('#player1-score');
const player2ScoreDisplay = document.querySelector('#player2-score');
let gameActive = false;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let player1 = "";
let player2 = "";
let player1Score = 0;
let player2Score = 0;

// Animation elements for strike line
const strikeLine = document.querySelector('.strike-line');

const startGameButton = document.querySelector('#start-game-btn');
startGameButton.addEventListener('click', startGame);

// Winning conditions
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function startGame() {
    const player1Input = document.querySelector('#player1-name').value;
    const player2Input = document.querySelector('#player2-name').value;
    
    if (!player1Input || !player2Input) {
        alert("Please enter both player names!");
        return;
    }
    
    player1 = player1Input;
    player2 = player2Input;

    document.querySelector('.board').classList.remove('hidden');
    document.querySelector('.scoreboard').classList.remove('hidden');
    document.querySelector('#name-input').classList.add('hidden');
    statusDisplay.classList.remove('hidden');

    gameActive = true;
    statusDisplay.innerHTML = `${player1}'s turn`;

    // Add event listeners for each cell
    board.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = `${currentPlayer === "X" ? player1 : player2}'s turn`;
}

function handleResultValidation() {
    let roundWon = false;
    let winningCombination = [];

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            winningCombination = winCondition;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = `${currentPlayer === "X" ? player1 : player2} has won!`;
        updateScore(currentPlayer === "X" ? player1 : player2);
        highlightWinningLine(winningCombination);
        displayPopup(`${currentPlayer === "X" ? player1 : player2} won! Wow, you win this match! Play again to show your talent!`);
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = `Game ended in a draw!`;
        updateScore("draw");
        displayPopup(`It's a draw!`);
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function highlightWinningLine(winningCombination) {
    // Get the indexes of the winning cells
    const [a, b, c] = winningCombination;

    // Add a class for the strike line and set its color based on the winner
    const color = currentPlayer === "X" ? "red" : "blue";
    board[a].classList.add(`strike-${color}`);
    board[b].classList.add(`strike-${color}`);
    board[c].classList.add(`strike-${color}`);
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function updateScore(winner) {
    if (winner === player1) {
        player1Score += 10;
        player1ScoreDisplay.innerHTML = `${player1}: ${player1Score}`;
    } else if (winner === player2) {
        player2Score += 10;
        player2ScoreDisplay.innerHTML = `${player2}: ${player2Score}`;
    } else {
        player1Score += 5;
        player2Score += 5;
        player1ScoreDisplay.innerHTML = `${player1}: ${player1Score}`;
        player2ScoreDisplay.innerHTML = `${player2}: ${player2Score}`;
    }
}

function displayPopup(message) {
    const winnerMessage = document.querySelector('#winner-message');
    winnerMessage.innerHTML = message;
    overlay.classList.remove('hidden');
    popup.classList.remove('hidden');
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = `${player1}'s turn`;
    board.forEach(cell => {
        cell.innerHTML = "";
        cell.classList.remove('strike-red', 'strike-blue'); // Remove strike line
    });
}

function handleReplayGame() {
    overlay.classList.add('hidden');
    popup.classList.add('hidden');
    handleRestartGame();
}

function handleExitGame() {
    window.location.reload(); // Reloads the page to reset everything
}

// Event listeners for the popup buttons
restartButton.addEventListener('click', handleRestartGame);
replayButton.addEventListener('click', handleReplayGame);
exitButton.addEventListener('click', handleExitGame);

