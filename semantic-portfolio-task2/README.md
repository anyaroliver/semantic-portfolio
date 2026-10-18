# Semantic Portfolio Starter

A four-page, responsive portfolio starter built with semantic HTML5, CSS, and a small amount of progressive-enhancement JavaScript.

## Pages
- `index.html` — home and featured projects
- `about.html` — biography and approach
- `projects.html` — project case studies
- `contact.html` — keyboard-accessible contact form

## Run locally
Open `index.html` in a browser, or serve this folder using a local static server.

## Before publishing
1. Replace Alex Morgan, sample projects, email, and `https://example.com/` canonical URLs with real details.
2. Connect `contact.html` to a real form endpoint. The included form performs browser validation but does not send messages.
3. Run Lighthouse on the deployed site and test with keyboard-only navigation and a screen reader.
4. Add a sitemap, robots.txt, favicon, and real social preview image for production.

## Accessibility notes
Includes a skip link, landmark elements, a single page-level `h1`, meaningful heading hierarchy, visible focus styles, explicit form labels, native validation, status announcements, descriptive navigation labels, reduced-motion support, and no required JavaScript for navigation.

A Lighthouse score of 100 cannot be guaranteed across environments; audit the finished, deployed version and fix any reported issues.

## Task 2 — Advanced CSS3 & Responsive Architecture
- CSS custom properties centralize the design tokens and support light/dark themes.
- CSS Grid lays out project cards, value cards, and multi-column sections.
- Flexbox aligns navigation, metadata, footers, and action groups.
- Mobile-first media queries adapt the page at small, medium, and wide breakpoints.
- The theme toggle is keyboard operable, announces its state with `aria-pressed`, respects the system dark-mode preference on first visit, and remembers the selection when browser storage is available.
- Reduced-motion preferences and visible keyboard focus styles are included.
