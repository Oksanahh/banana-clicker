const BANANA_PEEL_PRICE = 50;

let bananaCount = parseInt(localStorage.getItem('bananaCount')) || 0;
let monkeyCount = parseInt(localStorage.getItem('monkeyCount')) || 0;
let bananaPeelCount = parseInt(localStorage.getItem('bananaPeelCount')) || 0;
let bananaLeafCount = parseInt(localStorage.getItem('bananaLeafCount')) || 0;
let bananaSmoothieCount = parseInt(localStorage.getItem('bananaSmoothieCount')) || 0;

let smoothieActive = false;
let smoothieTimeLeft    = 0;     
let smoothieCountdownId;  



function proceed() {

document.querySelector('.popUp').style.display = 'none';
document.getElementById('clicker').style.display = 'block';

document.body.classList.add('calcMode')
document.documentElement.classList.add('calcMode');

const bg = document.getElementById('backgroundMusic');
bg.currentTime = 0;
bg.volume = 0.5;
bg.play();
bg.loop = true;  
}

function collectBanana(event) {
  const gain = 1 + bananaPeelCount
              + (smoothieActive ? 3 : 0);

  
              bananaCount += gain;
              updateDisplay();
              showFloatText(gain, event);
            

  const clickSound = document.getElementById('click-sound');
  clickSound.currentTime = 0;
  clickSound.volume = 0.05;
  clickSound.play();
}

function updateDisplay() {
  document.getElementById('bananaPeelCount').textContent = bananaPeelCount;
  
  document.getElementById('bananaCount').textContent =
  Number.isInteger(bananaCount)
    ? bananaCount
    : bananaCount.toFixed(1);
    document.getElementById('monkeyCount').textContent = monkeyCount;

  localStorage.setItem('bananaCount', bananaCount);
  localStorage.setItem('monkeyCount', monkeyCount);
  localStorage.setItem('bananaPeelCount', bananaPeelCount);

  document.getElementById('bananaLeafCount').textContent = bananaLeafCount;
  localStorage.setItem('bananaLeafCount', bananaLeafCount);

  const smoothieEl = document.getElementById('bananaSmoothieCount');
if (smoothieActive) {
  smoothieEl.textContent = smoothieTimeLeft + 's';
} else {
  smoothieEl.textContent = bananaSmoothieCount;
}
  localStorage.setItem('bananaSmoothieCount', bananaSmoothieCount);
}

function buyMonkey() {

  const monkeySound = document.getElementById('buy-sound');
  monkeySound.currentTime = 0; 
  monkeySound.play();
  monkeySound.volume = 1  ;
  monkeySound.playbackRate  = 0.8; 

  if (bananaCount >= 10) {
    bananaCount -= 10;
    monkeyCount++;
    updateDisplay();
  } else {
    showNotification("Не вистачає бананів!");
    }
}

setInterval(() => {
  bananaCount = Number(
    (
      bananaCount
      + monkeyCount * 0.2
      + bananaLeafCount
    ).toFixed(1)
  );
  updateDisplay();
}, 1000);

function resetGame() {
  if(confirm("Are you sure you want to reset ALL progress?")) {
    bananaCount = 0;
    monkeyCount = 0;
    bananaPeelCount = 0;
    bananaLeafCount  = 0; 
    bananaSmoothieCount  = 0; 
    
    localStorage.clear();
    updateDisplay();
  }
}

function buyItem(item) {
  if (item === 'peel') {
    const peelPrice = BANANA_PEEL_PRICE;

    if (bananaCount >= peelPrice) {
      bananaCount -= peelPrice;
      bananaPeelCount++;
      
      const peelElement = document.querySelector('.bananaPeel');
      peelElement.classList.add('pulse');
      setTimeout(() => peelElement.classList.remove('pulse'), 300);
      
      updateDisplay();
    } else {
      showNotificationBananaPeel("Потрібно 50 бананів!");
    }
  }
}

function buyLeaf() {
  const price = 200;
  if (bananaCount >= price) {
    bananaCount    -= price;
    bananaLeafCount++;
    updateDisplay();
  } else {
    showNotification("Потрібно 200 бананів!");
  }
}


function showNotificationBananaPeel(message, duration = 1500) {
  const note = document.getElementById('notificationBananaPeel');
  note.textContent = message;
  note.classList.add('show');

  setTimeout(() => {
    note.classList.remove('show');
  }, duration);
}

function showNotification(message, duration = 1500) {
  const note = document.getElementById('notification');
  note.textContent = message;
  note.classList.add('show');

  setTimeout(() => {
    note.classList.remove('show');
  }, duration);
}

function showFloatText(amount, clickEvent) {
  const { pageX, pageY } = clickEvent;

  const span = document.createElement('span');
  span.className   = 'float-text';
  span.textContent = `+${amount}`;

  span.style.left = `${pageX}px`;
  span.style.top  = `${pageY}px`;

  document.body.appendChild(span);

  span.addEventListener('animationend', () => span.remove());
}

document.addEventListener('DOMContentLoaded', () => {
  const bg   = document.getElementById('backgroundMusic');
  const icon = document.getElementById('sound-icon');
  const btn  = document.getElementById('sound-toggle');

  btn.addEventListener('click', () => {
    bg.muted = !bg.muted;
    icon.src = bg.muted ? 'nohear.png' : 'yesmusic.png';
  });
});

document.addEventListener('dragstart', e => e.preventDefault());

function buySmoothie() {
  const price = 300;
  const btn   = document.getElementById('smoothie-button');

  if (btn.disabled)      return showNotification("Смузі перезаряджується!");
  if (bananaCount < price) return showNotification("Потрібно 300 бананів!");

  // 1) Pay & record purchase
  bananaCount         -= price;
  bananaSmoothieCount += 1;
  localStorage.setItem('bananaSmoothieCount', bananaSmoothieCount);

  // 2) Activate buff
  smoothieActive   = true;
  smoothieTimeLeft = 15;      // start at 15s
  btn.disabled     = true;    // begin cooldown on purchase
  updateDisplay();            // immediately show “15s”

  // 3) Countdown interval
  clearInterval(smoothieCountdownId);
  smoothieCountdownId = setInterval(() => {
    smoothieTimeLeft--;
    if (smoothieTimeLeft <= 0) {
      clearInterval(smoothieCountdownId);
      smoothieActive = false;
    }
    updateDisplay();
  }, 1000);

  // 4) Re-enable button after 60s
  setTimeout(() => {
    btn.disabled = false;
  }, 60_000);
}