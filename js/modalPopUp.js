function generateErrorModalContent(status, message) {
    const modalContentBody = document.createElement('div');
    modalContentBody.classList.add('lobby-modal')
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

    return modalContentBody;
}

function renderModalPopUp(container, modalContentBody=null, buildCloseButton=true) {
    const modalWrapper = document.createElement('div');
    modalWrapper.classList.add('modal-wrapper');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const modalContentHeader = document.createElement('div');
    modalContentHeader.classList.add('modal-content-header');

    if (buildCloseButton) {
        const modalCloseButton = document.createElement('button');
        modalCloseButton.classList.add('modal-close-button');
        modalCloseButton.addEventListener('click', closeModalPopUp);
        
        const closeIcon = document.createElement('img');
        closeIcon.classList.add('modal-close-icon');
        closeIcon.setAttribute('src', '../assets/icons/close-icon.png');
        modalCloseButton.appendChild(closeIcon);
        
        modalContentHeader.appendChild(modalCloseButton);
    }
    
    if (modalContentBody === null) {
        modalContentBody = document.createElement('div');
    }
    modalContentBody.classList.add('modal-content-body');

    modalContent.appendChild(modalContentHeader);
    modalContent.appendChild(modalContentBody);
    modalWrapper.appendChild(modalContent);

    const appBlock = document.querySelector(container);
    appBlock.appendChild(modalWrapper);
}

function closeModalPopUp() {
    clearInterval(window.application.timers.pop());
    const modalWindow = document.querySelector('.modal-wrapper');
    modalWindow.remove();
}