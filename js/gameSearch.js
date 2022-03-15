function showRandomGamePreparationText() {
    const randomIdx = Math.floor(Math.random()*window.application.gamePrepTexts.len);
    return window.application.gamePrepTexts.texts[randomIdx];
}

function generateGameSearchModalContent() {
    const modalContentBody = document.createElement('div');
    modalContentBody.classList.add('mcb-game-search');
    
    const modalContentLoadingText = document.createElement('span');
    modalContentLoadingText.classList.add('modal-game-prep-text');
    modalContentLoadingText.textContent = showRandomGamePreparationText();
    window.application.timers.push(
        setInterval(() => {
            modalContentLoadingText.textContent = showRandomGamePreparationText();
        }, 5000)
    )
    modalContentBody.appendChild(modalContentLoadingText);

    const modalContentLoadingBar = document.createElement('div');
    modalContentLoadingBar.classList.add('modal-game-prep-pbar');
    const modalContentLoadintBarFill = document.createElement('span');
    modalContentLoadintBarFill.classList.add('modal-game-prep-pbar-fill');
    modalContentLoadingBar.appendChild(modalContentLoadintBarFill);
    modalContentBody.appendChild(modalContentLoadingBar);

    const modalContentQueueTime = document.createElement('span');
    modalContentQueueTime.classList.add('modal-game-prep-queue-time');
    modalContentQueueTime.textContent = `Time in queue: 0 secs`;
    window.application.timers.push(
        setInterval(() => {
            const currTimeValue = modalContentQueueTime.textContent;
            const newTimeValue = Number(currTimeValue.match(/\d+/g)) + 1;
            modalContentQueueTime.textContent = `Time in queue: ${newTimeValue} secs`;
        }, 1000)
    )
    modalContentBody.appendChild(modalContentQueueTime);

    return modalContentBody;
}

function checkGameSearch() {
    const playerToken = window.sessionStorage.getItem('playerToken');
    const gameId = window.sessionStorage.getItem('playerGameId');
    const apiUrl = `https://skypro-rock-scissors-paper.herokuapp.com/game-status?token=${playerToken}&id=${gameId}`;

    fetch(apiUrl)
    .then( (response) => { return response.json(); })
    .then( (data) => {
        // alert(JSON.stringify(data));
        if ((data.status === 'ok') && (data['game-status'].status !== 'waiting-for-start')) {
            window.sessionStorage.setItem('playerGameStatus', 'waiting-for-start');
            window.application.renderScreen('gameScreen', '.app');
            // # TODO: Go To Game Pane
        } else if (data.status === 'error') {
            window.application.renderBlock('modalPopUp', '.app', {'modalContentBody':generateErrorModalContent(data.status, capitalizeFirstLetter(data.message))});
        }
    })
    .catch( () => {} );
}

function buildGameSearchScreen(container) {
    window.application.renderBlock('modalPopUp', container, {'modalContentBody':generateGameSearchModalContent()});
    
    checkGameSearch();
    window.application.timers.push(
        setInterval(checkGameSearch, 1000)
    )
}