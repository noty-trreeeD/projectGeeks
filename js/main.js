// CS slider

const slides = document.querySelectorAll('.slide');
const nextBtn = document.getElementById('cs-slider-next');
const prevBtn = document.getElementById('cs-slider-prev');
const dots = document.querySelectorAll('.dot');

let index = 0;

function showSlide(i) {
    slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === i);
    });
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active-dot', idx === i);
    });
}

nextBtn.onclick = () => {
    index = (index + 1) % slides.length;
    showSlide(index);
};

prevBtn.onclick = () => {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
};

dots.forEach((dot, i) => {
    dot.onclick = () => {
        index = i;
        showSlide(index);
    };
});

function autoSlide() {
    index = (index + 1) % slides.length;
    showSlide(index);
}

// Автоматическое переключение слайдов каждые 5 секунд
setInterval(autoSlide, 5000);

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