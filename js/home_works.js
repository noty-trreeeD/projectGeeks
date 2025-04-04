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