const gallery = document.getElementById("galleryGrid");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeLightbox = document.getElementById("closeLightbox");
const sparkleSoundToggle = document.getElementById("sparkleSoundToggle");

let audioContext;
let sparkleTimer = null;
let sparkleEnabled = true;

function ensureAudioContext() {
  if (!audioContext) {
    audioContext = new window.AudioContext();
  }
}

function playSparkleTone() {
  if (!audioContext) return;
  const now = audioContext.currentTime;

  const oscA = audioContext.createOscillator();
  const oscB = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscA.type = "triangle";
  oscB.type = "sine";
  oscA.frequency.setValueAtTime(1300 + Math.random() * 500, now);
  oscB.frequency.setValueAtTime(2100 + Math.random() * 800, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.028, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

  oscA.connect(gain);
  oscB.connect(gain);
  gain.connect(audioContext.destination);

  oscA.start(now);
  oscB.start(now);
  oscA.stop(now + 0.45);
  oscB.stop(now + 0.45);
}

function queueSparkles() {
  if (!sparkleEnabled) return;
  playSparkleTone();
  const waitMs = 1600 + Math.random() * 3200;
  sparkleTimer = window.setTimeout(queueSparkles, waitMs);
}

function stopSparkles() {
  if (sparkleTimer) {
    window.clearTimeout(sparkleTimer);
    sparkleTimer = null;
  }
}

async function startSparkles() {
  ensureAudioContext();
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }
  if (!sparkleTimer && sparkleEnabled) {
    queueSparkles();
  }
}

function updateSoundButton() {
  sparkleSoundToggle.textContent = `Sparkle Sound: ${sparkleEnabled ? "On" : "Off"}`;
  sparkleSoundToggle.setAttribute("aria-pressed", sparkleEnabled ? "true" : "false");
}

function renderPaintings() {
  if (!Array.isArray(window.paintings) || window.paintings.length === 0) {
    gallery.innerHTML = "<p>No paintings yet. Add images in files/paintings.js</p>";
    return;
  }

  const cards = window.paintings
    .map(
      (item) => `
      <article class="card" data-src="${item.src}" data-title="${item.title || "Untitled"}">
        <img src="${item.src}" alt="${item.title || "Painting"}" loading="lazy" />
        <div class="meta">
          <h3>${item.title || "Untitled"}</h3>
          <p>${item.date || ""}</p>
        </div>
      </article>
    `
    )
    .join("");

  gallery.innerHTML = cards;
}

gallery.addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (!card) return;

  lightboxImg.src = card.dataset.src;
  lightboxCaption.textContent = card.dataset.title;
  lightbox.classList.remove("hidden");
  lightbox.setAttribute("aria-hidden", "false");
});

function closeBox() {
  lightbox.classList.add("hidden");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
}

closeLightbox.addEventListener("click", closeBox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeBox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeBox();
});

renderPaintings();
updateSoundButton();

document.addEventListener(
  "pointerdown",
  () => {
    if (sparkleEnabled) startSparkles();
  },
  { once: true }
);

sparkleSoundToggle.addEventListener("click", async () => {
  sparkleEnabled = !sparkleEnabled;
  updateSoundButton();
  if (sparkleEnabled) {
    await startSparkles();
  } else {
    stopSparkles();
  }
});
