**中文** | [English](./README.md)

# Gallery

个人影视截图图册，部署在 [gallery.polunzh.com](https://gallery.polunzh.com)。

## 技术栈

- **框架:** Vue 3 + Vite + vite-ssg（静态站生成）
- **图片存储:** Cloudflare R2
- **部署:** Cloudflare Pages

## 本地开发

```bash
pnpm install
pnpm dev
```

## 添加新相册

1. 在 `src/data/albums/` 下创建 YAML 文件（参考 `zhuyu.yaml` 格式）
2. 上传图片到 R2：
   ```bash
   node scripts/upload.mjs src/data/albums/your-album.yaml --source ~/Pictures/YourAlbum
   ```
3. 推送到 GitHub — Cloudflare Pages 自动部署

## 构建

```bash
pnpm build     # 生成静态站到 dist/
pnpm preview   # 本地预览构建产物
```
