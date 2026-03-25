# Gallery — CLAUDE.md

## Design System

Always read `docs/DESIGN.md` before making any visual or UI decisions.
All font choices, colors, spacing, and aesthetic direction are defined there.
Do not deviate without explicit user approval.

## Image Descriptions

图片源目录在 `~/Pictures/逐玉/`（或用户指定的其他目录），相册数据在 `src/data/albums/*.yaml`。

**每次对话开始时，如果工作目录是本项目，执行以下检查：**

1. 列出源图片目录中的所有图片文件
2. 对比当前 YAML 中已有的 `original` 字段
3. 如果发现新增或删除的图片，提醒用户并询问是否需要：
   - 为新图片生成描述并加入 YAML
   - 从 YAML 中移除已删除图片的条目
4. 生成描述时，必须先用 Read 工具查看图片内容，结合文件名生成简洁的中文描述
5. 同时将新图片复制到 `public/images/{albumId}/` 供本地开发使用

**描述风格：** 简洁、画面感强、不超过 25 字。描述画面中看到的内容，不编造剧情。
