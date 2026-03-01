const gallery = document.getElementById("galleryGrid");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeLightbox = document.getElementById("closeLightbox");

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
