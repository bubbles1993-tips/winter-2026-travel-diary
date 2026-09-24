# Journal guide

## Repository map

- Repository: `bubbles1993-tips/winter-2026-travel-diary`
- Checkout: `C:\Users\Elliot\Documents\Journal\winter-2026-travel-diary`
- Main diary data: `content.js`
- Media: `assets/`
- Rendering and interaction: `app.js`
- Visual system and responsive galleries: `styles.css`
- Page shell and social metadata: `index.html`
- Deployment: GitHub Pages from `main`

`content.js` entries generally contain `id`, `navTitle`, `date`, `title`, `location`, `paragraphs`, and `media`. Media items use factual `alt` text and may have a shorter conversational `caption`. Videos may include a poster. Some entries also contain song data.

## Voice profile

The diary sounds like Elliot telling someone what happened after the fact. It is personal but not performative.

For evidence and fuller calibration, read [wordpress-voice.md](wordpress-voice.md). The older blog adds conversational mischief and self-deprecation to this restrained journal register; it does not override Elliott's current preferences.

Use:

- first-person narration
- concrete nouns and ordinary verbs
- dry understatement
- selective detail rather than exhaustive sequencing
- honest preference or mild surprise
- simple transitions such as `Then`, `After that`, or `That was...`
- occasional short sentences for rhythm
- a longer conversational setup followed by a short landing
- a brief aside or self-directed joke where it grows naturally from the supplied experience

Avoid:

- tourism copy: `breathtaking`, `unforgettable`, `hidden gem`, `must-see`
- manufactured lessons or emotional conclusions
- precise times or route claims that Elliot did not provide
- turning every photo into a separate event
- guessing who appears in a photo
- repeatedly using the same slang or punchline
- explaining jokes that already work

Tone calibration examples:

- Too polished: `The dramatic coastline offered an unforgettable introduction to Victoria.`
- Closer: `The Great Ocean Road was mostly wet coast, quick stops and a lot of road.`

- Too exact without evidence: `At 10:37 we reached the lookout before driving 42 minutes north.`
- Closer: `We reached the lookout later that morning, then carried on north.`

- Too sentimental: `It was a magical day I will treasure forever.`
- Closer: `It was one of the better surprises of the trip.`

Do not copy these lines mechanically. Match their restraint and sentence shape to the confirmed facts.

## Photo and caption decisions

Use a photo when it adds at least one of these:

- a place not already represented
- a person Elliot has identified and wants included
- a useful change of scale, weather, mood, or activity
- a genuinely good visual beat between paragraphs

Leave it out when it is redundant, private, an administrative screenshot, or impossible to place accurately. Do not publish timeline screenshots. Strip location metadata and check frames for addresses, booking references, licence details, and other personal information.

Alt text describes what is visible without interpretation. Captions may name confirmed people and add a dry observation, but should not repeat the paragraph.

## Layout guardrails

The gallery renderer adds `data-count` to each gallery. The current visual system uses complete responsive rows and fixed preview frames to avoid gaps caused by mixed portrait and landscape images. Originals remain uncropped in the lightbox.

When adjusting layout:

- preserve a three-column wide, two-column tablet, one-column phone rhythm unless a better tested layout replaces it
- keep touch targets and captions readable
- avoid headings or overlays covering faces or the focal point of a hero image
- test entries with one, two, three, five, seven, and eight media items
- preserve reduced-motion and keyboard/lightbox behaviour
- prefer CSS changes over editing source images merely to fit a card

## Approval and GitHub rules

The default workflow is review-controlled:

1. Gather confirmed update details and media.
2. Draft locally without committing.
3. Preview and show Elliot the proposed result.
4. Wait for explicit approval.
5. Branch from the latest `main`, create one focused commit, push, and open a draft PR.
6. Stop. Merge or deploy only after a separate explicit request.

An explicit instruction such as `merge this PR`, `publish it`, or `merge all PRs into main` authorizes that named action. It does not authorize unrelated content changes. Resolve overlapping PRs from oldest to newest when safe, and ensure a newer comprehensive PR does not lose intervening journal entries.

## Preflight checklist

- latest `main` verified
- intended personal facts confirmed
- no private metadata or screenshots
- copy sounds like Elliot rather than a travel brochure
- no invented detail or false certainty
- all existing unrelated entries and media preserved
- JavaScript parses
- asset paths resolve
- desktop and phone previews checked
- draft PR only unless merge was explicitly requested
- live Pages state reported honestly, including pending deployment
