# Billal Yasir — Engineering Portfolio

A JavaScript-only Next.js portfolio with a dark and deep-lime visual identity, four static case studies, and a reusable CSS 3D interaction system.

## Development

```powershell
npm install
npm run dev
```

Open the URL printed by Next.js. Use `http://127.0.0.1:3000` if another application occupies the IPv6 localhost address.

## Production

```powershell
npm run build
```

The complete static website is exported to `out/`. It can be hosted on any static server. The `.openai/hosting.json` manifest connects this checkout to its private Sites deployment. `next start` is not used for this static-export configuration.

## Browser checks

Serve the production export, then run the checks in another terminal:

```powershell
python -m http.server 3100 --bind 127.0.0.1 --directory out
npx playwright install chromium
npx playwright test
```

Set `TEST_URL` to test a different server. Set `BROWSER_PATH` to use an existing Chromium executable. The checks cover all eight requested viewport widths, pointer tilt, reset behavior, reduced motion, accessible mobile navigation, project destinations, and assets.

## Content and assets

- Portfolio facts come from the supplied brief. Edit `src/data/portfolio.js` to update projects, skills, and experience.
- Project previews are code-generated conceptual illustrations, explicitly labeled as such.
- A resume was not supplied. Download buttons are omitted rather than linked to a missing file. Add a verified resume under `public/resume/` before exposing a download action.
- GitHub and LinkedIn profile URLs were not supplied and are omitted.
- Contact actions use the provided email address via `mailto:`.
- Canonical URLs use `https://billalyasir.com` as requested. Connecting that custom domain requires its owner’s DNS configuration; the Sites preview does not change it.
- Fonts are self-hosted by `next/font` at build time. Tech SVGs are from Simple Icons; unsupported logo assets use clearly generic Lucide technology symbols. Lucide icons and Simple Icons use their respective open-source licenses.

## Interaction architecture

`TiltCard` writes pointer coordinates to CSS custom properties inside one scheduled animation frame, without pointer-driven React renders. `TiltButton`, `MagneticButton`, `SpotlightCard`, and `FloatingTechCard` share that behavior. Project, skill, and experience cards use different rotation strengths. Pointer effects are disabled for touch and reduced motion. All content remains usable without animations or JavaScript.

No resume, external profile, performance metric, or live project destination has been invented.
