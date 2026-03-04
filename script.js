const gallery = document.getElementById("galleryGrid");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeLightbox = document.getElementById("closeLightbox");
const sparkleSoundToggle = document.getElementById("sparkleSoundToggle");
const featuredImage = document.getElementById("featuredImage");
const featuredTitle = document.getElementById("featuredTitle");
const featuredDate = document.getElementById("featuredDate");
const featuredStory = document.getElementById("featuredStory");
const filterChips = document.getElementById("filterChips");
const videoGrid = document.getElementById("videoGrid");
const cursorSparkleLayer = document.getElementById("cursorSparkleLayer");

const ratioClasses = ["ratio-a", "ratio-b", "ratio-c"];
let activeFilter = "All";
let normalizedPaintings = [];

let sparkleEnabled = true;
const sparkleTrack = new Audio("files/sparkle-bg.mp3");
sparkleTrack.loop = true;
sparkleTrack.volume = 0.28;
sparkleTrack.preload = "auto";

function normalizePainting(item) {
  const title = item.title || "Untitled";
  const lower = title.toLowerCase();
  const tags = new Set(item.tags || []);

  if (lower.includes("mandala")) tags.add("Mandala");
  if (lower.includes("sketch") || lower.includes("line")) tags.add("Sketch");
  if (lower.includes("painting")) tags.add("Painting");
  if (lower.includes("portrait")) tags.add("Portrait");
  if (lower.includes("craft") || lower.includes("hanging") || lower.includes("wooden")) tags.add("Craft");
  if (lower.includes("lotus") || lower.includes("fish") || lower.includes("cow")) tags.add("Nature");
  if (lower.includes("colorful")) tags.add("Colorful");
  if (lower.includes("heart") || lower.includes("love")) tags.add("Love");

  if (tags.size === 0) tags.add("Painting");

  return {
    ...item,
    title,
    note: item.note || `Behind this piece: I played with color rhythm and gentle details in ${title}.`,
    tags: Array.from(tags)
  };
}

function setFeaturedPainting() {
  if (normalizedPaintings.length === 0) return;
  const pick = normalizedPaintings[0];
  featuredImage.src = pick.src;
  featuredImage.alt = pick.title;
  featuredTitle.textContent = pick.title;
  featuredDate.textContent = pick.date || "Recent Work";
  featuredStory.textContent = pick.note;
}

function getAllTags() {
  const set = new Set(["All"]);
  normalizedPaintings.forEach((item) => item.tags.forEach((tag) => set.add(tag)));
  return Array.from(set);
}

function renderFilterChips() {
  const tags = getAllTags();
  filterChips.innerHTML = tags
    .map(
      (tag) =>
        `<button class="chip ${tag === activeFilter ? "active" : ""}" data-tag="${tag}" type="button">${tag}</button>`
    )
    .join("");
}

function renderPaintings() {
  if (!Array.isArray(window.paintings) || window.paintings.length === 0) {
    gallery.innerHTML = "<p>No paintings yet. Add images in files/paintings.js</p>";
    return;
  }

  normalizedPaintings = window.paintings.map(normalizePainting);
  setFeaturedPainting();

  const filtered =
    activeFilter === "All"
      ? normalizedPaintings
      : normalizedPaintings.filter((item) => item.tags.includes(activeFilter));

  const cards = filtered
    .map(
      (item, idx) => `
      <article class="card reveal ${ratioClasses[idx % ratioClasses.length]}" data-src="${item.src}" data-title="${item.title}">
        <img src="${item.src}" alt="${item.title}" loading="lazy" />
        <div class="meta">
          <h3>${item.title}</h3>
          <p>${item.date || ""}</p>
          <p class="story">${item.note}</p>
        </div>
      </article>
    `
    )
    .join("");

  gallery.innerHTML = cards;
  const reveals = gallery.querySelectorAll(".reveal");
  reveals.forEach((node, i) => {
    node.style.animationDelay = `${Math.min(i * 0.06, 0.6)}s`;
  });

  renderFilterChips();
}

function renderVideos() {
  if (!Array.isArray(window.videos) || window.videos.length === 0) {
    videoGrid.innerHTML =
      '<div class="video-empty">No videos yet. Add entries in files/videos.js with YouTube embeds or local MP4 files.</div>';
    return;
  }

  videoGrid.innerHTML = window.videos
    .map((video) => {
      if (video.type === "youtube") {
        return `
          <article class="video-card">
            <iframe class="video-media" src="${video.src}" title="${video.title || "Video"}" loading="lazy" allowfullscreen></iframe>
            <div class="video-meta">
              <h3>${video.title || "Art Video"}</h3>
              <p>${video.caption || ""}</p>
            </div>
          </article>
        `;
      }

      return `
        <article class="video-card">
          <video class="video-media" controls preload="metadata" src="${video.src}"></video>
          <div class="video-meta">
            <h3>${video.title || "Art Video"}</h3>
            <p>${video.caption || ""}</p>
          </div>
        </article>
      `;
    })
    .join("");
}

gallery.addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (!card) return;

  lightboxImg.src = card.dataset.src;
  lightboxCaption.textContent = card.dataset.title;
  lightbox.classList.remove("hidden");
  lightbox.setAttribute("aria-hidden", "false");
});

filterChips.addEventListener("click", (event) => {
  const btn = event.target.closest(".chip");
  if (!btn) return;
  activeFilter = btn.dataset.tag;
  renderPaintings();
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

function createPointerSpark(x, y) {
  const spark = document.createElement("span");
  spark.className = "spark";
  spark.style.left = `${x}px`;
  spark.style.top = `${y}px`;
  cursorSparkleLayer.appendChild(spark);
  window.setTimeout(() => spark.remove(), 800);
}

let lastSparkTime = 0;
document.addEventListener("pointermove", (event) => {
  const now = Date.now();
  if (now - lastSparkTime < 70) return;
  lastSparkTime = now;
  if (Math.random() < 0.4) {
    createPointerSpark(event.clientX, event.clientY);
  }
});

function stopSparkles() {
  sparkleTrack.pause();
}

async function startSparkles() {
  if (sparkleEnabled) {
    try {
      await sparkleTrack.play();
    } catch (_error) {
      // Browser blocks autoplay until a user gesture.
    }
  }
}

function updateSoundButton() {
  sparkleSoundToggle.textContent = `Sparkle Sound: ${sparkleEnabled ? "On" : "Off"}`;
  sparkleSoundToggle.setAttribute("aria-pressed", sparkleEnabled ? "true" : "false");
}

renderPaintings();
renderVideos();
updateSoundButton();

const topReveals = document.querySelectorAll("main > .reveal");
topReveals.forEach((node, i) => {
  node.style.animationDelay = `${i * 0.08}s`;
});

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
