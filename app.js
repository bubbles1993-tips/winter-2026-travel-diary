const D = window.TRAVEL_DIARY;
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
  const media = item.media?.length
    ? `<div class="gallery">${item.media.map(mediaItem).join("")}</div>`
    : "";
  const paragraphs = item.paragraphs
    .map(paragraph => `<p>${esc(paragraph)}</p>`)
    .join("");
  const song = item.song ? `<section class="song-card"><span>Song of the day</span><strong>${esc(item.song.title)} — ${esc(item.song.artist)}</strong><iframe src="https://open.spotify.com/embed/track/${esc(item.song.url.split('/').pop())}" title="Spotify: ${esc(item.song.title)} by ${esc(item.song.artist)}" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe></section>` : "";

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
document.getElementById("entries").innerHTML = D.entries.map(entry).join("");
document.getElementById("nav").innerHTML = D.entries
  .map(item => `<a href="#${esc(item.id)}">${esc(item.navTitle || item.title)}</a>`)
  .join("");
document.getElementById("reflection-copy").innerHTML = D.reflection
  .map(paragraph => `<p>${esc(paragraph)}</p>`)
  .join("");

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
