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

Keep `alt` factual and descriptive. Captions can carry the drier, more conversational tone. Videos should be compressed for the web; the page loads only their metadata until someone presses play.

Before adding media, remove location metadata and leave out private addresses, booking details and timeline screenshots.

## Local preview

Serve the folder over HTTP rather than opening `index.html` directly:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publishing

The folder can be deployed directly to GitHub Pages, Netlify or Cloudflare Pages. Review diary text, names and personal photos before publishing.
