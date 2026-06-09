# Adrian Ackerman — Portfolio

A personal portfolio site for Adrian Ackerman, a media professional and storyteller with 5+ years of experience in video production, photography, content strategy, and social media. Built as a single-page experience that feels more like a showreel than a resume.

**Live site**: *(add your URL here once deployed)*

---

## What's inside

The site walks visitors through who Adrian is, what he does, the work he's most proud of, and how to get in touch — all without ever leaving the page.

- **Hero section** — Typewriter intro animation over a looping space video, so the first impression lands with energy
- **About cards** — A four-card grid covering background, tools, availability, and the "why" behind the work
- **Project gallery** — Embedded YouTube videos that play on hover using the YouTube IFrame API
- **Skills section** — Two typewriter descriptions (Media Producer & Content Strategist) that trigger when the section scrolls into view, alongside an auto-scrolling tool logo carousel
- **Experience timeline** — A vertical timeline of past roles with expandable accordion panels (no JavaScript — pure HTML `<details>`)
- **Contact** — Social links + a Formspree-powered contact form

---

## Tech stack

This is deliberately lean — no framework, no build step. Just:

- **HTML / CSS / JavaScript** (vanilla)
- **[AOS](https://michalsnik.github.io/aos/)** — scroll-triggered fade/blur animations
- **[Boxicons](https://boxicons.com/)** + **Font Awesome** — icons
- **[Montserrat](https://fonts.google.com/specimen/Montserrat)** via Google Fonts
- **[YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference)** — hover-to-play on project embeds
- **[Formspree](https://formspree.io/)** — contact form backend (no server needed)

---

## Running it locally

No install required. Just open `index.html` in a browser:

```bash
open index.html
```

Or serve it with any static file server if you prefer:

```bash
npx serve .
# then visit http://localhost:3000
```

The YouTube hover-play feature needs a server to work (browsers block the IFrame API on `file://` URLs). The rest of the site works fine without one.

---

## Project structure

```
├── index.html          # The whole site lives here
├── styles.css          # All styles
├── app.js              # Typewriter logic, YouTube API, scroll observers
├── images/             # Logos, grid card images, skill icons
└── videos/             # Background and hero videos (galaxy, blackhole, globe, hero)
```

---

## Suggestions for taking this further

A few things that would noticeably level up the site:

**Performance**
- The background videos (`galaxy.mp4`, `blackhole.mp4`, etc.) are the biggest hit on load time. Compressing them or replacing them with CSS animations / WebGL for mobile would help a lot — mobile browsers often mute and delay autoplay in ways that break the effect.
- Add `loading="lazy"` to images and consider using WebP format for the grid/card images.

**Accessibility**
- The slider images (`images/1.png` through `images/10.png`) are missing meaningful `alt` text. Screenreaders would appreciate knowing those are logos for Adobe Premiere, Lightroom, etc.
- The `<button>` inside the contact card has a broken tag (`</a>` wraps the closing `</button>`) — worth fixing so click events are reliable.

**SEO & shareability**
- Add Open Graph meta tags (`og:title`, `og:description`, `og:image`) so link previews look good when shared on LinkedIn or messages.
- A `<meta name="description">` would go a long way.

**Mobile**
- Test the project gallery embeds on smaller screens — the fixed iframe dimensions (`width="560"`) tend to overflow. Wrapping iframes in a responsive container (`aspect-ratio: 16/9; width: 100%`) makes them fluid.

**Deployment**
- [Netlify](https://netlify.com) or [GitHub Pages](https://pages.github.com) are both free and take about 2 minutes to set up for a static site like this.

---

## Credits

Designed and built by **Patrick MM**.
Portfolio content and career work by **Adrian Ackerman**.
