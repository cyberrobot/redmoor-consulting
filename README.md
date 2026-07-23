# Redmoor Consulting

The Redmoor Consulting website is a statically generated Astro site. It preserves the original homepage content and presentation and includes content-driven Work case studies.

## Local development

Use Node.js 22 (see `.nvmrc`), then install dependencies and start Astro:

```sh
npm install
npm run dev
```

Run the production checks and static build with:

```sh
npm run build
```

The generated site is written to `dist/`.

## Content editing

Homepage copy is stored in `src/content/home.json`. Work entries are stored as Markdown in `src/content/work/`. The root `.pages.yml` file exposes both in Pages CMS while keeping layout, styling, icons, analytics, and cookie consent in code.

Pages CMS saves edits as commits in GitHub. Configure the existing hosting provider to build commits from the production branch using:

- Build command: `npm run build`
- Publish directory: `dist`
- Node.js version: `22`

The first Work entry is generated at `/work/santander-auto-services/`.
