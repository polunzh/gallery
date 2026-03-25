[中文](./README.zh-CN.md) | **English**

# Gallery

Personal cinematic screenshot gallery at [gallery.polunzh.com](https://gallery.polunzh.com).

## Stack

- **Framework:** Vue 3 + Vite + vite-ssg (static site generation)
- **Images:** Cloudflare R2
- **Deploy:** Cloudflare Pages

## Development

```bash
pnpm install
pnpm dev
```

## Adding a New Album

1. Create a YAML file in `src/data/albums/` (see `zhuyu.yaml` for format)
2. Upload images to R2:
   ```bash
   node scripts/upload.mjs src/data/albums/your-album.yaml --source ~/Pictures/YourAlbum
   ```
3. Push to GitHub — Cloudflare Pages auto-deploys

## Build

```bash
pnpm build     # generates static site in dist/
pnpm preview   # preview the build locally
```
