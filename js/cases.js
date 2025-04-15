let cases = [];
let selectedCase = null;
let isCaseOpening = false;

// DOM элементы
const elements = {
    caseList: document.getElementById("caseList"),
    caseModal: document.getElementById("caseModal"),
    caseItemsContainer: document.getElementById("caseItems"),
    caseName: document.getElementById("caseName"),
    openBtn: document.getElementById("openCaseBtn"),
    resultModal: document.getElementById("resultModal"),
    itemImage: document.getElementById("itemImage"),
    itemName: document.getElementById("itemName"),
    itemRarity: document.getElementById("itemRarity"),
    closeButtons: document.querySelectorAll(".close-modal, .close-btn"),
    caseDisplay: document.querySelector(".case-display")
};

function loadCases() {
    showLoader(true);
    fetch("../data/cases.json")
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then(data => {
            cases = data;
            cases.forEach(applyDropChances);
            renderCaseList();
        })
        .catch(error => {
            console.error("Error loading cases:", error);
            showError("Failed to load cases. Please try again later.");
        })
        .finally(() => showLoader(false));
}

function applyDropChances(csCase) {
    const rarityChances = {
        "Mil-Spec": 79.92,
        "Restricted": 15.98,
        "Classified": 3.2,
        "Covert": 0.64,
        "★ Rare Special Items ★": 0.26
    };

    for (const key in csCase.loot) {
        csCase.loot[key].chance = rarityChances[csCase.loot[key].rarity] || 1;
    }
}

function renderCaseList() {
    elements.caseList.innerHTML = cases.map((c, i) => `
        <div class="case-card">
            <div class="case-card-inner">
                <h3>${c.name}</h3>
                <img src="${c.photo}" alt="${c.name}" loading="lazy">
            </div>
            <button class="btn open-case-btn" onclick="openCaseModal(${i})">Открыть</button>
        </div>
    `).join("");
}

window.openCaseModal = function(index) {
    if (isCaseOpening) return;
    selectedCase = cases[index];

    // Настройка модального окна кейса
    elements.caseName.textContent = selectedCase.name;
    elements.openBtn.textContent = "Открыть кейс";
    elements.caseModal.classList.add("active");

    // Заполнение предметами
    fillCaseItems();

    // Добавляем указатель в центр
    addCasePointer();
};

function fillCaseItems() {
    elements.caseItemsContainer.innerHTML = "";
    const items = Object.values(selectedCase.loot);

    // Создаем 60 случайных предметов
    Array.from({ length: 60 }, () => {
        const item = getRandomItemByChance(items);
        const rarityClass = getRarityClass(item.rarity);
        const itemDiv = document.createElement("div");
        itemDiv.className = `case-item ${rarityClass}`;
        itemDiv.innerHTML = `<img src="${item.photo}" alt="${item.name}" loading="lazy">`;
        elements.caseItemsContainer.appendChild(itemDiv);
    });

    // Сброс позиции
    elements.caseItemsContainer.style.transition = "none";
    elements.caseItemsContainer.style.transform = "translateX(0)";
}

function addCasePointer() {
    // Удаляем старый указатель если есть
    const oldPointer = elements.caseDisplay.querySelector(".case-pointer");
    if (oldPointer) oldPointer.remove();

    // Создаем новый указатель
    const pointer = document.createElement("div");
    pointer.className = "case-pointer";
    elements.caseDisplay.appendChild(pointer);
}

