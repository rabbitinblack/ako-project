const MAX_ADDEND = 9;
const MAX_SUM = 10;

function buildCards() {
  const cards = [];

  for (let left = 0; left <= MAX_ADDEND; left += 1) {
    for (let right = 0; right <= MAX_ADDEND; right += 1) {
      if (left + right <= MAX_SUM) {
        cards.push({ left, right, answer: left + right });
      }
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
  const cards = buildCards();
  const keys = new Set(cards.map((card) => `${card.left}+${card.right}`));

  if (cards.length !== 64) throw new Error(`expected 64 cards, got ${cards.length}`);
  if (!keys.has("0+0")) throw new Error("missing 0+0");
  if (!keys.has("9+1")) throw new Error("missing 9+1");
  if (cards.some((card) => card.answer > MAX_SUM)) throw new Error("answer exceeds 10");
}

function initApp() {
  const allCards = buildCards();
  let deck = allCards;
  let index = 0;
  let isFlipped = false;

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

  function setMode(mode) {
    deck = mode === "random" ? shuffleCards(allCards) : allCards;
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

    question.textContent = `${card.left} + ${card.right}`;
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

  cardButton.addEventListener("click", flip);
  flipButton.addEventListener("click", flip);
  prevButton.addEventListener("click", () => move(-1));
  nextButton.addEventListener("click", () => move(1));
  orderedMode.addEventListener("click", () => setMode("ordered"));
  randomMode.addEventListener("click", () => setMode("random"));

  render();
}

if (typeof document !== "undefined") {
  initApp();
}

if (typeof module !== "undefined" && require.main === module) {
  runSelfCheck();
}
