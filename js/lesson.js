// phone checker

const phoneInput = document.querySelector('#phone_input');
const phoneButton = document.querySelector('#phone_button');
const phoneResult = document.querySelector('#phone_result');

const regExp = /^\+996 [2579]\d{2} \d{2} \d{2} \d{2}$/

phoneButton.onclick = () => {
    if (regExp.test(phoneInput.value)) {
        phoneResult.innerText = "Ok";
        phoneResult.style.color = 'green';
    } else {
        phoneResult.innerText = "Error";
        phoneResult.style.color = 'red';
    }
}

// Асинхронность

