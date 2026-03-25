# Design System — Gallery

## Product Context

- **What this is:** 个人影视截图图册站，以相册为单位组织内容，每个相册对应一部剧/电影
- **Who it's for:** 自己 + 可能分享给朋友
- **Domain:** gallery.polunzh.com
- **Project type:** 独立静态站，部署在 Cloudflare Pages，图片存储在 Cloudflare R2

## Aesthetic Direction

- **Direction:** Immersive Dark + Editorial
- **Decoration level:** Minimal — 让画面说话，UI 退后
- **Mood:** 像在一个安静的私人影院里翻阅剧照集。沉浸、安静、有叙事节奏
- **Key principle:** 不喧宾夺主，图片是绝对主角

## Layout

### 首页（相册列表）

- 深色背景，每个相册以封面图 + 标题呈现
- 封面区域借鉴 Style C 横向滚动：展示 4-5 张精选图，可拖动预览
- 点击进入相册详情页

### 相册详情页（核心页面）

- **Hero 入场**：第一张图接近全屏高度（70vh），标题叠在图片底部（渐变遮罩 + 暖白字），用户一打开就被画面"包住"
- **Style D 叙事排版**为主体：
  - 全宽大图展示关键场景
  - 双图并排做对比/情绪对照
  - 穿插文字段落（可选，非必填）—— 上下大留白（120px），字号 20-22px，字间距放宽，左右加装饰线（`── 文字 ──`），像章回体小说的回目
  - 大小图交替排列，制造视觉节奏
- 支持 Lightbox：点击任意图片进入全屏浏览，方向键/滑动切换，Esc 退出
- 滚动触发淡入动效（subtle，不花哨）

### 布局节奏规则

```
[Hero 全屏大图 + 叠字标题]
  （可选 ── 叙事文字 ──）
[全宽大图]
  （可选 ── 叙事文字 ──）
[双图并排]
[全宽大图]
[双图并排]
...
```

- 每个相册的布局由数据驱动，支持配置每张图的展示方式（hero / full / half）
- 不需要手动写 HTML，通过数据文件定义相册结构

## Typography

- **Display / 标题 / 图注:** LXGW WenKai（霞鹜文楷）— 手写楷体质感，和古装影视气质天然匹配，不像传统书法体那么沉重。用于相册标题、hero caption、图注、叙事文字段落
- **Body / 正文 / UI:** Noto Sans SC (300/400) — 干净清瘦，用于说明文字和 UI 元素，不抢戏
- **Loading:** Google Fonts CDN（霞鹜文楷已收录）
- **Scale:**
  - 相册标题: 28px
  - Hero 叠字标题: 36px（叠在图片上时需要更大）
  - 叙事文字段落: 20-22px，字间距 0.12em
  - Hero caption: 20px
  - 正文/说明: 15px
  - 图注/标签: 13px，字间距 0.08em
  - 导航/UI: 13px

## Color

- **Approach:** Restrained — 几乎无彩色，让图片的色彩主导视觉
- **Background:** `#0a0a0a`（纯黑），叠加极淡的 film grain 噪点纹理（CSS noise SVG, opacity ~0.03），增加胶片质感和温度
- **Text primary:** `#f0ebe3` (opacity 0.7-0.9) — 暖白，避免纯白刺眼，与影视画面暖金色调呼应
- **Text secondary:** `#f0ebe3` (opacity 0.35-0.5)
- **Text muted:** `#f0ebe3` (opacity 0.2)
- **Divider / Border:** `#ffffff` (opacity 0.08-0.15)
- **Hover highlight:** `#ffffff` (opacity 0.04-0.1)
- **No accent color** — 刻意不设主题色，避免与影视画面中的色彩冲突

## Spacing

- **Base unit:** 4px
- **Density:** Spacious — 给图片充分呼吸空间
- **Key values:**
  - 图片间垂直间距: 48-64px
  - 双图并排间距: 16px
  - Caption 到图片: 14-20px
  - Section 间: 64px
  - 页面水平 padding: 40px (mobile: 20px)
- **Max content width:** 1100px

## Border Radius

- 图片: 4px（微圆角，保持画面严肃感）
- Lightbox 图片: 4px
- 按钮/标签: 100px（pill 形状）
- 卡片: 8px

## Responsive

### 断点

