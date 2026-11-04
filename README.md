# Portfolio · Fátima García Muriana

*[Leer en español](README.es.md)*

My personal website as a junior web developer: who I am, what I've built, where I've worked and how to reach me.

<!-- **Live:** add the URL once it's deployed -->
<!-- ![Portfolio](docs/screenshot.png) -->

## What's inside

- Projects, experience, education, skills and contact, all read from one content file (`src/data/content.json`)
- My CV as a PDF download
- A small **admin panel** at `/admin` to edit every text, reorder items and upload project images without touching code

## Design

Soft and calm on purpose: ivory and powder-pink backgrounds, rose-gold and light-gold details, Fraunces for headings and Inter for body text. Every text colour passes WCAG AA contrast.

Motion is subtle and optional:
- Sections fade and rise 16 px as you scroll, once, with a short stagger between cards
- Cards lift slightly with a rose shadow on hover (mouse only, never on touch screens)
- A thin gold line draws itself under each section title

With `prefers-reduced-motion`, nothing moves: content just appears, the lines are already drawn and the background circles stay still. Built with Framer Motion (`MotionConfig reducedMotion="user"`) plus CSS media queries.

## The admin panel

I didn't want to edit JSON by hand every time I finished a project, so I built a simple panel instead of adding a CMS:

- **Sign in with Google, and only with my account.** There's no password: the server runs the OAuth 2.0 authorization-code flow with PKCE and a `state` check, then accepts the login only if Google confirms the verified email set in `ADMIN_EMAIL`
- The session lives in an `httpOnly` cookie signed with HMAC-SHA256 and expires after 8 hours
- **Every save is validated with Zod**, so a typo can't break the site. Errors come back field by field
- **Each save keeps the previous version** (the last 30), and any of them can be restored
- Image uploads with an extension, MIME type and size check
- The public page is rebuilt after each save (`revalidatePath`)

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Zod · Phosphor Icons · Fontsource (Fraunces, Inter)

## Running it locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

For the admin panel, `.env.local` needs your Google OAuth client (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`), the account allowed in (`ADMIN_EMAIL`), `APP_URL` and `SESSION_SECRET` (at least 32 random characters). The redirect URI to register in Google Cloud is `APP_URL/api/admin/login/callback`. The public site works without any of them.

## Note on deployment

The panel saves to the file system, which works locally and on a regular Node server. On serverless hosting (Vercel, Netlify) files can't be changed in production, so the plan there is to edit locally and redeploy, or move the content to a database later on.

## Contact

[GitHub](https://github.com/FatimaGarM) · [LinkedIn](https://www.linkedin.com/in/fatimagarciamuriana/)
