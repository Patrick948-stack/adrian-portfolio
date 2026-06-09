# Adrian Ackerman — Portfolio

This is a personal portfolio website that I designed for my friend, Adrian Ackerman, a media professional with experience in video production, photography, content strategy, and social media. I built this website following Miladicode's YouTube tutorial "How to Create an Animated Portfolio Website with HTML, CSS & JavaScript | Step-by-Step Tutorial", then modified the source code to fit Adrian's preferences. I also created an experience section with animations that were not there in Miladi's version.

**Live site**: *https://patrick948-stack.github.io/adrian-portfolio/*

---

## Website Structure

- **Hero section** — Typewriter effect intro animation over a looping space video of a black hole since Adrian loves space
- **About cards** — A four-card grid covering background, tools, availability, and the motivation behind their work
- **Project gallery** — Embedded YouTube videos that play on hover using the YouTube IFrame API
- **Skills section** — Two typewriter descriptions (Media Producer & Content Strategist) that trigger when the section scrolls into view, alongside an auto-scrolling tool logo carousel
- **Experience timeline** — A vertical timeline of past roles with expandable accordion panels (no JavaScript — pure HTML `<details>`)
- **Contact** — Social links + a Formspree-powered contact form

---

## Tech stack

- **HTML / CSS / JavaScript** (vanilla)
- **[AOS](https://michalsnik.github.io/aos/)** — scroll-triggered fade/blur animations
- **[Boxicons](https://boxicons.com/)** + **Font Awesome** — icons
- **[Montserrat](https://fonts.google.com/specimen/Montserrat)** via Google Fonts
- **[YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference)** — hover-to-play on project embeds
- **[Formspree](https://formspree.io/)** — contact form backend (no server needed)

---

## Running it locally

Just open `index.html` in a browser:

```bash
open index.html
```

Or serve it with any static file server if you prefer:

```bash
npx serve .
# then visit http://localhost:3000
```
Or follow the link: https://patrick948-stack.github.io/adrian-portfolio/. 
The YouTube hover-play feature needs a server to work (browsers block the IFrame API on `file://` URLs). The rest of the site works fine without one.

---

## Project structure

```
├── index.html          # The whole site lives here
├── styles.css          # All styles
├── app.js              # Typewriter logic, YouTube API, scroll logic
├── images/             # Logos, grid card images, skill icons
└── videos/             # Background and hero videos (galaxy, blackhole, globe, hero)
```

---

## Credits

Designed and built by **Patrick MM**.
Source Code: https://github.com/MiladiCode/Animated-Portfolio 
Portfolio content and career work by **Adrian Ackerman**.
