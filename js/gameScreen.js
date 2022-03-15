function buildGameScreen(container) {
    const playerName = window.sessionStorage.getItem('playerLogin');

    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper', 'lobby');

    // Stats Bar
    const statsBar = document.createElement('div');
    statsBar.classList.add('stats-bar')

    const playerNameBlock = document.createElement('span');
    playerNameBlock.classList.add('stat-text', 'player');
    playerNameBlock.textContent = playerName;

    const statsBlock = document.createElement('div');
    statsBlock.classList.add('stats');

    for (let i = 0; i < 2; i++) {
        const statBlock = document.createElement('div');
        statBlock.classList.add('stat-block');

        const statIcon = document.createElement('img');
        statIcon.classList.add('game-stat-icon');
        statIcon.setAttribute('src', i == 0 ? 'assets/icons/win_icon.png' : 'assets/icons/loss_icon.png');

        const statText = document.createElement('span');
        statText.classList.add('stat-text');
        statText.textContent = 0;

        statsBlock.appendChild(statBlock);
        statBlock.appendChild(statIcon);
        statBlock.appendChild(statText);
    }

    statsBar.appendChild(playerNameBlock);
    statsBar.appendChild(statsBlock);

    // Move Choice Pane
    const movePaneWrapper = document.createElement('div');
    movePaneWrapper.classList.add('move-pane-wrapper');

    // Move Status Pane
    const moveStatusPane = document.createElement('span');
    moveStatusPane.classList.add('move-status-pane');
    movePaneWrapper.appendChild(moveStatusPane);

    // Move Buttons
    const moveButtonsWrapper = document.createElement('div');
    moveButtonsWrapper.classList.add('move-buttons-wrapper');
    ['rock', 'paper', 'scissors'].forEach(moveName => {
        const moveButton = document.createElement('button');
        moveButton.classList.add('move-button');
        moveButton.setAttribute('id', moveName);
        moveButton.addEventListener('click', setMove.bind(null, moveButton.id));

        const moveIcon = document.createElement('img');
        moveIcon.classList.add('move-icon');
        moveIcon.setAttribute('src', `../assets/icons/${moveName}_icon.png`);

        moveButton.appendChild(moveIcon);
        moveButtonsWrapper.appendChild(moveButton);
    });
    movePaneWrapper.appendChild(moveButtonsWrapper);

    // Confirm Move Button
    const confirmMoveButton = document.createElement('button');
    confirmMoveButton.classList.add('confirm-move-button');
    confirmMoveButton.textContent = 'CONFIRM';
    confirmMoveButton.addEventListener('click', confirmMove);

    // Render Elements
    const appBlock = document.querySelector('.app');
    appBlock.appendChild(wrapper);
    wrapper.appendChild(statsBar);
    wrapper.appendChild(movePaneWrapper);
    wrapper.appendChild(confirmMoveButton);

    updateMoveStatus('Your move!');
    // Set timer for page updates
    checkGameStatus();
    window.application.timers.push(
        setInterval(checkGameStatus, 1000)
    )
}

function updateMoveStatus(statusText, element=null) {
    statusText = (statusText == 'waiting-for-your-move') ? 'Your move!' : 'Waiting for your opponent!';
    document.querySelector('.move-status-pane').textContent = statusText;
}

function clearActive() {
    ['rock', 'paper', 'scissors'].forEach(buttonId => {
        document.getElementById(buttonId).classList.remove('active');
    });
}

function setMove(moveName) {
    clearActive();
    document.getElementById(moveName).classList.add('active');
}

function confirmMove() {
    const moveValue = document.querySelector('.active').id;
    const apiUrl = `https://skypro-rock-scissors-paper.herokuapp.com/play?token=${window.sessionStorage.getItem('playerToken')}&id=${window.sessionStorage.getItem('playerGameId')}&move=${moveValue}`;
    fetch(apiUrl)
    .then( (response) => { return response.json(); })
    .then( (data) => {
        checkGameStatus();
    })
    .catch( () => {} );
}

function checkGameStatus() {
    const apiUrl = `https://skypro-rock-scissors-paper.herokuapp.com/game-status?token=${window.sessionStorage.getItem('playerToken')}&id=${window.sessionStorage.getItem('playerGameId')}`;
    fetch(apiUrl)
    .then( (response) => { return response.json(); })
    .then( (data) => {
        switch (data.status) {
            case 'ok':
                if (data['game-status'].status != window.sessionStorage.getItem('playerGameStatus')) {
                    window.sessionStorage.setItem('playerGameStatus', data['game-status'].status);
                    updateGameScreen(data['game-status'].status);
                }
                break;
            case 'error':
                window.application.renderBlock('modalPopUp', '.app', {'modalContentBody':generateErrorModalContent(data.status, capitalizeFirstLetter(data.message))});
                break;
            default:
                break;
                
        }
    })
    .catch( () => {} );
}

function generateWinModalContent() {
    const modalContentBody = document.createElement('div');
    modalContentBody.classList.add('lobby-modal')

    const modalGameResultText = document.createElement('span');
    modalGameResultText.classList.add('modal-game-result-text');
    modalGameResultText.textContent = 'Congratulations! You have won!';
    modalContentBody.appendChild(modalGameResultText);

    // Generate Fireworks
    for (let i = 0; i < 15; i++) {
        const fireworkDiv = document.createElement('div');
        fireworkDiv.classList.add(`firework-${i}`);
        
        modalContentBody.appendChild(fireworkDiv);
    }

    return modalContentBody;
}

function generateLoseModalContent() {

}

function updateGameScreen(gameStatus) {
    switch (gameStatus) {
        case 'waiting-for-start':
            window.application.renderBlock('gameSearchScreen', '.app');
            break;
        case 'lose':
                break;
        case 'win':
            window.application.renderBlock('modalPopUp', '.app', {'modalContentBody':generateWinModalContent(), 'buildCloseButton':false});
                break;
        default:
            // window.application.renderScreen('gameScreen', '.app');
            updateMoveStatus(gameStatus);
            break;
        // case 'waiting-for-your-move':
        //     break;
        // case 'waiting-for-enemy-move':
        //     break;
    }
}