elements.openBtn.addEventListener("click", function() {
    if (isCaseOpening) return;
    isCaseOpening = true;

    // Параметры для расчета позиции
    const itemWidth = 200; // Фиксированная ширина элемента
    const visibleItems = 5; // Количество видимых элементов
    const centerOffset = 2; // Центральный элемент (индекс 2 из 5 видимых)

    // Выбираем случайный предмет (уже с учетом шансов)
    const items = Object.values(selectedCase.loot);
    const winningItemData = getRandomItemByChance(items);

    // Находим все элементы в контейнере
    const caseItems = document.querySelectorAll(".case-item");

    // Находим индекс элемента, который соответствует выигрышному предмету
    let winningIndex = -1;
    caseItems.forEach((item, index) => {
        if (item.querySelector("img").src.includes(winningItemData.photo)) {
            winningIndex = index;
        }
    });

    // Если не нашли совпадение (маловероятно), берем центральный элемент
    if (winningIndex === -1) winningIndex = Math.floor(caseItems.length / 2);

    // Рассчитываем конечную позицию так, чтобы выигрышный элемент был под указателем
    const containerWidth = elements.caseDisplay.offsetWidth;
    const targetPosition = (containerWidth / 2) - (itemWidth / 2) - (winningIndex * itemWidth);

    // Сброс текущей анимации
    elements.caseItemsContainer.style.transition = "none";
    elements.caseItemsContainer.style.transform = "translateX(0)";

    // Запуск анимации
    setTimeout(() => {
        elements.caseItemsContainer.style.transition = "transform 4s cubic-bezier(0.08, 0.82, 0.17, 1)";
        elements.caseItemsContainer.style.transform = `translateX(${targetPosition}px)`;

        // Плавное замедление в конце
        setTimeout(() => {
            elements.caseItemsContainer.style.transitionTimingFunction = "cubic-bezier(0.1, 0.2, 0.1, 1)";
        }, 3500);

        // Обработка результата
        setTimeout(() => {
            // Подсветка выигрышного элемента
            const winningItemElement = caseItems[winningIndex];
            winningItemElement.classList.add("active");

            // Показать модальное окно с результатом
            showWinningItem(winningItemElement);

            isCaseOpening = false;
        }, 4100);
    }, 10);
});

function showWinningItem(winningItem) {
    winningItem.classList.add("active");

    const img = winningItem.querySelector("img").src;
    const item = Object.values(selectedCase.loot).find(i => i.photo === img);
    const rarityClass = getRarityClass(item.rarity);

    // Настройка модального окна результата
    elements.itemImage.src = img;
    elements.itemImage.alt = item.name;
    elements.itemName.textContent = item.name;
    elements.itemRarity.textContent = item.rarity;
    elements.itemRarity.className = `rarity-label ${rarityClass}`;

    // Показываем результат
    elements.resultModal.classList.add("active");
    elements.resultModal.querySelector(".unboxed-item").className = `unboxed-item ${rarityClass}`;
}

// Закрытие модальных окон
function closeAllModals() {
    document.querySelectorAll(".modal").forEach(modal => {
        modal.classList.remove("active");
    });
    elements.caseItemsContainer.innerHTML = "";
    isCaseOpening = false;
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
    loadCases();
    elements.closeButtons.forEach(btn => btn.addEventListener("click", closeAllModals));
    window.addEventListener("click", (e) => e.target.classList.contains("modal") && closeAllModals());
});

// Вспомогательные функции
function getRarityClass(rarity) {
    return (rarity || "").toLowerCase()
        .replace(/\s/g, "-")
        .replace(/[★]/g, "");
}

function getRandomItemByChance(items) {
    const total = items.reduce((sum, i) => sum + i.chance, 0);
    let rand = Math.random() * total;
    for (let item of items) if ((rand -= item.chance) <= 0) return item;
    return items[items.length - 1];
}

function showLoader(show) {
    const loader = document.getElementById("loader") || createLoader();
    loader.style.display = show ? "flex" : "none";
}

function createLoader() {
    const loader = document.createElement("div");
    loader.id = "loader";
    loader.innerHTML = `<div class="loader-spinner"></div>`;
    document.body.appendChild(loader);
    return loader;
}

function playSound(type) {
    try {
        new Audio(`../sounds/${type}.mp3`).play().catch(e => console.log("Audio error:", e));
    } catch (e) {
        console.log("Sound error:", e);
    }
}