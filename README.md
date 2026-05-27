# 週末去哪裡 (Weekend Picker TW)

> AI 微旅行 planner for Taiwan。5 個欄位 → 一份真的走得完的半日 / 一日行程 + 可分享 IG 限動卡。

**Live**: https://weekend-picker-tw.vercel.app

---

## Stack

- Next.js 16 (App Router) · TypeScript strict · Tailwind v4 · ShadCN UI
- **Claude Sonnet 4.6** via `@anthropic-ai/sdk`（tool-use 強制 JSON schema）
- 分享卡 / OG image：**satori + sharp** server-side render（Noto Serif TC + Noto Sans TC + Geist Mono）
- 表單：React Hook Form + Zod
- 動畫：Framer Motion（首頁標題逐字浮現、marker 線、shimmer、count-up）
- IP rate limit：Upstash Redis（sliding window 5/min + 30/day）
- 部署：Vercel（GitHub auto-deploy）

詳細技術決策見 [CLAUDE.md](./CLAUDE.md)，產品脈絡見 [product-plan.md](./product-plan.md)。

---

## Run locally

```bash
npm install
cp .env.example .env.local
# 填入 ANTHROPIC_API_KEY (其他在 local 是 optional)

NODE_OPTIONS="--max-old-space-size=2048" npm run dev
```

`NODE_OPTIONS` cap 是為了壓住 16GB Mac 在 first compile 時的 OOM（Tailwind v4 + Turbopack 第一次很吃）。

---

## 常用維運速查

### 看 API 花了多少錢
https://console.anthropic.com/settings/usage

### 改 AI model（Sonnet ↔ Haiku）
[lib/ai/generate-trip.ts](./lib/ai/generate-trip.ts) 第一行的 `MODEL` 常數。
- `claude-sonnet-4-6`：品質好、台灣地理 grounding 強，~$0.01–0.03/次
- `claude-haiku-4-5-20251001`：便宜 10x，繁中表達略遜，~$0.001–0.003/次

### 改 rate limit 數字
[lib/ratelimit.ts](./lib/ratelimit.ts) 裡的 `Ratelimit.slidingWindow(5, '1 m')` / `(30, '1 d')`。

### 看 rate limit 觸發狀況
Upstash console → Data Browser → keys 前綴 `rl:generate:`

### 看 production 錯誤
Vercel dashboard → weekend-picker-tw → Logs

### 改 prompt
[lib/ai/prompt.ts](./lib/ai/prompt.ts) `SYSTEM_PROMPT`。改完 push 就部署，下次 generate 用新版。

### 加新城市
1. [lib/constants/cities.ts](./lib/constants/cities.ts) 加一筆
2. Zod 衍生自 `CITY_VALUES`，會自動同步
3. push

### 改分享卡 / OG image 版型
- 分享卡 (1080×1920)：[lib/share-card/template.tsx](./lib/share-card/template.tsx)
- OG (1200×630)：[lib/share-card/og-template.tsx](./lib/share-card/og-template.tsx)
- 兩個都用 [lib/share-card/render.ts](./lib/share-card/render.ts) 渲染（satori → sharp PNG）

### Dev server 卡死 / RAM 爆
1. `rm -rf .next`
2. 關掉用不到的 VSCode extension（Pylance、YAML LS 等）
3. `NODE_OPTIONS="--max-old-space-size=2048" npm run dev`

---

## Dashboards

| 工具 | 用途 | URL |
|---|---|---|
| GitHub | source | https://github.com/Boris-lai/weekend-picker-tw |
| Vercel | 部署 / logs / env vars | https://vercel.com/dashboard |
| Anthropic | API key / 花費 / 月上限 | https://console.anthropic.com |
| Upstash | Redis / 用量 / data browser | https://console.upstash.com |

---

## File map

```
app/
  page.tsx               首頁（表單入口、編輯按 pull-quote）
  result/page.tsx        結果頁（時間軸 + 撕貼備案 + 分享文案）
  layout.tsx             font 載入 + metadata + OG
  globals.css            design tokens + utilities (.stamp / .marker-underline / .taped-note / 動畫 keyframes)
  api/
    generate/route.ts    POST: TripRequest → Claude → TripPlan（含 rate limit）
    share-card/route.tsx POST: TripPlan → 1080x1920 PNG
    og/route.tsx         GET: 1200x630 OG PNG (24h cache)
  sitemap.ts robots.ts   SEO
  icon.svg               favicon

lib/
  ai/                    Anthropic client + prompt + tool schema + generator
  share-card/            satori 版型 + render（共用於 share + OG）
  validators/            Zod schemas（trip-request 輸入、trip-plan AI 輸出）
  constants/             cities / preferences / transport / budget
  ratelimit.ts           Upstash sliding-window（fail-open）

components/
  form/trip-form.tsx     主表單（RHF + Zod + Framer stagger）
  share-card/            下載分享卡按鈕
  ui/                    ShadCN primitives（不要直接改、用 className override）

data/
  examples.ts            一份淡水範例（result 頁 fallback、開發用）
```

---

## Env vars

| Name | Required? | 用途 |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ Production | Claude API |
| `NEXT_PUBLIC_SITE_URL` | ✅ Production | OG image / sitemap / robots 的絕對網址 |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | optional | Vercel Marketplace Upstash 自動注入；沒有就 fail-open |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | optional | 直接接 Upstash 用這組 |

---

## 已知限制 / 未來

- Haiku 對台灣地理 grounding 弱，所以走 Sonnet（成本可接受）
- AI 偶爾會給通用名稱（「OO 老店」），prompt 已壓但不是 100%
- 結果頁用 sessionStorage（不存 server，刷新會回到 fallback 範例）
- 沒有登入 / 沒有歷史紀錄 / 沒有地圖視覺化（MVP 刻意省略）
- v2 可考慮：分享連結 `/share/[id]` 持久化、地圖（要錢）、會員、收藏
