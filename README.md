# Memory Box Brisbane

Static website for [Memory Box Brisbane](https://ofirro1.github.io/memory-box-brisbane/), a home photo-digitisation service in Brisbane's west. It is plain HTML, CSS, and JavaScript. Nothing here depends on Base44 or a server.

## Pages

| Path | What it is |
| --- | --- |
| `/` | Homepage |
| `/quote/` | Instant estimate questionnaire (calculated in the browser) |
| `/terms/` | Terms & conditions |
| `/privacy/` | Privacy policy |

Login, registration, and order tracking from the old app are not included.

## Edit the site

- Copy and section order live in `index.html`, `quote/index.html`, `terms/index.html`, and `privacy/index.html`.
- Colours, type, and spacing are in `css/styles.css`. Headings use [Fraunces](https://fonts.google.com/specimen/Fraunces); body text uses [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans).
- Photos are in `images/`. Replace `lia.jpg` or `teammate.jpg` when real portraits are ready. The second team card is still the live-site placeholder ("Your name here").
- Icons are in `icons.svg`.
- The quote calculator is `js/quote.js`. It uses the same rate table as the previous site and keeps the result in the browser only. Email or call so a deposit can be matched — there is no database behind this page.
- Contact details used throughout: memoryboxbrisbane@gmail.com and 0431 444 241.

Preview locally from the repository root:

```bash
python3 -m http.server 8765
```

Then open http://127.0.0.1:8765/. Use a local server so the icon sprite loads. Opening the HTML files directly can hide the icons.

## GitHub Pages

The site is meant to be served from the root of `main`.

1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. The workflow in `.github/workflows/pages.yml` publishes the repository root on every push to `main`.

If you would rather not use Actions, set **Source** to **Deploy from a branch**, branch `main`, folder `/ (root)`. A `.nojekyll` file is included so Pages serves the files as-is.

After it is enabled, the site is at:

**https://ofirro1.github.io/memory-box-brisbane/**

No custom domain is configured.
