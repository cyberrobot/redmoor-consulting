# Redmoor Consulting

The Redmoor Consulting website is a statically generated Astro site. The current scope contains one route, `/`, and preserves the original homepage content and presentation.

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

Homepage copy is stored in `src/content/home.json`. The root `.pages.yml` file exposes that content in Pages CMS while keeping layout, styling, icons, analytics, and cookie consent in code.

Pages CMS saves edits as commits in GitHub. Configure the existing hosting provider to build commits from the production branch using:

- Build command: `npm run build`
- Publish directory: `dist`
- Node.js version: `22`

Additional routes and content collections are intentionally deferred.
