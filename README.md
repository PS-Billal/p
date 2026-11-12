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

Next.js exports pages to `out/`, then `scripts/build-worker.mjs` packages the pages and the server-only contact handler into `dist/server/index.js`. Sites deploys this Cloudflare Worker. To preview the complete production application locally, run `npm start` and open `http://127.0.0.1:3100`. A static-only server can display the pages but cannot process the contact form.

## Brevo contact form

Copy `.env.example` to `.env`, then enter your Brevo API key:

```dotenv
BREVO_API_KEY=your-key
BREVO_SENDER_EMAIL=billalyasir5@gmail.com
BREVO_SENDER_NAME=Billal Yasir
CONTACT_EMAIL=billalyasir5@gmail.com
```

The sender must be verified in Brevo. Restart `npm run dev` or `npm start` after changing the environment. Local development starts Next.js and a small contact API on port 8787; the form always calls same-origin `/api/contact` endpoints. Node.js 22 or later is required.

For the hosted Site, set these same values as Sites runtime environment variables and mark `BREVO_API_KEY` secret, then deploy. Local `.env` files are ignored by Git and are never bundled or uploaded. The hosted form stays unavailable until its runtime credentials are configured; a local `.env` does not configure the hosted Site.

The form validates fields and a signed, expiring arithmetic puzzle on the server, includes a honeypot, limits repeated requests per server instance, and rejects reused challenges within an instance. Brevo receives a fixed recipient and the visitor's email as Reply-To. Errors preserve the form text. Success is shown only after Brevo accepts the email; inbox delivery is not independently verified. The puzzle is a lightweight spam deterrent, not a full CAPTCHA service. Multi-instance global rate limiting or stronger bot protection would require durable storage or a dedicated CAPTCHA provider.

Run `npm run test:api` for server tests. Brevo is mocked in tests; no test email is sent.

## Browser checks

Serve the production export, then run the checks in another terminal:

```powershell
npm start
npx playwright install chromium
npx playwright test
```

Set `TEST_URL` to test a different server. Set `BROWSER_PATH` to use an existing Chromium executable. The checks cover all eight requested viewport widths, pointer tilt, reset behavior, reduced motion, accessible mobile navigation, project destinations, and assets.

## Content and assets

- Portfolio facts come from the supplied brief. Edit `src/data/portfolio.js` to update projects, skills, and experience.
- Project previews are code-generated conceptual illustrations, explicitly labeled as such.
- A resume was not supplied. Download buttons are omitted rather than linked to a missing file. Add a verified resume under `public/resume/` before exposing a download action.
- GitHub and LinkedIn profile URLs were not supplied and are omitted.
- The contact form uses server-side Brevo delivery; direct email links remain available via `mailto:`.
- Canonical URLs use `https://billalyasir.com` as requested. Connecting that custom domain requires its owner’s DNS configuration; the Sites preview does not change it.
- Fonts are self-hosted by `next/font` at build time. Tech SVGs are from Simple Icons; unsupported logo assets use clearly generic Lucide technology symbols. Lucide icons and Simple Icons use their respective open-source licenses.

## Interaction architecture

`TiltCard` writes pointer coordinates to CSS custom properties inside one scheduled animation frame, without pointer-driven React renders. `TiltButton`, `MagneticButton`, `SpotlightCard`, and `FloatingTechCard` share that behavior. Project, skill, and experience cards use different rotation strengths. Pointer effects are disabled for touch and reduced motion. All content remains usable without animations or JavaScript.

No resume, external profile, performance metric, or live project destination has been invented.
