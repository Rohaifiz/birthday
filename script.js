let density = 3;
let distance = 0;
let speed = 200; // Faster loading (every 200ms)
const directions = ['top', 'right', 'bottom', 'left'];
let isPaused = false;

const images = [
  "Picture/img1.jpg",
  "Picture/img2.jpg",
  "Picture/img3.jpg",
  "Picture/img4.jpg",
  "Picture/img6.jpg",
  "Picture/img8.jpg",
  "Picture/img9.jpg",
  "Picture/img10.jpg",
  "Picture/img12.jpg",
  "Picture/img13.jpg",
  "Picture/img14.jpg",
  "Picture/img15.jpg",
  "Picture/img16.jpg",
  "Picture/img17.jpg",
  "Picture/img18.jpg"
];

function preloadImages(srcArray, callback) {
  let loaded = 0;
  srcArray.forEach(src => {
    const img = new Image();
    img.onload = () => {
      loaded++;
      if (loaded === srcArray.length) callback();
    };
    img.src = src;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  preloadImages(images, () => { renderWalls(); });
});

const allGridElements = [];
let intervalId;

function renderWalls() {
  const gridContainer = document.querySelector('.inf-grid-hero-container');
  gridContainer.style.setProperty('--grid-sz', density);
  gridContainer.style.setProperty('--rev-dis', distance);

  allGridElements.length = 0;

  directions.forEach(dir => {
    const parent = document.querySelector(`.${dir}`);
    if (!parent) return;
    parent.innerHTML = '';
    const total = density * density;
    for (let i = 1; i <= total; i++) {
      const div = document.createElement('div');
      div.classList.add(`${dir.charAt(0)}${i}`);
      parent.appendChild(div);
      allGridElements.push(div);
    }
  });

  startImageInterval();
}

let loadedCount = 0;
let totalElementsToLoad = 0;

function startImageInterval() {
  if (intervalId) clearInterval(intervalId);
  loadedCount = 0;
  totalElementsToLoad = allGridElements.length;

  intervalId = setInterval(() => {
    if (isPaused) return;
    const unloadedElements = allGridElements.filter(el => !el.classList.contains('loaded'));
    if (unloadedElements.length === 0) return;

    const randomElement = unloadedElements[Math.floor(Math.random() * unloadedElements.length)];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    randomElement.style.background = `url('${randomImage}')`;
    randomElement.classList.add('loaded');
    loadedCount++;

    randomElement.addEventListener('click', () => { 
      randomElement.classList.add('selected');
      randomElement.parentNode.classList.add('selectedPane');
      pauseInterval();
    });

    if (loadedCount >= totalElementsToLoad) {
      clearInterval(intervalId);
      document.dispatchEvent(new Event('allImagesLoaded'));
    }
  }, speed);
}

function pauseInterval() {
  isPaused = true;
}

function resumeInterval() {
  document.querySelector('.selected')?.classList.remove('selected');
  document.querySelector('.selectedPane')?.classList.remove('selectedPane');
  if (!isPaused) return;
  isPaused = false;
  startImageInterval();
}

document.getElementById('back-btn').addEventListener('click', resumeInterval);

document.querySelector('.button').addEventListener('click', () => {
  const newValue = distance === 100 ? 0 : 100;
  animateDistance(newValue, 1000);
});

function animateDistance(toValue, duration = 600) {
  const el = document.querySelector('.inf-grid-hero-container');
  const fromValue = distance;
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    distance = fromValue + (toValue - fromValue) * eased;
    el.style.setProperty('--rev-dis', distance.toFixed(2));
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

document.addEventListener('allImagesLoaded', () => {
  document.body.classList.add('all-loaded');
  console.log('All images loaded!');
});
