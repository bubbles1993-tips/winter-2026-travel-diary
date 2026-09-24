---
name: update-elliot-travel-journal
description: Update, refine, preview, and publish Elliot's Winter 2026 travel-journal website while preserving his dry first-person voice and factual accuracy. Use for new diary entries, supplied photos or videos, captions, title and layout changes, gallery spacing, journal-wide tone edits, or GitHub publication work in bubbles1993-tips/winter-2026-travel-diary.
---

# Update Elliot's Travel Journal

Maintain the journal as a personal record rather than polished travel copy. Preserve Elliot's voice, confirmed facts, existing media, and review control.

Read [references/journal-guide.md](references/journal-guide.md) before changing journal copy, media, layout, or GitHub state.

## Start safely

1. Ask what Elliot has been doing, which new places he visited, and which photos or videos belong in the update. Wait for his reply unless the current request already supplies those details.
2. Treat past claims that the site is updated or live as historical. Inspect the current repository, default branch, open PRs, and working tree.
3. Use the nested checkout at `C:\Users\Elliot\Documents\Journal\winter-2026-travel-diary`, not the parent Journal folder.
4. Read `README.md` and any applicable `AGENTS.md` before editing.
5. Preserve unrelated user changes. If local and remote states differ, begin from the latest `main` and carry forward only the intended update.

## Establish the facts

- Inspect supplied media and metadata, but do not infer identities, relationships, dates, locations, chronology, or motives from appearance alone.
- Ask one focused question when a missing fact would materially change the entry or caption.
- Keep uncertainty when Elliot is uncertain.
- Exclude private addresses, booking details, timeline screenshots, and location metadata from published assets.
- Do not imply access to Google Photos when only a shared link or exported files are available.

## Draft in Elliot's voice

- Read [references/wordpress-voice.md](references/wordpress-voice.md) for the source-backed voice calibration, especially for substantial drafting or tone edits. It draws on Elliott's 2011-2013 blog; current instructions and approved recent copy take precedence.
- Write in the first person and keep the tone dry, conversational, understated, and specific.
- Prefer a few concrete details and one honest reaction over a complete itinerary.
- Vary conversational sentences with occasional blunt fragments. Let a longer setup end in a short, plain landing; do not make every sentence clipped.
- Allow self-deprecation, a brief reader-facing aside, or mock-formal wording about an ordinary inconvenience when the facts support it. Keep humour optional and avoid stacking jokes.
- Keep the narrator involved: admit a mistaken expectation, an ordinary preference, or an uncertain memory when supplied. Do not replace personality with neutral itinerary summaries.
- Keep captions shorter and looser than body copy. Keep alt text plain and literal.
- Avoid travel-blog language, promotional adjectives, sentimentality, invented dialogue, minute-by-minute chronology, and overstated certainty.
- Avoid leaning repeatedly on one expression such as `cooked`; rework the sentence or use a neutral description without adding drama.
- Preserve existing wording outside the requested scope unless Elliot asks for a whole-site voice pass.

## Update the site

1. Put diary data, dates, navigation labels, and media references in `content.js`.
2. Put images and videos under `assets/`; use concise stable filenames and web-appropriate formats.
3. Change `app.js`, `styles.css`, or `index.html` only for behaviour, presentation, metadata, or structure.
4. Preserve the responsive gallery system: consistent preview frames, complete rows where practical, and uncropped originals in the lightbox.
5. Keep headings and overlays legible without covering important parts of hero photos. Check both wide and phone layouts.
6. Do not remove or replace existing entries or assets unless Elliot explicitly asks.

## Review before publication

- Keep new journal edits local and uncommitted while drafting.
- Preview over a local HTTP server; do not rely on opening `index.html` directly.
- Show Elliot the proposed copy and a concise summary of visual/media changes.
- Obtain explicit approval immediately before publishing personal text or photos.
- After approval, create a focused branch and a draft PR. Do not merge or deploy unless Elliot explicitly asks in a later instruction.
- If Elliot explicitly asks to merge or publish, re-check the PR diff, conflicts, and latest `main` first. Preserve newer content when resolving overlap.

## Validate

- Run JavaScript syntax checks for `content.js` and `app.js`.
- Confirm every referenced local media path exists and no unintended media disappeared.
- Compare entry and media counts before and after; explain intentional differences.
- Check names, dates, captions, alt text, private information, and metadata.
- Preview the hero, mixed portrait/landscape galleries, videos, Spotify embeds, sticky navigation, lightbox, and responsive breakpoints.
- Confirm the final branch contains only intended files. After a requested merge, verify `main`, the PR states, and the live Pages result when available.

## Report clearly

Lead with the result. Link the draft PR or merged PRs, say whether the live site changed, list the important edits, and call out anything that still needs Elliot's confirmation.
