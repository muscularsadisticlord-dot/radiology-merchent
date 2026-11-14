# Radiology MCQ Trainer

An interactive, offline-friendly multiple-choice question app for radiology exam revision (e.g. FRCR-style
practice). It covers **CNS, chest, abdomen, MSK, GU and radiology physics**, with a dark clinical
dashboard designed for **iPad and iPhone** as well as desktop.

It is written in plain **HTML, CSS and JavaScript**: there are no build tools, no backend, no
dependencies and no API keys. It runs on **GitHub Pages** under a repository subpath
(e.g. `https://<user>.github.io/radiology-merchent/`) or straight from disk.

> **Content disclaimer.** The questions are original educational material written for this app.
> They contain no citations by design. Review every question against current guidelines and standard
> texts before relying on it. Not intended for clinical decision-making.

---

## Features

- **One question at a time**, four options. Select an answer, then press **Submit**, so a mis-tap
  doesn't count.
- After you submit, the app shows the **correct answer**, your answer (if wrong), a short
  **explanation** and a **learning point**.
- **Topic filters**: pick one or more of CNS, Chest, Abdomen, MSK, GU, Physics.
- **Question sets**: All, Unanswered, Previously wrong, Favorites.
- **Favorites** (★) with their own revision list.
- **Score tracking**: session score, accuracy, current and best streak.
- **Dashboard**: questions seen, overall accuracy, accuracy per topic, and your weakest topic.
- **History**: past sessions with scores, plus your 30 most recent answers.
- **Optional shuffle** of question order and answer order.
- **Persistent progress** in the browser's `localStorage`, with **Export / Import** (JSON) to move
  progress between devices and **Reset** to clear it.
- Built for touch: tap targets of 44 px or more, bottom tab bar on phones, iOS safe-area support,
  and no input zoom.
- **Keyboard shortcuts** (iPad keyboard or desktop): `1–4` / `A–D` select · `Enter` submit / next ·
  `←` `→` move · `F` favorite.

## Project structure

```
index.html          App shell (must stay at the repository root for GitHub Pages)
css/styles.css      Dark dashboard theme and responsive layout
js/questions.js     Question bank: edit this to add or review questions
js/storage.js       localStorage persistence (versioned, fails safe)
js/app.js           Quiz engine, filters, dashboard, favorites, history
.nojekyll           Tells GitHub Pages to serve files as-is
```

Every asset is referenced with a **relative path** (`css/…`, `js/…`), which is why the app works
under a repository subpath.

## Run locally

Option 1: open `index.html` directly in a browser (double-click). Everything works from `file://`.

Option 2: serve the folder with any static web server, for example:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Publish on GitHub Pages

1. Push the code to GitHub. `index.html` must be at the root of the branch you publish.
2. On GitHub, open the repository → **Settings** → **Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose the branch (e.g. `main`) and folder **`/ (root)`**, then click **Save**.
5. Wait 1–2 minutes. The **Pages** settings page (and the repository's **Actions** tab, under
   "pages build and deployment") shows the published URL, normally:
   `https://<your-username>.github.io/radiology-merchent/`
6. Open the URL and check that a question loads. If you see a 404, check that the branch and folder
   are correct and that the latest deployment finished.

Notes:
- GitHub Pages on a **private** repository requires a paid GitHub plan; public repositories are free.
- Progress is stored **per browser and per site address**. Progress made on your local copy will not
  appear on the GitHub Pages site. Use **Dashboard → Export / Import progress** to move it.
- On iPhone/iPad you can use **Share → Add to Home Screen** for a full-screen, app-like launch.

## Adding or editing questions

Open `js/questions.js` and add an object to `window.RAD_QUESTIONS`:

```js
{
  id: 'chest-04',               // unique; never reuse an id (progress is stored against it)
  topic: 'chest',               // cns | chest | abdomen | msk | gu | physics
  difficulty: 'core',           // core | intermediate | advanced
  stem: 'Question text…',
  options: ['Option A', 'Option B', 'Option C', 'Option D'],   // exactly four
  answer: 2,                    // index (0–3) of the correct option
  explanation: 'Why the answer is right and the others are wrong…',
  learningPoint: 'One take-home message…'
}
```

To add a new topic, add `{ id, label }` to `window.RAD_TOPICS` and a matching `--t-<id>` colour plus
`.topic-<id>` rules in `css/styles.css`.

Content guidelines: write original questions, keep explanations short, and do not add references
unless you have checked that they exist and support the statement.

## Data & privacy

All data stays in your browser (`localStorage` key `radmcq.progress.v1`). Nothing is sent anywhere.
If storage is unavailable (e.g. some private-browsing modes), the app still works and shows a notice
that progress will not be saved.

## Testing

Before release this version was checked with:

- a data check script (unique IDs, exactly 4 distinct options, valid answer index, non-empty
  explanation and learning point, all 6 topics covered); and
- automated browser tests (Playwright/Chromium) on emulated iPhone 14, iPad Pro 11 (portrait and
  landscape) and desktop, served under a `/radiology-merchent/` subpath. The tests covered
  answering correctly and incorrectly, feedback display, score/streak, favorites, topic and mode
  filters, keyboard shortcuts, persistence across reloads, export/import/reset, corrupted or
  blocked storage, hash deep links, absence of horizontal scrolling, and no console errors or
  failed requests.

## Roadmap ideas

Timed exam mode, image-based questions, larger question bank, spaced-repetition scheduling, and
PWA offline caching.
