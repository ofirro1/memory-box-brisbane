# Memory Box Brisbane

Static website for [Memory Box Brisbane](https://mymemorybox.com.au/), a home photo-digitisation service in Brisbane's west. It is plain HTML, CSS, and JavaScript. Nothing here depends on Base44 or a server.

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
- Photos are in `images/`. Founder portraits are `lia.jpg` and `leigh.jpg`.
- Icons are in `icons.svg`.
- The quote calculator is `js/quote.js`. It uses the same rate table as the previous site and keeps the result in the browser only. Email or call so a deposit can be matched — there is no database behind this page.
- Contact details used throughout: memoryboxbrisbane@gmail.com and 0431 444 241.

Preview locally from the repository root:

```bash
python3 -m http.server 8765
```

Then open http://127.0.0.1:8765/. Use a local server so the icon sprite loads. Opening the HTML files directly can hide the icons.

## GitHub Pages

The site is published from the root of `main` by `.github/workflows/pages.yml` (source: GitHub Actions).

Custom domain: **https://mymemorybox.com.au/** (`CNAME` in the repo root). The project URL https://ofirro1.github.io/memory-box-brisbane/ keeps working because styles, images, and page links are relative.

At the DNS host (GoDaddy), point the apex at GitHub Pages with these records and remove the old GoDaddy A records (`13.248.243.5` and `76.223.105.230`) and the `www` CNAME that points at the apex:

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `ofirro1.github.io` |

`www.mymemorybox.com.au` then redirects to the apex. Enforce HTTPS after those records resolve to GitHub.
