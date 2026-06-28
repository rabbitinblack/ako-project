const MAX_ADDEND = 9;
const MAX_SUM = 10;
const MAX_SUBTRACTION_LEFT = 10;
const MIN_LEVEL_2_NUMBER = 2;
const MAX_LEVEL_2_NUMBER = 9;
const MIN_LEVEL_2_SUM = 11;
const MAX_LEVEL_2_SUM = 18;

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

  for (let left = 0; left <= MAX_SUBTRACTION_LEFT; left += 1) {
    cards.push({ left, right: 0, operator: "-", answer: left });
  }

  for (let left = 2; left <= MAX_SUBTRACTION_LEFT; left += 1) {
    for (let right = 1; right < left; right += 1) {
      cards.push({ left, right, operator: "-", answer: left - right });
    }
  }

  return cards;
}

function buildAdditionLevel2Cards() {
  const cards = [];

  for (let left = MIN_LEVEL_2_NUMBER; left <= MAX_LEVEL_2_NUMBER; left += 1) {
    for (let right = MIN_LEVEL_2_SUM - left; right <= MAX_LEVEL_2_NUMBER; right += 1) {
      cards.push({ left, right, operator: "+", answer: left + right });
    }
  }

  return cards;
}

function buildSubtractionLevel2Cards() {
  const cards = [];

  for (let left = MIN_LEVEL_2_SUM; left <= MAX_LEVEL_2_SUM; left += 1) {
    for (let right = left - MAX_LEVEL_2_NUMBER; right <= MAX_LEVEL_2_NUMBER; right += 1) {
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
  const additionLevel2Cards = buildAdditionLevel2Cards();
  const additionLevel2Keys = new Set(additionLevel2Cards.map((card) => `${card.left}${card.operator}${card.right}`));
  const subtractionLevel2Cards = buildSubtractionLevel2Cards();
  const subtractionLevel2Keys = new Set(subtractionLevel2Cards.map((card) => `${card.left}${card.operator}${card.right}`));

  if (additionCards.length !== 64) throw new Error(`expected 64 addition cards, got ${additionCards.length}`);
  if (!additionKeys.has("0+0")) throw new Error("missing 0+0");
  if (!additionKeys.has("9+1")) throw new Error("missing 9+1");
  if (additionCards.some((card) => card.answer > MAX_SUM)) throw new Error("addition answer exceeds 10");

  if (subtractionCards.length !== 56) throw new Error(`expected 56 subtraction cards, got ${subtractionCards.length}`);
  if (subtractionCards[0].left !== 0 || subtractionCards[0].right !== 0) throw new Error("subtraction deck must start with 0-0");
  if (subtractionCards[10].left !== 10 || subtractionCards[10].right !== 0) throw new Error("subtraction deck must list 10-0 before positive subtrahends");
  if (subtractionCards[11].left !== 2 || subtractionCards[11].right !== 1) throw new Error("subtraction deck must continue with 2-1");
  if (!subtractionKeys.has("10-9")) throw new Error("missing 10-9");
  if (subtractionKeys.has("0-9")) throw new Error("subtraction deck includes negative problem");
  if (subtractionKeys.has("10-10")) throw new Error("subtraction deck includes 10-10");
  if (subtractionCards.some((card) => card.answer < 0)) throw new Error("subtraction answer below 0");

  if (additionLevel2Cards.length !== 36) throw new Error(`expected 36 addition level 2 cards, got ${additionLevel2Cards.length}`);
  if (additionLevel2Cards[0].left !== 2 || additionLevel2Cards[0].right !== 9) throw new Error("addition level 2 must start with 2+9");
  if (additionLevel2Cards[1].left !== 3 || additionLevel2Cards[1].right !== 8) throw new Error("addition level 2 must continue with 3+8");
  if (!additionLevel2Keys.has("9+9")) throw new Error("missing 9+9");
  if (additionLevel2Cards.some((card) => card.answer < MIN_LEVEL_2_SUM || card.answer > MAX_LEVEL_2_SUM)) throw new Error("addition level 2 answer out of range");

  if (subtractionLevel2Cards.length !== 36) throw new Error(`expected 36 subtraction level 2 cards, got ${subtractionLevel2Cards.length}`);
  if (subtractionLevel2Cards[0].left !== 11 || subtractionLevel2Cards[0].right !== 2) throw new Error("subtraction level 2 must start with 11-2");
  if (subtractionLevel2Cards[7].left !== 11 || subtractionLevel2Cards[7].right !== 9) throw new Error("subtraction level 2 must list 11-9 before 12-3");
  if (subtractionLevel2Cards[8].left !== 12 || subtractionLevel2Cards[8].right !== 3) throw new Error("subtraction level 2 must continue with 12-3");
  if (!subtractionLevel2Keys.has("18-9")) throw new Error("missing 18-9");
  if (subtractionLevel2Cards.some((card) => card.answer < MIN_LEVEL_2_NUMBER || card.answer > MAX_LEVEL_2_NUMBER)) throw new Error("subtraction level 2 answer out of range");
}

function initApp() {
  const decks = {
    additionLevel1: {
      titleThai: "บัตรบวกเลขระดับ 1",
      titleJapanese: "たし算カード レベル1",
      cards: buildAdditionCards(),
    },
    subtractionLevel1: {
      titleThai: "บัตรลบเลขระดับ 1",
      titleJapanese: "ひき算カード レベル1",
      cards: buildSubtractionCards(),
    },
    additionLevel2: {
      titleThai: "บัตรบวกเลขระดับ 2",
      titleJapanese: "たし算カード レベル2",
      cards: buildAdditionLevel2Cards(),
    },
    subtractionLevel2: {
      titleThai: "บัตรลบเลขระดับ 2",
      titleJapanese: "ひき算カード レベル2",
      cards: buildSubtractionLevel2Cards(),
    },
  };

  let activeDeck = decks.additionLevel1;
  let cards = activeDeck.cards;
  let deck = cards;
  let index = 0;
  let isFlipped = false;

  const homeScreen = document.querySelector("#home-screen");
  const practiceScreen = document.querySelector("#practice-screen");
  const deckButtons = document.querySelectorAll("[data-deck]");
  const homeButton = document.querySelector("#home-button");
  const appTitleThai = document.querySelector("#app-title span:first-child");
  const appTitleJapanese = document.querySelector("#app-title span[lang='ja']");
  const cardButton = document.querySelector("#flash-card");
  const question = document.querySelector("#question");
  const answer = document.querySelector("#answer");
  const frontFace = question.closest(".face-front");
  const backFace = answer.closest(".face-back");
  const progress = document.querySelector("#progress");
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

  deckButtons.forEach((button) => {
    button.addEventListener("click", () => showPractice(button.dataset.deck));
  });
  homeButton.addEventListener("click", showHome);
  cardButton.addEventListener("click", flip);
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
