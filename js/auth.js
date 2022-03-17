function buildBlockAuth(container) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper', 'auth');

    const loginLabel = document.createElement('label');
    loginLabel.classList.add('login-label');
    loginLabel.textContent = 'Please, enter display name:';

    const loginInput = document.createElement('input');
    loginInput.classList.add('login-input');

    const loginButton = document.createElement('button');
    // loginButton.classList.add('login-button');
    loginButton.classList.add('basic-button', 'login-button');
    loginButton.textContent = 'LOG IN'
    loginButton.addEventListener('click', logIn);

    const appBlock = document.querySelector('.app');
    appBlock.appendChild(wrapper);
    wrapper.appendChild(loginLabel);
    wrapper.appendChild(loginInput);
    wrapper.appendChild(loginButton);
}

function loadNextScreen() {
    const apiUrl = `https://skypro-rock-scissors-paper.herokuapp.com/player-status?token=${window.sessionStorage.getItem('playerToken')}`;
    fetch(apiUrl)
    .then( (response) => { return response.json(); })
    .then( (data) => {
        if (data.status === 'ok') {
            (data['player-status'].status === 'lobby') ? window.application.renderScreen('lobby') : window.application.renderScreen('gameScreen');
        } else {
            window.application.renderBlock('modalPopUp', '.app', {'modalContentBody':generateErrorModalContent(data.status, 'Something went wrong')});
        }
    })
    .catch( () => {} );
}

function logIn() {
    const enteredLogin = document.querySelector('.login-input').value;
    const apiUrl = `https://skypro-rock-scissors-paper.herokuapp.com/login?login=${enteredLogin}`;
    fetch(apiUrl)
    .then( (response) => { return response.json(); })
    .then( (data) => {
        if (data.status === 'ok') {
            window.sessionStorage.setItem('playerLogin', enteredLogin);
            window.sessionStorage.setItem('playerToken', data.token);
            // window.application.renderScreen('lobby');
            loadNextScreen();
        } else {
            window.application.renderBlock('modalPopUp', '.app', {'modalContentBody':generateErrorModalContent(data.status, 'Something went wrong')});
        }
    })
    .catch( () => {} );
}