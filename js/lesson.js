// phone checker

const phoneInput = document.querySelector('#phone_input');
const phoneButton = document.querySelector('#phone_button');
const phoneSpeech = document.querySelector('#phone_speech');

const regExp = /^\+996 [2579]\d{2} \d{2} \d{2} \d{2}$/

phoneButton.onclick = () => {
    if (regExp.test(phoneInput.value)) {
        phoneSpeech.style.color = 'green';

        const operatorCode = phoneInput.value.slice(5, 8);
        let operator = "";

        if (/^(70)/.test(operatorCode)) {
            operator = "Это точно O!";
        } else if (/^(22|77)/.test(operatorCode)) {
            operator = "Я уверен — Beeline!"
        }
        else if (/^(50|55)/.test(operatorCode)) {
            operator = "Хм... это Megacom!";
        }
        phoneSpeech.innerText = operator;
    } else if (phoneInput.value === '') {
        phoneSpeech.innerText = "Введи номер в поле справа";
        phoneSpeech.style.color = 'red';
    }
    else {
        phoneSpeech.innerText = "Я не могу угадать, проверь номер";
        phoneSpeech.style.color = 'red';
    }
}

// Tab slider

document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.team-slide');
    let intervalId;

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('tab-btn')) {
            const tabId = e.target.getAttribute('data-tab');

            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');
            slides.forEach(slide => {
                slide.classList.remove('active');
            });

            document.querySelector(`.team-slide[data-tab-content="${tabId}"]`).classList.add('active');

            clearInterval(intervalId);
            intervalId = setInterval(autoSlide, 5000);
        }
    });

    let currentTab = 0;
    const tabButtons = document.querySelectorAll('.tab-btn');

    function autoSlide() {
        const activeTab = document.querySelector('.tab-btn.active');
        if (!activeTab) return;

        currentTab = Array.from(tabButtons).indexOf(activeTab);
        currentTab = (currentTab + 1) % tabButtons.length;
        tabButtons[currentTab].click();
    }
    intervalId = setInterval(autoSlide, 3000);
});



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
        <div class="cardSwithcer">
            <p>${title}</p>
            <p style="color: ${completed ? 'green' : 'red'}">
                ${completed}
            </p>
            <p>${id}</p>
        </div>
        
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