# lab7-website

Visualization of minimum-cost polygon triangulation (bottom-up DP + brute force), ported from `../index.ts` to React + Vite.
Stack: Tailwind v4 + shadcn/ui (Base UI), lucide icons, IBM Plex Sans Thai / IBM Plex Mono.

```bash
bun install
bun dev      # http://localhost:5173
bun run build
```

- `src/lib/triangulation.ts` — the algorithm (DP, brute force, input parser)
- `src/lib/solve.ts` — runs everything for one input and packs the data the page needs
- `src/hooks/usePlayback.ts` — play / pause / step through DP steps
- `src/components/` — polygon view, dp table, step text, controls, brute-force gallery, points input
- `src/components/ui/` — shadcn components (generated, don't hand-edit)
- `src/config.ts` — presets, default points and size limits
- `src/index.css` — palette + theme tokens (see the header comment for design decisions)
