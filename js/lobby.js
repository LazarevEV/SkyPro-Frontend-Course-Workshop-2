function updateLobbyPage() {
    const apiUrl = `https://skypro-rock-scissors-paper.herokuapp.com/player-list?token=${window.sessionStorage.getItem('playerToken')}`;
    fetch(apiUrl)
    .then( (response) => { return response.json(); })
    .then( (data) => {
        if (data.status === 'ok') {
            setCurrentPlayerData(data.list);
            setPlayerList(data.list);
        } else {
            // #TODO: Pretty error page
            alert('Something went wrong. Please, try again later')
        }
    })
    .catch( () => {} );
}

function getCurrentPlayerData(playersList) {
    let playerName = 'UNKNOWN';
    let winsCnt = 0;
    let lossesCnt = 0;

    playersList.forEach(playerInfo => {
        if (playerInfo.hasOwnProperty('you')) {
            playerName = playerInfo.login;
            winsCnt = playerInfo.wins;
            lossesCnt = playerInfo.loses;
        }
    });

    return [winsCnt, lossesCnt];
}

function setCurrentPlayerData(playersList) {
    const playerStats = getCurrentPlayerData(playersList);
    for (const [idx, statBlock] of [...document.querySelectorAll('.stat-block')].entries()) {
        statBlock.getElementsByClassName('stat-text')[0].textContent = playerStats[idx];
    }
}

function setPlayerList(playerList) {
    const playerListTableBody = document.getElementsByTagName('tbody')[0];
    playerListTableBody.innerHTML = '';
    playerList.forEach(playerInfo => {
        const playerInfoSelected = (({ login, wins, loses }) => ({ login, wins, loses }))(playerInfo);
        const trBody = document.createElement('tr');
        Object.keys(playerInfoSelected).forEach(key => {
            const td = document.createElement('td');
            td.textContent = playerInfoSelected[key];
            trBody.appendChild(td);
        });

        playerListTableBody.appendChild(trBody);
    })
}

function buildBlockLobbyPlayerList(container) {
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

    // Player List Table
    const playerListBlock = document.createElement('div');
    playerListBlock.classList.add('player-list');

    const playerListTable = document.createElement('table');
    playerListTable.classList.add('player-list-table');

    const playerListTableHead = document.createElement('thead');
    const trHead = document.createElement('tr');
    ['Player Name', 'Wins', 'Losses'].forEach(header => {
        const th = document.createElement('th');
        th.setAttribute('scope', 'col');
        th.textContent = header;
        trHead.appendChild(th)
    })
    playerListTableHead.appendChild(trHead);

    const playerListTableBody = document.createElement('tbody');
    
    playerListTable.appendChild(playerListTableHead);
    playerListTable.appendChild(playerListTableBody);
    playerListBlock.appendChild(playerListTable);

    // Find Game Button
    const findGameButton = document.createElement('button');
    findGameButton.classList.add('find-game-button');
    findGameButton.textContent = 'FIND GAME';
    findGameButton.addEventListener('click', findGame)

    // Render Elements
    const appBlock = document.querySelector('.app');
    appBlock.appendChild(wrapper);
    wrapper.appendChild(statsBar);
    wrapper.appendChild(playerListBlock);
    wrapper.appendChild(findGameButton);

    // Set timer for page updates
    updateLobbyPage();
    window.application.timers.push(
        setInterval(updateLobbyPage, 5000)
    )
}

function renderModalPopUp(status, message=null) {
    const modalWrapper = document.createElement('div');
    modalWrapper.classList.add('modal-wrapper');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const modalContentHeader = document.createElement('div');
    modalContentHeader.classList.add('modal-content-header');

    const modalCloseButton = document.createElement('button');
    modalCloseButton.classList.add('modal-close-button');
    modalCloseButton.addEventListener('click', closeModalPopUp);

    const closeIcon = document.createElement('img');
    closeIcon.classList.add('modal-close-icon');
    closeIcon.setAttribute('src', '../assets/icons/close-icon.png');
    modalCloseButton.appendChild(closeIcon);

    const modalContentBody = document.createElement('div');
    modalContentBody.classList.add('modal-content-body');
    fillModalContent(modalContentBody, status, message);

    modalContentHeader.appendChild(modalCloseButton);
    modalContent.appendChild(modalContentHeader);
    modalContent.appendChild(modalContentBody);
    modalWrapper.appendChild(modalContent);

    const appBlock = document.querySelector('.app');
    appBlock.appendChild(modalWrapper);
}

function fillModalContent(modalContentBody, status, message) {
    if (status === 'error') {
        const modalContentIcon = document.createElement('img');
        modalContentIcon.classList.add('modal-error-icon');
        modalContentIcon.setAttribute('src', '../assets/icons/error-icon.png');
        modalContentBody.appendChild(modalContentIcon);

        const modalContentMessage = document.createElement('span');
        modalContentMessage.classList.add('modal-error-message');
        modalContentMessage.innerHTML = `${message}.<br>Please, try again!`;
        modalContentBody.appendChild(modalContentMessage);
    }
}

function closeModalPopUp() {
    const modalWindow = document.querySelector('.modal-wrapper');
    modalWindow.remove();
}

function findGame() {
    const apiUrl = `https://skypro-rock-scissors-paper.herokuapp.com/start?token=${window.sessionStorage.getItem('playerToken')}`;
    fetch(apiUrl)
    .then( (response) => { return response.json(); })
    .then( (data) => {
        switch (data.status) {
            case 'ok':
                window.sessionStorage.setItem('currentGameId', data['player-status'].game.id);
                window.application.renderScreen('gameSearch');
                break;
            case 'error':
                renderModalPopUp(data.status, capitalizeFirstLetter(data.message));
                break;
            default:
                renderModalPopUp('searching');
                break;
                
        }
    })
    .catch( () => {} );
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}