- **Desktop:** ≥1024px — 默认体验，max-width 1100px 居中
- **Tablet:** 768px–1023px — 布局基本不变，padding 收窄到 24px
- **Mobile:** <768px — 关键调整见下

### Mobile 适配规则

- **Hero 图**：保持 70vh 高度，标题字号缩至 28px
- **双图并排 → 单图纵排**：pair 布局在 mobile 下变为单列，避免每张图被压太小
- **横向滚动预览（首页）**：每张图宽度改为 85vw，padding 收窄到 16px
- **叙事文字段落**：字号保持 18-20px，上下留白缩减到 80px，装饰线缩短
- **页面水平 padding**：20px（mobile）→ 24px（tablet）→ 40px（desktop）
- **导航栏**：字号缩至 11px，padding 收紧，保持一行不换行
- **Lightbox**：支持触摸滑动切换（左右 swipe），关闭按钮增大触摸区域到 44x44px
- **图注**：字号不变（13px），但间距适当收紧

### 图片响应式

- 使用 `srcset` + `sizes` 按视口宽度加载合适尺寸的图片
- Mobile 下全宽图加载 ~600px 宽度版本，Desktop 加载 ~1100px 版本
- 双图并排在 Desktop 加载 ~542px 版本

## Motion

- **Approach:** Minimal-functional + 少量叙事性动效
- **Scroll fade-in:** opacity 0→1 + translateY 20px→0, duration 800ms, ease
- **Image hover:** scale 1→1.02, duration 600ms, cubic-bezier(0.25, 0.1, 0.25, 1)
- **Lightbox:** fade in 300ms
- **横向滚动:** 拖拽跟手，无弹性动画
- **Easing:** enter(ease-out) exit(ease-in) move(ease-in-out)
- **不使用:** 弹跳、旋转、3D 翻转等花哨动效

## Image Handling

- **Storage:** Cloudflare R2
- **Format:** 原图保持原格式，考虑生成 WebP 缩略图用于列表展示
- **Sizes:**
  - 全宽展示: max-width 1100px
  - 双图并排: 各 ~542px
  - 横向滚动预览: ~800px
  - 缩略图 (列表页): ~600px
- **Lazy loading:** 非首屏图片使用 `loading="lazy"`
- **Aspect ratio:** 保持原始比例，不裁切

## Data Structure

每个相册由一个数据文件定义（JSON 或 YAML）：

```yaml
album:
  id: zhuyu
  title: 逐玉
  cover: zhuyu/cover.jpg
  date: 2025-03
  layout:
    - type: full
      src: zhuyu/tianxiwei-chushi.jpg
      caption: 初识
      text: 第一次相遇的画面
    - type: text
      content: 雪落无声，江湖路远
    - type: pair
      items:
        - src: zhuyu/xuezhong-liaotian.jpg
          caption: 雪中聊天
        - src: zhuyu/xuezhong-beiying.jpg
          caption: 雪中背影
    - type: full
      src: zhuyu/jiuren.jpg
      caption: 救人
```

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-25 | 选择 D 叙事排版 + A 沉浸暗底 | 宽幅电影截图需要大尺寸展示；叙事排版提供视觉节奏；暗底衬托影视画面 |
| 2026-03-25 | 排除瀑布流 (B) | 21:9 宽幅图在多列布局中被过度压缩，画面细节丢失 |
| 2026-03-25 | 横向滚动 (C) 仅用于首页预览 | 全页横向滚动在图片多时浏览效率低，但适合做精选预览 |
| 2026-03-25 | 不设主题色 | 避免与影视画面中的色彩冲突，让图片色彩主导 |
| 2026-03-25 | 数据驱动布局 | 避免每个相册手写 HTML，通过 YAML/JSON 配置布局结构 |
| 2026-03-25 | 字体改用霞鹜文楷 | 手写楷体和古装剧气质匹配，Noto Serif SC 太安全无个性 |
| 2026-03-25 | 背景加 film grain + 文字改暖白 | 纯黑+纯白太数码冷感，噪点纹理增加胶片温度，暖白呼应画面色调 |
| 2026-03-25 | Hero 图全屏入场 + 叠字标题 | 增强相册入口仪式感，用户一打开就被画面包住 |
| 2026-03-25 | 叙事文字加装饰线 + 大留白 | 像章回体回目，强化叙事节奏，避免文字段落存在感太弱 |
