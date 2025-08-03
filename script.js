let altitude = 0;
let timeLeft = 0; // v sekundách

// Načti data z localStorage nebo začni od nuly
function loadState() {
  altitude = parseFloat(localStorage.getItem('altitude')) || 0;
  timeLeft = parseInt(localStorage.getItem('timeLeft')) || 0;
}

function saveState() {
  localStorage.setItem('altitude', altitude);
  localStorage.setItem('timeLeft', timeLeft);
}

function updateFalcon() {
  const falcon = document.getElementById('falcon');
  falcon.style.bottom = `${altitude}px`;
}

function updateTimer() {
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  let timeString = '';
  if (hours > 0) timeString += `${hours}h `;
  if (minutes > 0 || hours > 0) timeString += `${minutes}m `;
  timeString += `${seconds}s`;

  document.getElementById('timer').innerText = `Čas: ${timeString}`;
}

function addDrink() {
  const drink = document.getElementById('drink').value;
  const amount = parseInt(document.getElementById('amount').value);

  let pointsPerUnit = 1;
  if (drink === 'beer') pointsPerUnit = 1;
  else if (drink === 'shot') pointsPerUnit = 2;

  const points = pointsPerUnit * amount;

  altitude += points * 30;
  timeLeft += points * 60 * 60;

  updateFalcon();
  updateTimer();
  saveState();

  const drinkName = drink === 'beer' ? 'pivo' : 'panák';
  document.getElementById('message').innerText =
    `Za konzumaci ${amount}× ${drinkName} bylo přidáno ${points * 60} sekund letu.`;

  setTimeout(() => {
    document.getElementById('message').innerText = '';
  }, 5000);
}

function resetGame() {
  altitude = 0;
  timeLeft = 0;
  updateFalcon();
  updateTimer();
  saveState();
  document.getElementById('message').innerText = 'Hra byla resetována.';
  setTimeout(() => {
    document.getElementById('message').innerText = '';
  }, 3000);
}

loadState();
updateFalcon();
updateTimer();

// Časovač, co odečítá každou sekundu a aktualizuje
setInterval(() => {
  if (timeLeft > 0) {
    timeLeft--;
    updateFalcon();
    updateTimer();
    saveState();
  } else {
    // Sokola nech spadnout, když dojde čas
    if (altitude > 0) {
      altitude -= 5; // padání sokola
      if (altitude < 0) altitude = 0;
      updateFalcon();
      saveState();
    }
  }
}, 1000);

const rainContainer = document.getElementById('rain');

function createDrop() {
  const drop = document.createElement('div');
  drop.classList.add('drop');

  // Náhodná pozice X (široká obrazovka)
  drop.style.left = Math.random() * window.innerWidth + 'px';

  // Náhodná rychlost mezi 0.5s a 1.5s
  const duration = 0.5 + Math.random();

  drop.style.animationDuration = duration + 's';

  rainContainer.appendChild(drop);

  // Odstranění kapky po animaci (délce trvání)
  setTimeout(() => {
    rainContainer.removeChild(drop);
  }, duration * 1000);
}

// Generování kapek co 100 ms
setInterval(() => {
  // Náhodně spustíme déšť jen někdy (např. 70% šance)
  if (Math.random() < 0.7) {
    createDrop();
  }
}, 100);

const lightning = document.getElementById('lightning-flash');

function flashLightning() {
  lightning.style.animation = 'lightning 0.2s ease-in-out 3';

  setTimeout(() => {
    lightning.style.animation = '';
  }, 600);
}

// Náhodný blesk každých 15-30 sekund
setInterval(() => {
  if (Math.random() < 0.3) {
    flashLightning();
  }
}, 15000 + Math.random() * 15000);

function confirmReset() {
  if (confirm("Opravdu chcete hru resetovat? Všechna data budou ztracena.")) {
    resetGame();
  }
}
