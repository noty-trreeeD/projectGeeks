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