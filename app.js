const MAX_ADDEND = 9;
const MAX_SUM = 10;
const MAX_SUBTRACTION_NUMBER = 9;

function buildAdditionCards() {
  const cards = [];

  for (let left = 0; left <= MAX_ADDEND; left += 1) {
    for (let right = 0; right <= MAX_ADDEND; right += 1) {
      if (left + right <= MAX_SUM) {
        cards.push({ left, right, operator: "+", answer: left + right });
      }
    }
  }

  return cards;
}

function buildSubtractionCards() {
  const cards = [];

  for (let left = 0; left <= MAX_SUBTRACTION_NUMBER; left += 1) {
    for (let right = 0; right <= left; right += 1) {
      cards.push({ left, right, operator: "-", answer: left - right });
    }
  }

  return cards;
}

function shuffleCards(cards) {
  const shuffled = cards.slice();

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function runSelfCheck() {
  const additionCards = buildAdditionCards();
  const additionKeys = new Set(additionCards.map((card) => `${card.left}${card.operator}${card.right}`));
  const subtractionCards = buildSubtractionCards();
  const subtractionKeys = new Set(subtractionCards.map((card) => `${card.left}${card.operator}${card.right}`));

  if (additionCards.length !== 64) throw new Error(`expected 64 addition cards, got ${additionCards.length}`);
  if (!additionKeys.has("0+0")) throw new Error("missing 0+0");
  if (!additionKeys.has("9+1")) throw new Error("missing 9+1");
  if (additionCards.some((card) => card.answer > MAX_SUM)) throw new Error("addition answer exceeds 10");

  if (subtractionCards.length !== 55) throw new Error(`expected 55 subtraction cards, got ${subtractionCards.length}`);
  if (!subtractionKeys.has("0-0")) throw new Error("missing 0-0");
  if (!subtractionKeys.has("9-0")) throw new Error("missing 9-0");
  if (!subtractionKeys.has("9-9")) throw new Error("missing 9-9");
  if (subtractionKeys.has("0-9")) throw new Error("subtraction deck includes negative problem");
  if (subtractionCards.some((card) => card.answer < 0)) throw new Error("subtraction answer below 0");
}

function initApp() {
  const decks = {
    addition: {
      titleThai: "บัตรบวกเลข",
      titleJapanese: "たし算カード",
      cards: buildAdditionCards(),
    },
    subtraction: {
      titleThai: "บัตรลบเลข",
      titleJapanese: "ひき算カード",
      cards: buildSubtractionCards(),
    },
  };

  let activeDeck = decks.addition;
  let cards = activeDeck.cards;
  let deck = cards;
  let index = 0;
  let isFlipped = false;

  const homeScreen = document.querySelector("#home-screen");
  const practiceScreen = document.querySelector("#practice-screen");
  const additionDeckButton = document.querySelector("#addition-deck");
  const subtractionDeckButton = document.querySelector("#subtraction-deck");
  const homeButton = document.querySelector("#home-button");
  const appTitleThai = document.querySelector("#app-title span:first-child");
  const appTitleJapanese = document.querySelector("#app-title span[lang='ja']");
  const cardButton = document.querySelector("#flash-card");
  const question = document.querySelector("#question");
  const answer = document.querySelector("#answer");
  const frontFace = question.closest(".face-front");
  const backFace = answer.closest(".face-back");
  const progress = document.querySelector("#progress");
  const flipButton = document.querySelector("#flip-card");
  const flipButtonThai = flipButton.querySelector(".label-th");
  const flipButtonJapanese = flipButton.querySelector(".label-ja");
  const prevButton = document.querySelector("#prev-card");
  const nextButton = document.querySelector("#next-card");
  const orderedMode = document.querySelector("#ordered-mode");
  const randomMode = document.querySelector("#random-mode");

  function showHome() {
    homeScreen.hidden = false;
    practiceScreen.hidden = true;
    isFlipped = false;
  }

  function showPractice(deckName) {
    activeDeck = decks[deckName];
    cards = activeDeck.cards;
    deck = cards;
    index = 0;
    isFlipped = false;
    appTitleThai.textContent = activeDeck.titleThai;
    appTitleJapanese.textContent = activeDeck.titleJapanese;
    homeScreen.hidden = true;
    practiceScreen.hidden = false;
    setMode("ordered");
  }

  function setMode(mode) {
    deck = mode === "random" ? shuffleCards(cards) : cards;
    index = 0;
    isFlipped = false;
    orderedMode.classList.toggle("is-active", mode === "ordered");
    randomMode.classList.toggle("is-active", mode === "random");
    orderedMode.setAttribute("aria-pressed", String(mode === "ordered"));
    randomMode.setAttribute("aria-pressed", String(mode === "random"));
    render();
  }

  function render() {
    const card = deck[index];

    question.textContent = `${card.left} ${card.operator} ${card.right}`;
    answer.textContent = card.answer;
    progress.textContent = `ใบที่ ${index + 1} / ${deck.length} · ${index + 1} / ${deck.length} 枚`;
    cardButton.classList.toggle("is-flipped", isFlipped);
    cardButton.setAttribute("aria-label", isFlipped ? "กลับไปดูโจทย์ / 問題を見る" : "เปิดคำตอบ / 答えを見る");
    frontFace.setAttribute("aria-hidden", String(isFlipped));
    backFace.setAttribute("aria-hidden", String(!isFlipped));
    flipButtonThai.textContent = isFlipped ? "ดูโจทย์" : "ดูคำตอบ";
    flipButtonJapanese.textContent = isFlipped ? "問題を見る" : "答えを見る";
  }

  function flip() {
    isFlipped = !isFlipped;
    render();
  }

  function move(step) {
    index = (index + step + deck.length) % deck.length;
    isFlipped = false;
    render();
  }

  additionDeckButton.addEventListener("click", () => showPractice("addition"));
  subtractionDeckButton.addEventListener("click", () => showPractice("subtraction"));
  homeButton.addEventListener("click", showHome);
  cardButton.addEventListener("click", flip);
  flipButton.addEventListener("click", flip);
  prevButton.addEventListener("click", () => move(-1));
  nextButton.addEventListener("click", () => move(1));
  orderedMode.addEventListener("click", () => setMode("ordered"));
  randomMode.addEventListener("click", () => setMode("random"));

  showHome();
}

if (typeof document !== "undefined") {
  initApp();
}

if (typeof module !== "undefined" && require.main === module) {
  runSelfCheck();
}
