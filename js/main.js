// CS slider

const slides = document.querySelectorAll('.slide');
const nextBtn = document.getElementById('cs-slider-next');
const prevBtn = document.getElementById('cs-slider-prev');
const dots = document.querySelectorAll('.dot');

let index = 0;
let intervalId;

function showSlide(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === index);
    });
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active-dot', idx === index);
    });
}

function nextSlide() {
    showSlide(index + 1);
    resetInterval();
}

function prevSlide() {
    showSlide(index - 1);
    resetInterval();
}

function resetInterval() {
    clearInterval(intervalId);
    intervalId = setInterval(() => showSlide(index + 1), 5000);
}

nextBtn.onclick = nextSlide;
prevBtn.onclick = prevSlide;

dots.forEach((dot, i) => {
    dot.onclick = () => {
        showSlide(i);
        resetInterval();
    };
});

intervalId = setInterval(() => showSlide(index + 1), 3000);
showSlide(index);

// Teams slider

const sliderLine = document.getElementById('sliderLine');
const cloneLine = sliderLine.cloneNode(true);
sliderLine.parentElement.appendChild(cloneLine);

let x = 0;
const speed = 1;
let paused = false;

const sliderTrack = sliderLine.parentElement;
sliderTrack.addEventListener('mouseenter', () => paused = true);
sliderTrack.addEventListener('mouseleave', () => paused = false);

function animate() {
    if (!paused) {
        x -= speed;
        if (Math.abs(x) >= sliderLine.offsetWidth) {
            x = 0;
        }

        sliderLine.style.transform = `translateX(${x}px)`;
        cloneLine.style.transform = `translateX(${x + sliderLine.offsetWidth}px)`;
    }

    requestAnimationFrame(animate);
}

animate();