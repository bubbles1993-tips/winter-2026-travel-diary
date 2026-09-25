const D = window.TRAVEL_DIARY;
const entries = [...D.entries];
const esc = value => String(value).replace(/[&<>"']/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[character]);
const paragraphCopy = value => String(value).split(/(https?:\/\/[^\s<>]+)/g).map(part =>
  /^https?:\/\//.test(part)
    ? `<a href="${esc(part)}" target="_blank" rel="noopener noreferrer">${esc(part)}</a>`
    : esc(part)
).join("");
const $ = id => document.getElementById(id);
const number = value => String(value).padStart(2, "0");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// A chapter includes entries from its starting ID up to the next chapter's start.
const chapters = D.chapters.map(chapter => ({ ...chapter }));
chapters.forEach((chapter, index) => {
  const start = entries.findIndex(item => item.id === chapter.start);
  const end = index + 1 < chapters.length ? entries.findIndex(item => item.id === chapters[index + 1].start) : entries.length;
  chapter.entries = entries.slice(start, end);
  chapter.index = index;
});
const chapterHash = chapter => `#chapter-${chapter.id}`;
const entryChapters = new Map(chapters.flatMap(chapter => chapter.entries.map(item => [item.id, chapter])));

function mediaItem(item) {
  const caption = item.caption ? `<figcaption>${esc(item.caption)}</figcaption>` : "";
  if (item.type === "video") {
    const poster = item.poster ? ` poster="${esc(item.poster)}"` : "";
    return `<figure class="media-card video-card"><video controls playsinline preload="none" aria-label="${esc(item.alt)}"${poster}><source src="${esc(item.src)}" type="video/mp4">Your browser does not support embedded video.</video>${caption}</figure>`;
  }
  return `<figure class="media-card photo-card"><button class="photo-button" type="button" aria-label="Open image: ${esc(item.alt)}" data-full="${esc(item.src)}" data-alt="${esc(item.alt)}" data-caption="${esc(item.caption || "")}"><img src="${esc(item.src)}" alt="${esc(item.alt)}" loading="lazy" decoding="async"></button>${caption}</figure>`;
}

function entry(item) {
  const media = item.media || [];
  const galleryId = `gallery-${item.id}`;
  const gallery = media.length ? `<div class="gallery-section">
    <div class="gallery" id="${esc(galleryId)}" data-count="${media.length}" role="region" aria-label="${esc(item.title)} photos and videos" tabindex="0">${media.map(mediaItem).join("")}</div>
    ${media.length > 1 ? `<div class="gallery-footer"><span class="gallery-position" aria-live="polite" aria-atomic="true"></span><div class="gallery-actions"><button type="button" class="gallery-toggle" aria-expanded="false" aria-controls="${esc(galleryId)}">View all ${media.length}</button><div class="gallery-arrows"><button type="button" class="icon-button gallery-prev" aria-label="Previous photos" aria-controls="${esc(galleryId)}">←</button><button type="button" class="icon-button gallery-next" aria-label="Next photos" aria-controls="${esc(galleryId)}">→</button></div></div></div>` : ""}
  </div>` : "";
  const paragraphs = item.paragraphs.map(paragraph => `<p>${paragraphCopy(paragraph)}</p>`).join("");
  // A collapsed player keeps music available without interrupting the entry or loading an iframe.
  const track = item.song?.url.match(/\/track\/([a-zA-Z0-9]+)/)?.[1];
  const song = track ? `<details class="song-card"><summary><span class="eyebrow">Song of the day</span><span>${esc(item.song.title)} <span class="song-artist">— ${esc(item.song.artist)}</span></span></summary><div class="song-player" data-track="${esc(track)}" data-title="${esc(item.song.title)} by ${esc(item.song.artist)}"></div><a href="${esc(item.song.url)}" target="_blank" rel="noopener noreferrer">Listen on Spotify ↗</a></details>` : "";
  return `<article class="entry${item.dark ? " dark" : ""}" id="${esc(item.id)}" aria-labelledby="heading-${esc(item.id)}"><header class="entry-head"><a class="date" href="#${esc(item.id)}" aria-label="Link to ${esc(item.date)}: ${esc(item.title)}">${esc(item.date)}</a><h2 id="heading-${esc(item.id)}" tabindex="-1">${esc(item.title)}</h2><p class="route">${esc(item.location)}</p></header><div class="copy">${paragraphs}</div>${gallery}${song}</article>`;
}

$("hero-image").src = D.heroImage;
$("hero-image").alt = D.heroAlt;
$("title").textContent = D.title;
$("subtitle").textContent = D.subtitle;
$("dates").textContent = D.dates;
$("stats").innerHTML = D.stats.map(([value, label]) => `<div class="stat"><b>${esc(value)}</b><span>${esc(label)}</span></div>`).join("");
$("intro-copy").innerHTML = D.intro.map(paragraph => `<p>${esc(paragraph)}</p>`).join("");
if (D.introFilm) {
  const film = D.introFilm;
  $("intro-film").innerHTML = `<video id="intro-film-player" controls playsinline preload="none" poster="${esc(film.poster)}" aria-label="${esc(film.alt)}" aria-describedby="intro-film-caption"><source src="${esc(film.src)}" type="video/mp4">Your browser does not support embedded video. <a href="${esc(film.src)}">Watch the trip film.</a></video><figcaption id="intro-film-caption">${esc(film.caption)}</figcaption>`;
  $("intro-film").hidden = false;
}
$("reflection-copy").innerHTML = D.reflection.map(paragraph => `<p>${esc(paragraph)}</p>`).join("");
const routeStops = Array.isArray(D.route) ? D.route : String(D.route).split("→").map(label => ({ label: label.trim() }));
$("route").innerHTML = routeStops.map(stop => {
  const target = entries.find(item => item.id === stop.entryId);
  return `<li>${target ? `<a href="#${esc(target.id)}" aria-label="${esc(stop.label)}, jump to ${esc(target.date)}: ${esc(target.title)}">${esc(stop.label)}</a>` : `<span>${esc(stop.label)}</span>`}</li>`;
}).join("");
$("journal-count").textContent = `${entries.length} entries · In order, at your own pace`;
$("chapter-list").innerHTML = chapters.map(chapter => `<li><a href="${chapterHash(chapter)}"><span class="chapter-number">${number(chapter.index + 1)}</span><div><span class="chapter-dates">${esc(chapter.dates)}</span><h3>${esc(chapter.title)}</h3><p>${esc(chapter.places)}</p><span class="chapter-entry-count">${chapter.entries.length} entries</span></div><span class="chapter-arrow" aria-hidden="true">↗</span></a></li>`).join("");
$("contents-menu").innerHTML = `<a class="menu-cover" href="#trip">The cover & the trip <span aria-hidden="true">↗</span></a>${chapters.map(chapter => `<div class="menu-chapter"><a class="menu-chapter-link" href="${chapterHash(chapter)}"><span>${number(chapter.index + 1)}</span><div><strong>${esc(chapter.title)}</strong><small>${esc(chapter.dates)}</small></div><span aria-hidden="true">↗</span></a><details data-chapter="${chapter.id}"><summary>${chapter.entries.length} entries</summary><ol>${chapter.entries.map(item => `<li><a href="#${esc(item.id)}"><small>${esc(item.date)}</small>${esc(item.navTitle || item.title)}</a></li>`).join("")}</ol></details></div>`).join("")}<a class="menu-cover" href="#reflection">Afterword <span aria-hidden="true">↗</span></a>`;

const contentsDialog = $("contents-dialog");
const lightbox = $("lightbox");
$("open-contents").addEventListener("click", () => contentsDialog.showModal());
document.querySelector("[data-close-contents]").addEventListener("click", () => contentsDialog.close());
[contentsDialog, lightbox].forEach(dialog => {
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});

let galleryCleanups = [];
function setupGalleries() {
  document.querySelectorAll(".gallery-section").forEach(section => {
    const gallery = section.querySelector(".gallery");
    const cards = [...gallery.children];
    const footer = section.querySelector(".gallery-footer");
    if (!footer) return;
    const counter = footer.querySelector(".gallery-position");
    const previous = footer.querySelector(".gallery-prev");
    const next = footer.querySelector(".gallery-next");
    const toggle = footer.querySelector(".gallery-toggle");
    let intendedPosition = null;
    let frame = 0;
    let settleTimer;
    function measure() {
      const bounds = gallery.getBoundingClientRect();
      const max = Math.max(0, gallery.scrollWidth - gallery.clientWidth);
      const left = Math.max(0, Math.min(max, gallery.scrollLeft));
      const positions = cards.map(card => {
        const rect = card.getBoundingClientRect();
        return { offset: rect.left - bounds.left + gallery.scrollLeft - 3, rect };
      });
      return { bounds, max, left, positions };
    }
    function update() {
      const expanded = gallery.classList.contains("expanded");
      const { bounds, max, left, positions } = measure();
      const visible = expanded ? cards.map((_, index) => index + 1) : positions.flatMap(({ rect }, index) => {
        const overlap = Math.min(rect.right, bounds.right) - Math.max(rect.left, bounds.left);
        return overlap >= Math.min(rect.width, bounds.width) * 0.5 ? [index + 1] : [];
      });
      previous.disabled = left <= 2;
      next.disabled = left >= max - 2;
      footer.querySelector(".gallery-arrows").hidden = expanded || max <= 2;
      toggle.hidden = !expanded && max <= 2;
      if (visible.length) {
        const first = visible[0], last = visible[visible.length - 1];
        const label = `${first === last ? first : `${first}–${last}`} / ${cards.length}`;
        if (counter.textContent !== label) counter.textContent = label;
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
    }
    previous.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));
    toggle.addEventListener("click", () => {
      const expanded = gallery.classList.toggle("expanded");
      toggle.setAttribute("aria-expanded", String(expanded));
      toggle.textContent = expanded ? "Back to photo row" : `View all ${cards.length}`;
      intendedPosition = null;
      gallery.scrollLeft = 0;
      if (!expanded) section.scrollIntoView({ block: "nearest", behavior: "instant" });
      update();
    });
    gallery.addEventListener("keydown", event => {
      if (event.target !== gallery || gallery.classList.contains("expanded")) return;
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
    const observer = new ResizeObserver(() => { intendedPosition = null; update(); });
    observer.observe(gallery);
    galleryCleanups.push(() => { observer.disconnect(); cancelAnimationFrame(frame); clearTimeout(settleTimer); });
    update();
  });
  document.querySelectorAll(".song-card").forEach(song => song.addEventListener("toggle", () => {
    const player = song.querySelector(".song-player");
    if (song.open && !player.children.length) {
      const frame = document.createElement("iframe");
      frame.src = `https://open.spotify.com/embed/track/${player.dataset.track}?utm_source=travel-diary`;
      frame.title = `Spotify: ${player.dataset.title}`;
      frame.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
      player.append(frame);
    } else if (!song.open) player.replaceChildren();
  }));
}

let imageTriggers = [], imageIndex = 0, lastImageTrigger = null;
function showImage(index) {
  imageIndex = index;
  const trigger = imageTriggers[index];
  lightbox.querySelector("img").src = trigger.dataset.full;
  lightbox.querySelector("img").alt = trigger.dataset.alt;
  $("lightbox-caption").textContent = trigger.dataset.caption;
  $("lightbox-count").textContent = `${index + 1} / ${imageTriggers.length}`;
  $("lightbox-prev").disabled = index === 0;
  $("lightbox-next").disabled = index === imageTriggers.length - 1;
}
function moveImage(direction) {
  const index = imageIndex + direction;
  if (index >= 0 && index < imageTriggers.length) showImage(index);
}
$("lightbox-prev").addEventListener("click", () => moveImage(-1));
$("lightbox-next").addEventListener("click", () => moveImage(1));
document.querySelector("[data-close-lightbox]").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("keydown", event => {
  if (["ArrowLeft", "ArrowRight"].includes(event.key)) { event.preventDefault(); moveImage(event.key === "ArrowLeft" ? -1 : 1); }
});
lightbox.addEventListener("close", () => {
  lightbox.querySelector("img").removeAttribute("src");
  lastImageTrigger?.focus({ preventScroll: true });
});

let currentChapter = null, currentView = null, lastHash = null;
let progressFrame = 0, positionTimer;
const pageTitle = `${D.title} — Winter 2026`;
function pauseVideos(except) {
  document.querySelectorAll("video").forEach(video => { if (video !== except) video.pause(); });
}
// Native media play events do not bubble; capture them for every rendered chapter.
document.addEventListener("play", event => {
  if (event.target instanceof HTMLVideoElement) pauseVideos(event.target);
}, true);
function updateProgress() {
  if (!currentChapter) return;
  const sections = [...document.querySelectorAll(".entry")];
  const marker = Math.min(innerHeight * 0.35, 220);
  let active = sections[0];
  sections.forEach(section => { if (section.getBoundingClientRect().top <= marker) active = section; });
  const index = sections.indexOf(active);
  $("reading-progress").value = index + 1;
  $("reading-progress").setAttribute("aria-valuetext", `Entry ${index + 1} of ${sections.length}: ${currentChapter.entries[index].title}`);
  document.querySelectorAll(".chapter-sidebar a").forEach(link => {
    if (link.hash === `#${active.id}`) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current");
  });
}
window.addEventListener("scroll", () => {
  if (!progressFrame) progressFrame = requestAnimationFrame(() => { progressFrame = 0; updateProgress(); });
  clearTimeout(positionTimer);
  positionTimer = setTimeout(rememberPosition, 180);
}, { passive: true });

function resolveView(hash) {
  const id = hash.replace(/^#/, "");
  const chapter = chapters.find(item => `chapter-${item.id}` === id) || entryChapters.get(id);
  if (chapter) return { key: chapter.id, chapter, target: entryChapters.has(id) ? id : "chapter-head" };
  if (id === "reflection") return { key: "reflection", target: "reflection-title" };
  return { key: "cover", target: id === "contents" ? "contents" : "title" };
}

function renderView({ initial = false, restore, saved = {} } = {}) {
  const view = resolveView(location.hash);
  lastHash = location.hash;
  if (currentView !== view.key) {
    galleryCleanups.forEach(cleanup => cleanup());
    galleryCleanups = [];
    pauseVideos();
    $("entries").replaceChildren();
    currentView = view.key;
    currentChapter = view.chapter || null;
    $("cover").hidden = view.key !== "cover";
    $("reader").hidden = !view.chapter;
    $("reflection").hidden = view.key !== "reflection";
    $("reading-progress").hidden = !view.chapter;
    if (view.chapter) {
      const chapter = view.chapter;
      $("reading-position").textContent = `${number(chapter.index + 1)} / ${number(chapters.length)} · ${chapter.title}`;
      $("reading-progress").max = chapter.entries.length;
      document.title = `${chapter.title} · ${pageTitle}`;
      $("chapter-head").innerHTML = `<div class="eyebrow">Chapter ${number(chapter.index + 1)} / ${number(chapters.length)}</div><h1>${esc(chapter.title)}</h1><p>${esc(chapter.dates)} <span aria-hidden="true">·</span> ${chapter.entries.length} entries</p>`;
      $("chapter-sidebar").innerHTML = `<div class="sidebar-inner"><div class="eyebrow">In this chapter</div><ol>${chapter.entries.map(item => `<li><a href="#${esc(item.id)}"><span>${esc(item.date)}</span>${esc(item.navTitle || item.title)}</a></li>`).join("")}</ol></div>`;
      $("entries").innerHTML = chapter.entries.map(entry).join("");
      (saved.expanded || []).forEach(id => {
        const gallery = $(id);
        if (!gallery) return;
        gallery.classList.add("expanded");
        const toggle = gallery.closest(".gallery-section").querySelector(".gallery-toggle");
        toggle.setAttribute("aria-expanded", "true");
        toggle.textContent = "Back to photo row";
      });
      Object.entries(saved.galleries || {}).forEach(([id, left]) => { if ($(id)) $(id).scrollLeft = left; });
      const previous = chapters[chapter.index - 1], next = chapters[chapter.index + 1];
      $("pagination").innerHTML = `<a class="page-previous" href="${previous ? chapterHash(previous) : "#trip"}"><span class="eyebrow">← ${previous ? "Previous chapter" : "Back to the cover"}</span><strong>${previous ? esc(previous.title) : "Seven weeks away"}</strong></a><a class="page-next" href="${next ? chapterHash(next) : "#reflection"}" rel="next"><span class="eyebrow">${next ? `Next · Chapter ${number(next.index + 1)}` : "Afterword"} →</span><strong>${next ? esc(next.title) : "The numbers aren’t really the trip"}</strong><span>${next ? `${esc(next.dates)} · ${next.entries.length} entries` : "What I’ll actually remember"}</span></a><div class="page-numbers" aria-label="Choose a chapter">${chapters.map(item => `<a href="${chapterHash(item)}" aria-label="Chapter ${item.index + 1}: ${esc(item.title)}"${item === chapter ? ' aria-current="page"' : ""}>${number(item.index + 1)}</a>`).join("")}</div>`;
      setupGalleries();
    } else {
      $("reading-position").textContent = view.key === "reflection" ? "Afterword" : "A travel diary";
      document.title = view.key === "reflection" ? `Afterword · ${pageTitle}` : pageTitle;
    }
    document.querySelectorAll(".menu-chapter-link").forEach(link => {
      if (view.chapter && link.hash === chapterHash(view.chapter)) link.setAttribute("aria-current", "page"); else link.removeAttribute("aria-current");
    });
    document.querySelectorAll("#contents-menu details").forEach(details => { details.open = false; });
  }
  const target = $(view.target);
  if (restore !== undefined) window.scrollTo({ top: restore, behavior: "instant" });
  else if (view.target === "title" || view.target === "chapter-head" || view.target === "reflection-title") window.scrollTo({ top: 0, behavior: "instant" });
  else target?.scrollIntoView({ block: "start", behavior: "instant" });
  if (!initial) {
    const focusTarget = view.chapter && entryChapters.has(view.target) ? $(`heading-${view.target}`) : target;
    if (focusTarget && !focusTarget.hasAttribute("tabindex")) focusTarget.setAttribute("tabindex", "-1");
    focusTarget?.focus({ preventScroll: true });
  }
  updateProgress();
}

function rememberPosition() {
  history.replaceState({ ...history.state, journalScroll: window.scrollY, journalView: currentView,
    expanded: [...document.querySelectorAll(".gallery.expanded")].map(gallery => gallery.id),
    galleries: Object.fromEntries([...document.querySelectorAll(".gallery")].map(gallery => [gallery.id, gallery.scrollLeft]))
  }, "");
}
function navigate(hash) {
  if (contentsDialog.open) contentsDialog.close();
  if (lightbox.open) lightbox.close();
  rememberPosition();
  clearTimeout(positionTimer);
  if (location.hash !== hash) history.pushState({ journalScroll: 0 }, "", hash);
  renderView();
}
document.addEventListener("click", event => {
  const image = event.target.closest(".photo-button");
  if (image) {
    lastImageTrigger = image;
    imageTriggers = [...image.closest(".gallery").querySelectorAll(".photo-button")];
    showImage(imageTriggers.indexOf(image));
    lightbox.showModal();
    document.querySelector("[data-close-lightbox]").focus();
    return;
  }
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (link.classList.contains("skip-link")) { $("main").focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: "instant" }); return; }
  navigate(link.hash);
});
history.scrollRestoration = "manual";
window.addEventListener("popstate", () => { clearTimeout(positionTimer); renderView({ restore: history.state?.journalScroll, saved: history.state || {} }); });
window.addEventListener("hashchange", () => { if (lastHash !== location.hash) renderView(); });
window.addEventListener("pagehide", () => { pauseVideos(); rememberPosition(); });
const savedPosition = history.state?.journalView === resolveView(location.hash).key ? history.state : {};
renderView({ initial: true, restore: savedPosition.journalScroll, saved: savedPosition });
