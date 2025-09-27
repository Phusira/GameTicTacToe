
const changeModeBtn = document.getElementById('change-mode-btn');

if (changeModeBtn) {
    changeModeBtn.addEventListener('click', function() {
        showModeOverlay();
        mode = null;
       
        currentPlayer = 'X';
        gameActive = false;
        createBoard();
        statusDiv.textContent = '';
       
        if (modeHumanBtn) modeHumanBtn.classList.remove('active');
        if (modeBotBtn) modeBotBtn.classList.remove('active');
    });
}


const board = document.getElementById('game-board');
const statusDiv = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');
const popupModal = document.getElementById('popup-modal');
const modalMessage = document.getElementById('modal-message');
const closeModal = document.getElementById('close-modal');
const modalRestart = document.getElementById('modal-restart');

const modeHumanBtn = document.getElementById('mode-human');
const modeBotBtn = document.getElementById('mode-bot');
const modeOverlay = document.getElementById('mode-overlay');
const mainContainer = document.getElementById('main-container');


let cells = [];
let currentPlayer = 'X';
let gameActive = true;
let mode = null; 

const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8], 
    [0,3,6], [1,4,7], [2,5,8], 
    [0,4,8], [2,4,6]           
];

function createBoard() {
    board.innerHTML = '';
    cells = [];
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
        cells.push(cell);
    }
}

function showPopup(message) {
    modalMessage.textContent = message;
    popupModal.classList.add('show');
}

function hidePopup() {
    popupModal.classList.remove('show');
}



function handleCellClick(e) {
    const idx = e.target.dataset.index;
    if (!gameActive || cells[idx].textContent) return;
    if (mode === 'bot') {
        if (currentPlayer === 'X') {
            playerMove(idx);
        }
    } else {
        playerMove(idx);
    }
}


function playerMove(idx) {
    if (!gameActive || cells[idx].textContent) return;
    cells[idx].textContent = currentPlayer;
    if (checkWin(currentPlayer)) {
        statusDiv.textContent = `ผู้เล่น ${currentPlayer} ชนะ!`;
        showPopup(`ผู้เล่น ${currentPlayer} ชนะ!`);
        gameActive = false;
    } else if (isDraw()) {
        statusDiv.textContent = 'เสมอ!';
        showPopup('เสมอ!');
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDiv.textContent = `ถึงตาของผู้เล่น ${currentPlayer}`;
        if (mode === 'bot' && currentPlayer === 'O') {
            setTimeout(botMove, 500);
        }
    }
}

function botMove() {
    if (!gameActive) return;
    
    const emptyCells = cells
        .map((cell, idx) => cell.textContent ? null : idx)
        .filter(idx => idx !== null);
    if (emptyCells.length === 0) return;
    
    const randomIdx = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    cells[randomIdx].textContent = currentPlayer;
    if (checkWin(currentPlayer)) {
        statusDiv.textContent = `ผู้เล่น ${currentPlayer} ชนะ!`;
        showPopup(`ผู้เล่น ${currentPlayer} ชนะ!`);
        gameActive = false;
    } else if (isDraw()) {
        statusDiv.textContent = 'เสมอ!';
        showPopup('เสมอ!');
        gameActive = false;
    } else {
        currentPlayer = 'X';
        statusDiv.textContent = `ถึงตาของผู้เล่น ${currentPlayer}`;
    }
}

function checkWin(player) {
    return winPatterns.some(pattern =>
        pattern.every(idx => cells[idx].textContent === player)
    );
}

function isDraw() {
    return cells.every(cell => cell.textContent);
}



function restartGame() {
    currentPlayer = 'X';
    gameActive = true;
    statusDiv.textContent = `ถึงตาของผู้เล่น ${currentPlayer}`;
    createBoard();
    hidePopup();
    
    if (mode === 'bot' && currentPlayer === 'O') {
        setTimeout(botMove, 500);
    }
}


restartBtn.addEventListener('click', restartGame);
modalRestart.addEventListener('click', restartGame);
closeModal.addEventListener('click', hidePopup);
popupModal.addEventListener('click', function(e) {
    if (e.target === popupModal) hidePopup();
});

function showModeOverlay() {
    if (modeOverlay) modeOverlay.style.display = 'flex';
    if (mainContainer) mainContainer.style.display = 'none';
}
function hideModeOverlay() {
    if (modeOverlay) modeOverlay.style.display = 'none';
    if (mainContainer) mainContainer.style.display = '';
}

if (modeHumanBtn && modeBotBtn) {
    modeHumanBtn.addEventListener('click', function() {
        mode = 'human';
        modeHumanBtn.classList.add('active');
        modeBotBtn.classList.remove('active');
        hideModeOverlay();
        restartGame();
    });
    modeBotBtn.addEventListener('click', function() {
        mode = 'bot';
        modeBotBtn.classList.add('active');
        modeHumanBtn.classList.remove('active');
        hideModeOverlay();
        restartGame();
    });
}

showModeOverlay();
