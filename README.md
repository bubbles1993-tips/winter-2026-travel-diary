# Winter 2026 Travel Diary

This is a simple static website, so it can be hosted almost anywhere.

## The easy way to update it

Most diary text, dates, captions and photo references live in **content.js**.

Each diary section looks like:

```js
{
  id: "bendigo",
  date: "2–4 AUGUST",
  title: "The detour that became Bendigo",
  location: "Halls Gap · Avoca · Marong · Bendigo",
  paragraphs: [
    "First paragraph...",
    "Second paragraph..."
  ],
  photos: [
    ["assets/bendigo.jpg", "Obligatory Bendigo photo."]
  ]
}
```

To add a new entry:
1. Put the new photo(s) into the `assets` folder.
2. Add another entry object to the `entries` array in `content.js`.
3. Save the file and refresh the browser.

To change the front page photo, replace `assets/hero.jpg` or change `heroImage` near the top of `content.js`.

## Publishing

The folder is ready for a static host such as GitHub Pages, Netlify or Cloudflare Pages.


## Current Queenstown friendship photos

- `assets/elliott-casey-daniel.jpg` — Elliott, Casey and Daniel together.
- `assets/daniel-queenstown-night.jpg` — Daniel by Lake Wakatipu at night.

These can be moved or recaptioned by editing the `photos` list in the relevant entry inside `content.js`.
