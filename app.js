const D = window.TRAVEL_DIARY;
const entries = [...D.entries].reverse();
const esc = value => String(value).replace(/[&<>"']/g, character => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
})[character]);

function mediaItem(item) {
  const caption = item.caption
    ? `<figcaption>${esc(item.caption)}</figcaption>`
    : "";

  if (item.type === "video") {
    const poster = item.poster ? ` poster="${esc(item.poster)}"` : "";
    return `<figure class="media-card video-card">
      <video controls playsinline preload="metadata" aria-label="${esc(item.alt)}"${poster}>
        <source src="${esc(item.src)}" type="video/mp4">
        Your browser does not support embedded video.
      </video>
      ${caption}
    </figure>`;
  }

  return `<figure class="media-card photo-card">
    <button class="photo-button" type="button" aria-label="Open image: ${esc(item.alt)}" data-full="${esc(item.src)}" data-alt="${esc(item.alt)}" data-caption="${esc(item.caption || "")}">
      <img src="${esc(item.src)}" alt="${esc(item.alt)}" loading="lazy" decoding="async">
    </button>
    ${caption}
  </figure>`;
}

function entry(item) {
  const mediaItems = item.media || [];
  const photoCount = mediaItems.filter(media => media.type !== "video").length;
  const videoCount = mediaItems.length - photoCount;
  const mediaCount = [photoCount && `${photoCount} photo${photoCount === 1 ? "" : "s"}`, videoCount && `${videoCount} video${videoCount === 1 ? "" : "s"}`].filter(Boolean).join(" · ");
  const galleryId = `gallery-${item.id}`;
  const media = mediaItems.length
    ? `<div class="gallery-section">
        <div class="gallery-toolbar">
          <div class="gallery-heading"><strong>The day in ${photoCount ? "photos" : "video"}</strong><span>${mediaCount}</span></div>
          ${mediaItems.length > 1 ? `<div class="gallery-controls">
            <button type="button" class="gallery-button" data-gallery-previous aria-controls="${esc(galleryId)}" aria-label="Previous photos or videos: ${esc(item.title)}" disabled><span aria-hidden="true">←</span> Previous</button>
            <span class="gallery-position" aria-label="Gallery position">1 of ${mediaItems.length}</span>
            <button type="button" class="gallery-button gallery-next" data-gallery-next aria-controls="${esc(galleryId)}" aria-label="Next photos or videos: ${esc(item.title)}">Next <span aria-hidden="true">→</span></button>
          </div>` : ""}
        </div>
        <p class="gallery-hint" id="${esc(galleryId)}-hint"><span data-scroll-hint>${mediaItems.length > 1 ? "Swipe or use the arrows to see more. " : ""}</span>${photoCount ? "Select a photo to enlarge." : ""}</p>
        <div class="gallery" id="${esc(galleryId)}" data-count="${mediaItems.length}" role="region" aria-label="${esc(item.title)} photos and videos" aria-describedby="${esc(galleryId)}-hint" tabindex="0">${mediaItems.map(mediaItem).join("")}</div>
      </div>`
    : "";
  const paragraphs = item.paragraphs
    .map(paragraph => `<p>${esc(paragraph)}</p>`)
    .join("");
  const song = item.song ? `<section class="song-card"><span>Song of the day</span><strong>${esc(item.song.title)} — ${esc(item.song.artist)}</strong><iframe src="https://open.spotify.com/embed/track/${esc(item.song.url.split('/').pop())}?utm_source=travel-diary" title="Spotify: ${esc(item.song.title)} by ${esc(item.song.artist)}" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe></section>` : "";

  return `<section class="entry ${item.dark ? "dark" : ""}" id="${esc(item.id)}">
    <div class="entry-head">
      <div class="date">${esc(item.date)}</div>
      <h2>${esc(item.title)}</h2>
      <p class="route">${esc(item.location)}</p>
    </div>
    <div class="copy">${paragraphs}</div>
    ${song}
    ${media}
  </section>`;
}

const hero = document.getElementById("hero-image");
hero.src = D.heroImage;
hero.alt = D.heroAlt;
document.getElementById("title").textContent = D.title;
document.getElementById("subtitle").textContent = D.subtitle;
document.getElementById("dates").textContent = D.dates;
document.getElementById("stats").innerHTML = D.stats
  .map(([number, label]) => `<div class="stat"><b>${esc(number)}</b><span>${esc(label)}</span></div>`)
  .join("");
document.getElementById("intro-copy").innerHTML = D.intro
  .map(paragraph => `<p>${esc(paragraph)}</p>`)
  .join("");
document.getElementById("route").textContent = D.route;
document.getElementById("entries").innerHTML = entries.map(entry).join("");
document.getElementById("nav").innerHTML = entries
  .map(item => `<a href="#${esc(item.id)}">${esc(item.navTitle || item.title)}</a>`)
  .join("");
