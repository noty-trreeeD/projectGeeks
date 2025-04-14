// gmail checker

const gmailInput = document.querySelector('#gmail_input');
const gmailButton = document.querySelector('#gmail_button');
const gmailResult = document.querySelector('#gmail_result');

const regExp = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

gmailButton.onclick = () => {
    if (regExp.test(gmailInput.value)) {
        gmailResult.innerText = "Ok";
        gmailResult.style.color = 'green';
    } else {
        gmailResult.innerText = "Error";
        gmailResult.style.color = 'red';
    }
}

// move block

const parentBlock = document.querySelector('.parent_block');
const childBlock = document.querySelector('.child_block');

let posX = 0;
let posY = 0;
const maxX = parentBlock.clientWidth - childBlock.clientWidth;
const maxY = parentBlock.clientHeight - childBlock.clientHeight;

let direction = 0;

const moveBlock = () => {
    switch(direction) {
        case 0:
            if (posX < maxX) {
                posX++;
                childBlock.style.left = `${posX}px`;
            } else {
                direction = 1;
            }
            break;
        case 1:
            if (posY < maxY) {
                posY++;
                childBlock.style.top = `${posY}px`;
            } else {
                direction = 2;
            }
            break;
        case 2:
            if (posX > 0) {
                posX--;
                childBlock.style.left = `${posX}px`;
            } else {
                direction = 3;
            }
            break;
        case 3:
            if (posY > 0) {
                posY--;
                childBlock.style.top = `${posY}px`;
            } else {
                direction = 0;
            }
            break;
    }
    requestAnimationFrame(moveBlock);
};

moveBlock();

// Stopwatch

const seconds = document.querySelector('#seconds');
const startBtn = document.querySelector('#start');
const stopBtn = document.querySelector('#stop');
const resetBtn = document.querySelector('#reset');

let sec = 0
let timer = 0

const updateTimer = () => {
    seconds.textContent = sec;
}

const startTimer = () => {
    if (timer === 0) {
        timer = setInterval(() => {
            sec++
            updateTimer()
        },  1000)
    }
}

const stopTimer = () => {
    clearInterval(timer);
    timer = 0
    updateTimer()
}

updateTimer();

const resetTimer = () => {
    stopTimer();
    sec = 0;
    updateTimer();
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

// Characters

const defaultPhoto = '../images/default.png';
const xhrAgents = new XMLHttpRequest();
xhrAgents.open('GET', '../data/characters.json');
xhrAgents.setRequestHeader('Content-type', 'application/json');
xhrAgents.send();

xhrAgents.onload = () => {
    const data = JSON.parse(xhrAgents.response);
    const list = document.querySelector('.characters-list');

    data.forEach(character => {
        const card = document.createElement('div');
        card.classList.add('character-card');

        const photoWrapper = document.createElement('div');
        photoWrapper.classList.add('character-photo');

        const img = document.createElement('img');
        img.src = character.photo || defaultPhoto;
        photoWrapper.appendChild(img);

        const name = document.createElement('h3');
        name.textContent = character.name || 'Без имени';

        const collection = document.createElement('p');
        collection.textContent = `Collection: ${character.collection}`;

        const rarity = document.createElement('p');
        rarity.textContent = `Rarity: ${character.rarity}`;

        const operation = document.createElement('p');
        operation.textContent = `Operation: ${character.operation}`;

        card.appendChild(photoWrapper);
        card.appendChild(name);
        card.appendChild(collection);
        card.appendChild(rarity);
        card.appendChild(operation);

        list.appendChild(card);
    });
};


// any json

const xhr = new XMLHttpRequest();
xhr.open('GET', '../data/any.json');
xhr.setRequestHeader('Content-type', 'application/json');
xhr.send();

xhr.onload = () => {
    const weapons = JSON.parse(xhr.response);
    console.log(weapons);
};
