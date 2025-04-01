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

const childBlock = document.querySelector('.child_block');
const moveBlockRight = (posX = 0) => {
    if (posX <= 449) {
        childBlock.style.left = `${posX}px`;
        requestAnimationFrame(() => moveBlockRight(
            posX + 1));
    }
};

moveBlockRight();