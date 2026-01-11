const tg = window.Telegram?.WebApp;
if (tg) {
  tg.expand();
  tg.ready();
}

// DOM
const playersInput = document.getElementById("players");
const spiesInput = document.getElementById("spies");
const roomCode = document.getElementById("roomCode");
const codeInput = document.getElementById("codeInput");
const playerIndex = document.getElementById("playerIndex");

const create = document.getElementById("create");
const join = document.getElementById("join");
const roleScreen = document.getElementById("roleScreen");
const roleText = document.getElementById("roleText");

// Категории
const locationGroups = {
  SPB: ["Невский проспект","Дворцовая площадь","Эрмитаж","Исаакиевский собор","Крестовский остров","Казанский собор","Летний сад","Московский вокзал"],
  CLUBS: ["Клуб «Виновница»","Клуб «Москва»","Клуб «Доски»","Контакт бар"],
  MALLS: ["Галерея","Ситимолл","Лето","Европолис","Континент","ТЦ Балканский"],
  FUN: ["Шаверма у метро","Красное Белое","Очередь в Пятёрочке","Остановка под дождём","Такси, которое «уже подъезжает»","Примерочная в ТЦ","Очередь в New Yorker"],
  KUPCHINO: ["Переход у метро Купчино","Балканская площадь","Рынок у Купчино","Остановка у Купчино","Шаверма у Купчино","Ж/Д Купчино"],
  SLAVYANKA: ["ТРК Green Park","Спар","Поле 645","Новая 604","Поле 511","Двор тенниса","Шаверма в Славянке","Квартира Кати"],
  PUSHKIN: ["Екатерининский дворец","Александровский парк","Софийский собор","Вокзал Пушкин","Ачарули","Токио Сити в Пушкине"],
  BEAUTY: ["Золотое Яблоко","Рив Гош","Л’Этуаль","Подружка","Ив Роше","Магнит Косметик","Sephora"],
  CLOTHES: ["ZARA","Lime","H&M","Pull&Bear","Bershka","Stradivarius","New Yorker"]
};

let selectedCategory = "SPB";

// выбор категории
document.querySelectorAll(".cat").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".cat").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedCategory = btn.dataset.cat;
  };
});

// utils
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

// create room
function createRoom() {
  const players = Number(playersInput.value);
  const spies = Number(spiesInput.value);

  if (!players || !spies || spies >= players) {
    alert("Проверь числа");
    return;
  }

  const seed = Math.random().toString(36).substring(2, 6).toUpperCase();
  const code = `SPY-${players}-${spies}-${selectedCategory}-${seed}`;

  roomCode.textContent = "КОД КОМНАТЫ:\n" + code;
  roomCode.classList.remove("hidden");
}

// show role
function showRole() {
  const raw = codeInput.value.trim().toUpperCase();
  const index = Number(playerIndex.value) - 1;

  const parts = raw.split("-");
  if (parts.length !== 5 || parts[0] !== "SPY") {
    alert("Неверный код комнаты");
    return;
  }

  const players = Number(parts[1]);
  const spies = Number(parts[2]);
  const category = parts[3];
  const seed = parts[4];

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

  const locations = locationGroups[category];
  const location = locations[Math.floor(rand() * locations.length)];

  create.classList.add("hidden");
  join.classList.add("hidden");
  roleScreen.classList.remove("hidden");

  roleText.innerHTML =
    roles[index] === "spy"
      ? `Ты <span class="spy">ШПИОН</span>`
      : `Локация:<br><span class="location">${location}</span>`;
}

function reset() {
  location.reload();
}
