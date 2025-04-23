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

// Tab slider

const tabContentBlocks = document.querySelectorAll('.tab_content_block');
const tabs = document.querySelectorAll('.tab_content_item');
const tabsParent = document.querySelector('.tab_content_items');

const hideTabs = () => {
    tabContentBlocks.forEach(block => {
        block.style.display = 'none';
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
    element.oninput = async () => {
        try {
            const response = await fetch('../data/converter.json');
            const data = await response.json();

            const value = parseFloat(element.value);
            if (isNaN(value)) {
                somInput.value = '';
                usdInput.value = '';
                eurInput.value = '';
                return;
            }

            if (element.id === 'som') {
                usdInput.value = (value / data.usd).toFixed(2);
                eurInput.value = (value / data.eur).toFixed(2);
            }
            if (element.id === 'usd') {
                somInput.value = (value * data.usd).toFixed(2);
                eurInput.value = (value * data.usdEur).toFixed(2);
            }
            if (element.id === 'eur') {
                somInput.value = (value * data.eur).toFixed(2);
                usdInput.value = (value / data.usdEur).toFixed(2);
            }
        } catch (e) {
            console.log(e);
        }
    };
};

converter(somInput);
converter(usdInput);
converter(eurInput);

// Card switcher

const btnNext = document.querySelector('#btn-next');
const btnPrev = document.querySelector('#btn-prev');
const cardBlock = document.querySelector('.card-lessons');

let cardID = 1

const fetchTodos = async () => {
    try {
        const responseTodos = await fetch(`https://jsonplaceholder.typicode.com/todos/${cardID}`)
        const {title, completed, id} = await responseTodos.json()
        cardBlock.innerHTML = `
        <p>${title}</p>
        <p style="color: ${completed ? 'green' : 'red'}">
            ${completed}
        </p>
        <p>${id}</p>
    `
    } catch (e) {
        console.log(e)
    }
}

fetchTodos()

btnNext.onclick = () => {
    cardID = cardID < 200 ? cardID + 1 : 1;
    fetchTodos();
}

btnPrev.onclick = () => {
    cardID = cardID > 1 ? cardID - 1 : 200;
    fetchTodos();
}

const postsFetch = async () => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts`)
        const posts = await response.json();
        console.log(posts);
    } catch (e) {
        console.log(e)
    }
}

postsFetch();

// weather

const searchInput = document.querySelector('.cityName')
const searchBtn = document.querySelector('#search');
const cityName = document.querySelector('.city');
const cityTemp = document.querySelector('.temp');

const API_URL = 'http://api.openweathermap.org/data/2.5/weather';
const API_KEY = 'e417df62e04d3b1b111abeab19cea714'

searchBtn.onclick = async () => {
    try {
        if (searchInput.value !== '') {
            const responseWeather = await fetch(`${API_URL}?appid=${API_KEY}&q=${searchInput.value}&units=metric&lang=ru`)
            const dataWeather = await responseWeather.json();
            if (dataWeather.cod === '404') {
                cityName.innerHTML = 'Введите корректное название';
                cityTemp.innerHTML = '';
            } else {
                cityName.innerHTML = dataWeather.name;
                cityTemp.innerHTML = Math.round(dataWeather.main.temp) + 'ºC';
            }
            searchInput.value = ''
        } else {
            cityName.innerHTML = 'Введите название города';
            cityTemp.innerHTML = '';
        }
    } catch (error) {
        console.log(error);
    }

}