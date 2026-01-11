const tg = window.Telegram?.WebApp;
if (tg) {
  tg.expand();
  tg.ready();
}

// ===== DOM =====
const playersInput = document.getElementById("players");
const spiesInput = document.getElementById("spies");
const roomCode = document.getElementById("roomCode");

const codeInput = document.getElementById("codeInput");
const playerIndex = document.getElementById("playerIndex");

const create = document.getElementById("create");
const join = document.getElementById("join");
const roleScreen = document.getElementById("roleScreen");
const roleText = document.getElementById("roleText");

// ===== ЛОКАЦИИ =====
const locations = [
  "Метро Купчино",
  "ТЦ Галерея",
  "Золотое Яблоко",
  "Рив Гош",
  "Ночной клуб",
  "Бар на Невском",
  "Секретная квартира",
  "Стрип-клуб"
];

// ===== УТИЛИТЫ =====
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// ===== СОЗДАНИЕ КОМНАТЫ =====
function createRoom() {
  const players = Number(playersInput.value);
  const spies = Number(spiesInput.value);

  if (!players || !spies || spies >= players) {
    alert("Проверь числа");
    return;
  }

  const seed = Math.random().toString(36).substring(2, 6).toUpperCase();
  const code = `SPY-${players}-${spies}-${seed}`;

  roomCode.textContent = "КОД КОМНАТЫ:\n" + code;
  roomCode.classList.remove("hidden");
}

// ===== ПОКАЗ РОЛИ =====
function showRole() {
  const raw = codeInput.value.trim().toUpperCase();
  const index = Number(playerIndex.value) - 1;

  const parts = raw.split("-");
  if (parts.length !== 4 || parts[0] !== "SPY") {
    alert("Неверный код комнаты");
    return;
  }

  const players = Number(parts[1]);
  const spies = Number(parts[2]);
  const seed = parts[3];

  if (index < 0 || index >= players) {
    alert("Неверный номер игрока");
    return;
  }

  const rand = seededRandom(hashCode(seed));
  const roles = Array(players).fill("civil");

  let placed = 0;
  while (placed < spies) {
    const i = Math.floor(rand() * players);
    if (roles[i] !== "spy") {
      roles[i] = "spy";
      placed++;
    }
  }

  const location = locations[Math.floor(rand() * locations.length)];

  create.classList.add("hidden");
  join.classList.add("hidden");
  roleScreen.classList.remove("hidden");

  roleText.innerHTML =
    roles[index] === "spy"
      ? `Ты <span class="spy">ШПИОН</span>`
      : `Локация:<br><span class="location">${location}</span>`;
}

// ===== СБРОС =====
function reset() {
  location.reload();
}
