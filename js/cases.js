let cases = [];
let selectedCase = null;
let isCaseOpening = false;

const scrollSound = document.getElementById("scrollSound");
const endBounceSound = document.getElementById("endBounceSound");


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
    closeButtons: document.querySelectorAll(".close-modal, .close-button"),
    caseDisplay: document.querySelector(".case-display")
};

async function loadCases() {
    try {
        const response = await fetch("../data/cases.json");
        const data = await response.json();
        cases = data;
        cases.forEach(applyDropChances);
        renderCaseList();
    } catch (error) {
        console.error(error);
    }
}

function applyDropChances(csCase) {
    const rarityChances = {
        "Mil-Spec": 30,
        "Restricted": 30,
        "Classified": 20,
        "Covert": 12,
        "★ Rare Special Items ★": 8
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
            <button class="button open-case-button" onclick="openCaseModal(${i})">Открыть</button>
        </div>
    `).join("");
}

window.openCaseModal = function(index) {
    if (isCaseOpening) return;
    selectedCase = cases[index];

    elements.caseName.textContent = selectedCase.name;
    elements.openBtn.textContent = "Открыть кейс";
    elements.caseModal.classList.add("active");

    fillCaseItems();
    addCasePointer();
};

function fillCaseItems() {
    elements.caseItemsContainer.innerHTML = "";
    const items = Object.values(selectedCase.loot);

    Array.from({ length: 80 }, () => {
        const item = getRandomItemByChance(items);
        const rarityClass = getRarityClass(item.rarity);
        const itemDiv = document.createElement("div");
        itemDiv.className = `case-item ${rarityClass}`;
        itemDiv.innerHTML = `<img src="${item.photo}" alt="${item.name}" loading="lazy">`;
        elements.caseItemsContainer.appendChild(itemDiv);
    });

    elements.caseItemsContainer.style.transition = "none";
    elements.caseItemsContainer.style.transform = "translateX(0)";
}

function addCasePointer() {
    const oldPointer = elements.caseDisplay.querySelector(".case-pointer");
    if (oldPointer) oldPointer.remove();

    const pointer = document.createElement("div");
    pointer.className = "case-pointer";
    elements.caseDisplay.appendChild(pointer);
}

elements.openBtn.addEventListener("click", function () {
    if (isCaseOpening) return;
    isCaseOpening = true;

    scrollSound.playbackRate = 1.25;
    scrollSound.currentTime = 0;
    scrollSound.play();


    setTimeout(() => {
        scrollSound.pause();
        endBounceSound.currentTime = 0;
        endBounceSound.play();
    }, 8000);

    const itemWidth = 200;
    const items = Object.values(selectedCase.loot);
    const winningItemData = getRandomItemByChance(items);
    const caseItems = document.querySelectorAll(".case-item");

    let winningIndex = -1;
    caseItems.forEach((item, index) => {
        if (item.querySelector("img").src.endsWith(winningItemData.photo)) {
            winningIndex = index;
        }
    });

    if (winningIndex === -1) winningIndex = Math.floor(caseItems.length / 2);

    const containerWidth = elements.caseDisplay.offsetWidth;
    const targetPosition = (containerWidth / 2) - (itemWidth / 2) - (winningIndex * itemWidth);

    elements.caseItemsContainer.style.transition = "transform 8s cubic-bezier(0.08, 0.82, 0.17, 1)";
    elements.caseItemsContainer.style.transform = `translateX(${targetPosition}px)`;

    setTimeout(() => {
        const winningItemElement = caseItems[winningIndex];
        showWinningItem(winningItemElement);
        isCaseOpening = false;
    }, 8100); // учёл небольшую задержку под конец
});


function showWinningItem(winningItem) {
    const img = winningItem.querySelector("img").src;
    const item = Object.values(selectedCase.loot).find(i => img.endsWith(i.photo));
    const rarityClass = getRarityClass(item.rarity);

    elements.itemImage.src = img;
    elements.itemImage.alt = item.name;
    elements.itemName.textContent = item.name;
    elements.itemRarity.textContent = item.rarity;
    elements.itemRarity.className = `rarity-label ${rarityClass}`;

    elements.resultModal.classList.add("active");
    elements.resultModal.querySelector(".unboxed-item").className = `unboxed-item ${rarityClass}`;
}

function closeAllModals() {
    document.querySelectorAll(".modal").forEach(modal => {
        modal.classList.remove("active");
    });
    elements.caseItemsContainer.innerHTML = "";
    isCaseOpening = false;
}

document.addEventListener("DOMContentLoaded", () => {
    loadCases();
    elements.closeButtons.forEach(btn => btn.addEventListener("click", closeAllModals));
    window.addEventListener("click", (e) => e.target.classList.contains("modal") && closeAllModals());
});

function getRarityClass(rarity) {
    return (rarity || "").toLowerCase().replace(/\s/g, "-").replace(/[★]/g, "");
}

function getRandomItemByChance(items) {
    const total = items.reduce((sum, i) => sum + i.chance, 0);
    let rand = Math.random() * total;
    for (let item of items) if ((rand -= item.chance) <= 0) return item;
    return items[items.length - 1];
}
