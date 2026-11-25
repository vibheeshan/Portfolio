# Sushmita Dasari — Combined Portfolio

One single-page React + TypeScript + Vite site that combines the three source portfolios:

| Section (id) | Source | What it does |
| --- | --- | --- |
| Loader | Glass Shard | Glitch countdown intro |
| Starfield, spark cursor, navbar | Glass Shard | WebGL starfield, spark cursor, blur-on-scroll navbar |
| `#hero` | Glass Shard | WebGL shard hero, venom button |
| `#stats` | Glass Shard | Count-up statistics |
| `#featured` | Netflix | Holographic tilt card, scrolling marquee |
| `#about` | Glass Shard | Portrait + bio with hanging-photo animation |
| `#origin` | Netflix | Bento cards with mouse spotlight |
| `#expertise` | Netflix | Sticky stacking cards with scroll blur |
| `#services` | Glass Shard | Glass service rows |
| `#skills` | Glass Shard | Skill cards + tech strip |
| `#stack` | Netflix | Horizontal/scrubbed skill categories |
| `#work` | Glass Shard | 3D video-reel gallery + video modal |
| `#projects` | Netflix | Folder-opening project archive |
| `#experience` | Sri Tech | Scroll-reveal timeline and founder card |
| `#contact` | Netflix | Contact form with parallax watermark |
| Footer | Netflix | Links and location |

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview
```

## Where to edit

- Text and most content: `src/data/portfolioData.ts`
- Netflix sections: `src/components/netflix/*`
- Experience timeline: `src/components/Experience.tsx`
- Project posters: `public/assets/thumbnails/project-<n>-1..3.jpg` (generated placeholders; replace with real screenshots)
- Portrait: `public/media/portrait.png`

## Still to fill in

- Email, phone and social profile URLs (`SITE`, `SOCIALS`, and the footer and contact links)
- Contact form submission (currently only shows a confirmation; no backend is connected)
- Verify the numbers in the Netflix hero and project cards ("99.9% Uptime", "match" percentages)
