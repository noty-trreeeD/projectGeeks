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

// Tab slider

const tabContentBlocks = document.querySelectorAll('.tab_content_block');
const tabs = document.querySelectorAll('.tab_content_item');
const tabsParent = document.querySelector('.tab_content_items');

const hideTabs = () => {
    tabContentBlocks.forEach(block => {
        block.style.display = 'none';
        console.log('ok')
    })
    tabs.forEach(tab => {
        tab.classList.remove('tab_content_item_active');
    })
}

const showTabs = (i = 0) => {
    tabContentBlocks[i].style.display = 'block';
    tabs[i].classList.toggle('tab_content_item_active');
}

tabsParent.onclick = (event) => {
    if (event.target.classList.contains('tab_content_item')) {
        tabs.forEach((tab, index) => {
            if (event.target === tab) {
                hideTabs();
                showTabs(index);
            }
        })
    }
};

let currentIndex = 0;
let intervalId;

const startAutoSwitch = () => {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % tabs.length;
        hideTabs();
        showTabs(currentIndex);
    }, 3000);
};

tabsParent.onclick = (event) => {
    if (event.target.classList.contains('tab_content_item')) {
        tabs.forEach((tab, index) => {
            if (event.target === tab) {
                hideTabs();
                showTabs(index);
                currentIndex = index;
                startAutoSwitch();
            }
        });
    }
};

hideTabs();
showTabs();
startAutoSwitch();

// Converter

const usdInput = document.querySelector('#usd');
const somInput = document.querySelector('#som');
const eurInput = document.querySelector('#eur');

const converter = (element) => {
    element.oninput = () => {
        const xhrConverterRequest = new XMLHttpRequest();
        xhrConverterRequest.open('GET', '../data/converter.json');
        xhrConverterRequest.setRequestHeader('Content-Type', 'application/json');
        xhrConverterRequest.send();

        xhrConverterRequest.onload = () => {
            const data = JSON.parse(xhrConverterRequest.response);
            console.log(data);
            if (element.id === 'som') {
                usdInput.value = (element.value / data.usd).toFixed(2);
                eurInput.value = (element.value / data.eur).toFixed(2);
            }
            if (element.id === 'usd') {
                somInput.value = (element.value * data.usd).toFixed(2);
                eurInput.value = (element.value * data.usdEur).toFixed(2);
            }
            if (element.id === 'eur') {
                somInput.value = (element.value * data.eur).toFixed(2);
                usdInput.value = (element.value / data.usdEur).toFixed(2);
            }
            if (element.value === '') {
                somInput.value = '';
                usdInput.value = '';
                eurInput.value = '';
            }
        }
    }
}

converter(somInput)
converter(usdInput)
converter(eurInput)

// Card switcher

const btnNext = document.querySelector('#btn-next');
const btnPrev = document.querySelector('#btn-prev');
const cardBlock = document.querySelector('.card');

let cardID = 1

const fetchTodos = () => {
    fetch(`https://jsonplaceholder.typicode.com/todos/${cardID}`).then((response) => {
        response.json().then((data) => {
            const {title, completed, id} = data;
            cardBlock.innerHTML = `
                <p>${title}</p>
                <p style="color: ${completed ? 'green' : 'red'}">
                    ${completed}
                </p>
                <p>${id}</p>
            `
        })
    })
}

fetchTodos();

btnNext.onclick = (event) => {
    cardID++
    if (cardID !== 201) {
        fetchTodos();
    } else {
        cardID = 1;
        fetchTodos();
    }
}

btnPrev.onclick = (event) => {
    cardID--;
    if (cardID !== 0) {
        fetchTodos();
    } else {
        cardID = 200;
        fetchTodos();
    }
}

fetch(`https://jsonplaceholder.typicode.com/posts`).then((response) => {
    response.json().then((data) => {
        console.log(data);
    })
})