document.getElementById("reflection-copy").innerHTML = D.reflection
  .map(paragraph => `<p>${esc(paragraph)}</p>`)
  .join("");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.querySelectorAll(".gallery-section").forEach(section => {
  const gallery = section.querySelector(".gallery");
  const cards = [...gallery.children];
  const controls = section.querySelector(".gallery-controls");
  if (!controls) return;
  const previous = controls.querySelector("[data-gallery-previous]");
  const next = controls.querySelector("[data-gallery-next]");
  const counter = controls.querySelector(".gallery-position");
  const hint = section.querySelector("[data-scroll-hint]");
  let intendedPosition = null;
  let frame = 0;
  let settleTimer;

  function measure() {
    const bounds = gallery.getBoundingClientRect();
    const max = Math.max(0, gallery.scrollWidth - gallery.clientWidth);
    const left = Math.max(0, Math.min(max, gallery.scrollLeft));
    const positions = cards.map(card => {
      const rect = card.getBoundingClientRect();
      return { offset: rect.left - bounds.left + gallery.scrollLeft - gallery.clientLeft - 2, rect };
    });
    return { bounds, max, left, positions };
  }

  function update() {
    const { bounds, max, left, positions } = measure();
    const scrollable = max > 2;
    controls.hidden = !scrollable;
    hint.hidden = !scrollable;
    previous.disabled = left <= 2;
    next.disabled = left >= max - 2;
    const visible = positions.flatMap(({ rect }, index) => {
      const overlap = Math.min(rect.right, bounds.right) - Math.max(rect.left, bounds.left);
      return overlap >= Math.min(rect.width, bounds.width) * 0.5 ? [index + 1] : [];
    });
    if (visible.length) {
      const first = visible[0];
      const last = visible[visible.length - 1];
      const text = `${first === last ? first : `${first}–${last}`} of ${cards.length}`;
      if (counter.textContent !== text) counter.textContent = text;
      counter.setAttribute("aria-label", `Showing ${first === last ? first : `${first} to ${last}`} of ${cards.length} photos and videos`);
    }
  }

  function move(direction) {
    const { max, left, positions } = measure();
    const origin = intendedPosition ?? left;
    const stops = [...new Set([0, ...positions.map(({ offset }) => Math.max(0, Math.min(max, offset))), max])].sort((a, b) => a - b);
    const destination = direction === "start" ? 0 : direction === "end" ? max : direction > 0
      ? stops.find(position => position > origin + 2) ?? max
      : [...stops].reverse().find(position => position < origin - 2) ?? 0;
    intendedPosition = destination;
    gallery.scrollTo({ left: destination, behavior: reducedMotion.matches ? "auto" : "smooth" });
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => { intendedPosition = null; update(); }, 180);
  }

  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  gallery.addEventListener("keydown", event => {
    if (event.target !== gallery) return;
    const direction = { ArrowLeft: -1, ArrowRight: 1, Home: "start", End: "end" }[event.key];
    if (direction === undefined) return;
    event.preventDefault();
    move(direction);
  });
  gallery.addEventListener("scroll", () => {
    if (!frame) frame = requestAnimationFrame(() => { frame = 0; update(); });
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => { intendedPosition = null; }, 180);
  }, { passive: true });
  ["pointerdown", "wheel"].forEach(type => gallery.addEventListener(type, () => { intendedPosition = null; }, { passive: true }));
  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(() => { intendedPosition = null; update(); }).observe(gallery);
  } else {
    window.addEventListener("resize", update);
  }
  update();
});

const lightbox = document.getElementById("lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector("figcaption");
const lightboxClose = lightbox.querySelector("button");
let lastImageTrigger = null;

function openLightbox(trigger) {
  lastImageTrigger = trigger;
  lightboxImage.src = trigger.dataset.full;
  lightboxImage.alt = trigger.dataset.alt;
  lightboxCaption.textContent = trigger.dataset.caption;
  lightbox.hidden = false;
  document.body.classList.add("no-scroll");
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
  lightboxImage.alt = "";
  lightboxCaption.textContent = "";
  document.body.classList.remove("no-scroll");
  lastImageTrigger?.focus();
}

document.addEventListener("click", event => {
  const trigger = event.target.closest(".photo-button");
  if (trigger) openLightbox(trigger);
});

lightbox.addEventListener("click", event => {
  if (event.target === lightbox || event.target.closest("[data-close-lightbox]")) {
    closeLightbox();
  }
});

document.addEventListener("keydown", event => {
  if (lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "Tab") {
    event.preventDefault();
    lightboxClose.focus();
  }
});

const navLinks = [...document.querySelectorAll(".nav a")];
const linksById = new Map(navLinks.map(link => [link.hash.slice(1), link]));
const visibleSections = new Map();

function setActiveLink(id) {
  navLinks.forEach(link => {
    const active = link.hash === `#${id}`;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

if (navLinks.length) setActiveLink(navLinks[0].hash.slice(1));

const sectionObserver = new IntersectionObserver(records => {
  records.forEach(record => {
    if (record.isIntersecting) visibleSections.set(record.target.id, record);
    else visibleSections.delete(record.target.id);
  });

  const active = [...visibleSections.values()]
    .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];
  if (active && linksById.has(active.target.id)) setActiveLink(active.target.id);
}, {
  rootMargin: "-18% 0px -68% 0px",
  threshold: [0, 0.1, 0.5]
});

document.querySelectorAll(".entry").forEach(section => sectionObserver.observe(section));
