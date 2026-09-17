# Winter 2026 Travel Diary

This is a small static site, ready for GitHub Pages or any other static host.

## Updating the diary

Most text, dates, navigation labels and media references live in `content.js`.
Images and videos live under `assets/`.

Each entry follows this shape:

```js
{
  id: "bendigo",
  navTitle: "Bendigo",
  date: "2–4 AUGUST",
  title: "The detour that became Bendigo",
  location: "Halls Gap · Avoca · Bendigo",
  paragraphs: [
    "First paragraph...",
    "Second paragraph..."
  ],
  media: [
    {
      type: "image",
      src: "assets/bendigo.jpg",
      alt: "A plain description of what is visible in the image.",
      caption: "A shorter caption in the diary's voice."
    },
    {
      type: "video",
      src: "assets/example.mp4",
      poster: "assets/example-poster.jpg",
      alt: "A plain description of the clip.",
      caption: "A short caption."
    }
  ]
}
```

Keep `alt` factual and descriptive. Captions can carry the drier, more conversational tone. Videos should be compressed for the web; the page shows their posters and loads video when someone presses play.

## Reading layout

`content.js` also defines the chapter titles, date labels and starting entry IDs. Each chapter contains the entries from its `start` ID up to the next chapter's start; keep these in the same order as `entries`. Adding an entry within a chapter requires no pagination changes. The Queenstown chapter deliberately uses the broad label `August`, matching the approximate dates of some original entries.

The cover links to six chronological chapters and the afterword. Only the current chapter's entries and media are rendered. Existing `#entry-id` links still open the correct chapter, and browser Back restores the previous reading position. The contents dialog lists every chapter and entry; desktop readers also have a sticky index for the current chapter.

Galleries show three images across on wide screens, two on tablets and a swipeable row on phones. Arrow buttons, keyboard arrows/Home/End and a View all toggle provide alternate ways to browse. Photos keep their full frame in the row and the image viewer. Music players load on opening Song of the day and unload when closed.

When changing the layout, check cover → chapter → next chapter → afterword, direct entry URLs, Back/Forward, gallery controls, keyboard focus, videos and music at desktop and phone widths. Keep any publication separate from the local preview review.

Before adding media, remove location metadata and leave out private addresses, booking details and timeline screenshots.

## Local preview

Serve the folder over HTTP rather than opening `index.html` directly:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publishing

The folder can be deployed directly to GitHub Pages, Netlify or Cloudflare Pages. Review diary text, names and personal photos before publishing.
