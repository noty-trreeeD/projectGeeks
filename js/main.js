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