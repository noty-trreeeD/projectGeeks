// gmail checker

const gmailInput = document.querySelector('#gmail_input');
const gmailButton = document.querySelector('#gmail_button');
const gmailResult = document.querySelector('#gmail_result');

const regExp = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

gmailButton.onclick = () => {
    if (regExp.test(gmailInput.value)) {
        gmailResult.innerText = "Бета версия CS3 отправлена вам на почту";
        gmailResult.style.color = 'green';
    } else {
        gmailResult.innerText = "Не видать вам бетку";
        gmailResult.style.color = 'red';
    }
}

// move block

const parentBlock = document.querySelector('.parent_block');
const childBlock = document.querySelector('.child_block');

let posX = 0;
let posY = 0;
let velocityX = 2;
let velocityY = 2;

const maxX = parentBlock.clientWidth - childBlock.clientWidth;
const maxY = parentBlock.clientHeight - childBlock.clientHeight;

const getRandomGradient = () => {
    const h = Math.floor(Math.random() * 360);
    return `linear-gradient(90deg, hsl(${h}, 100%, 50%), hsl(${(h + 60) % 360}, 100%, 50%), hsl(${(h + 120) % 360}, 100%, 50%))`;
};

const moveDVD = () => {
    posX += velocityX;
    posY += velocityY;

    if (posX <= 0 || posX >= maxX) {
        velocityX *= -1;
        childBlock.style.background = getRandomGradient();
    }
    if (posY <= 0 || posY >= maxY) {
        velocityY *= -1;
        childBlock.style.background = getRandomGradient();
    }

    childBlock.style.left = `${posX}px`;
    childBlock.style.top = `${posY}px`;

    requestAnimationFrame(moveDVD);
};

moveDVD();

// Stopwatch

const beep = document.getElementById("beep");
const success = document.getElementById("success");
const defuseStart = document.getElementById("defuse-start");
const startBtn = document.getElementById("start");
const defuseBtn = document.getElementById("defuse");
const resetBtn = document.getElementById("restart");
const message = document.getElementById("message");
const progress = document.querySelector(".progress-bar");

let defuseInterval = null;
let bombTimer = null;
let gameStarted = false;
let bombPlanted = false;
let startTime = 0;
let bombPlantedTimer = null;

startBtn.addEventListener("click", () => {
    if (gameStarted) return;
    gameStarted = true;
    bombPlanted = false;
    message.textContent = "";
    progress.style.transition = "none";
    progress.style.width = "0%";
    beep.currentTime = 0;
    beep.play();
    startTime = Date.now();

    bombPlantedTimer = setTimeout(() => {
        bombPlanted = true;
        if (message.textContent === "Бомба ещё не установлена!") {
            message.textContent = "";
        }
    }, 5000);

    bombTimer = setTimeout(() => {
        message.textContent = "Lose! Бомба взорвалась!";
        progress.style.transition = "none";
        progress.style.width = "0%";
        gameStarted = false;
        bombPlanted = false;
    }, 50000);
});

defuseBtn.addEventListener("mousedown", () => {
    if (!gameStarted || !bombPlanted) {
        if (!bombPlanted) {
            message.textContent = "Бомба ещё не установлена!";
        }
        return;
    }
    if (!bombPlanted) {
        message.textContent = "Бомба ещё не установлена!";
        return;
    }

    defuseStart.currentTime = 0;
    defuseStart.play();

    progress.style.transition = "width 6s linear";
    progress.style.width = "100%";

    defuseInterval = setTimeout(() => {
        clearTimeout(bombTimer);
        beep.pause();
        success.play();
        const elapsed = Date.now() - startTime;
        const timeLeft = Math.max(0, 45000 - elapsed);
        const seconds = Math.floor(timeLeft / 1000);
        const milliseconds = timeLeft % 1000;
        message.innerHTML = `Bomb has been defused!<br>До взрыва бомбы оставалось ${seconds}.${milliseconds.toString().padStart(3, '0')} мс`;
        gameStarted = false;
    }, 6000);
});

defuseBtn.addEventListener("mouseup", () => {
    clearTimeout(defuseInterval);
    progress.style.transition = "none";
    progress.style.width = "0%";
});

resetBtn.addEventListener("click", () => {
    clearTimeout(defuseInterval);
    clearTimeout(bombTimer);
    clearTimeout(bombPlantedTimer);
    beep.pause();
    beep.currentTime = 0;
    success.pause();
    success.currentTime = 0;
    defuseStart.pause();
    defuseStart.currentTime = 0;
    progress.style.transition = "none";
    progress.style.width = "0%";
    message.textContent = "";
    gameStarted = false;
    bombPlanted = false;
});

// Characters

const defaultPhoto = '../images/default.png';
const list = document.querySelector('.characters-list');

const rarityLabels = {
    "Common": "Обычный",
    "Uncommon": "Необычный",
    "Rare": "Редкий",
    "Epic": "Эпический",
    "Legendary": "Легендарный",
    "Superior Agent": "Старший агент",
    "Exceptional Agent": "Исключительный агент"
};

const agentsFetch = async () => {
    try {
        const response = await fetch(`../data/characters.json`);
        const data = await response.json();

        data.forEach(character => {
            const card = document.createElement('div');
            card.classList.add('character-card');

            const name = character.name || 'Без имени';
            const photo = character.photo || defaultPhoto;
            const collection = character.collection || 'Неизвестно';
            const rawRarity = character.rarity || 'Common';
            const rarityClass = `rarity-${rawRarity.replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`;
            const operation = character.operation || 'Не указана';

            card.innerHTML = `
                <div class="character-photo">
                    <img src="${photo}" alt="${name}">
                </div>
                <h3>${name}</h3>
                <hr>
                <div class="character-details">
                    <p>Коллекция: ${collection}</p>
                    <p class="${rarityClass}">Редкость: ${rawRarity}</p>
                    <p>Операция: ${operation}</p>
                </div>`;
            list.appendChild(card);
        });

    } catch (error) {
        console.log(error);
    }
};

agentsFetch();


// any json

const anyFetch = async () => {
    try {
        const response = await fetch('../data/any.json');
        const json = await response.json();
        console.log(json);
    } catch (error) {
        console.error(error);
    }
}

anyFetch();

