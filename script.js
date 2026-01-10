// Telegram (не ломает браузер)
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.expand();
  tg.ready();
}

let totalPlayers = 0;
let spyCount = 0;
let currentPlayer = 1;
let spies = [];
let currentLocation = "";

const locations = [
  "Невский проспект",
  "Дворцовая площадь",
  "Эрмитаж",
  "Казанский собор",
  "Метро Купчино",
  "ТЦ Галерея",
  "Золотое Яблоко",
  "Рив Гош",
  "Славянка",
  "Пушкин",
  "Катина квартира"
];

// Привязка кнопок ПОСЛЕ загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("startBtn").onclick = startGame;
  document.getElementById("showRoleBtn").onclick = revealRole;
  document.getElementById("hideRoleBtn").onclick = hideRole;
});

function startGame() {
  totalPlayers = Number(document.getElementById("players").value);
  spyCount = Number(document.getElementById("spies").value);

  if (spyCount >= totalPlayers) {
    alert("Шпионов должно быть меньше, чем игроков");
    return;
  }

  spies = [];
  currentPlayer = 1;

  while (spies.length < spyCount) {
    const r = Math.floor(Math.random() * totalPlayers) + 1;
    if (!spies.includes(r)) spies.push(r);
  }

  currentLocation = locations[Math.floor(Math.random() * locations.length)];

  document.getElementById("setup").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  showWaitScreen();
}

function showWaitScreen() {
  const wait = document.getElementById("waitScreen");
  const role = document.getElementById("roleScreen");

  document.getElementById("playerTitle").innerText = `Игрок ${currentPlayer}`;

  role.classList.add("hidden");
  wait.classList.remove("hidden");
}

function revealRole() {
  const roleText = document.getElementById("roleText");

  if (spies.includes(currentPlayer)) {
    roleText.innerHTML = `Ты <span class="spy">ШПИОН</span>`;
  } else {
    roleText.innerHTML = `Локация:<br><span class="location">${currentLocation}</span>`;
  }

  document.getElementById("waitScreen").classList.add("hidden");
  document.getElementById("roleScreen").classList.remove("hidden");
}

function hideRole() {
  currentPlayer++;

  if (currentPlayer > totalPlayers) {
    document.getElementById("game").classList.add("hidden");
    document.getElementById("end").classList.remove("hidden");
  } else {
    showWaitScreen();
  }
}
