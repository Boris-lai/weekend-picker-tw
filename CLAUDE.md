# CLAUDE.md

> 給 Claude Code 的專案規範。每次新對話開頭會被讀取。
> 完整產品企劃見 `product-plan.md`，本檔聚焦「怎麼寫 code」。

---

## 專案是什麼

**週末去哪裡 (Weekend Picker Taiwan)** — 給台灣使用者的 AI 微旅行行程產生器。

輸入出發地、時長、交通、預算、偏好 → AI 產生「真的走得完」的台灣半日 / 一日行程 → 產出 IG 限動風格分享卡。

**核心目標**：使用者願意立刻試玩、截圖、分享。**不是**做完整旅行平台。

---

## 技術棧 (鎖定，不要改)

| 類別 | 選擇 |
|---|---|
| 框架 | **Next.js 16 (App Router)** |
| 語言 | TypeScript (strict mode) |
| 樣式 | Tailwind CSS v4 |
| 元件庫 | ShadCN UI |
| 表單 | React Hook Form + Zod |
| LLM | **Anthropic Claude (claude-haiku-4-5 或 claude-sonnet-4-6)** — 不用 OpenAI |
| LLM SDK | `@anthropic-ai/sdk` (直接用，不需 Vercel AI SDK) |
| 分享卡圖片 | **satori + sharp** (server-side render，品質穩定) |
| 圖示 | Lucide React |
| 動畫 | Framer Motion (極簡使用) |
| 資料庫 | **MVP 階段不用**。範例行程用靜態 JSON |
| 部署 | Vercel |
| 分析 | Vercel Analytics + Google Analytics 4 |
| 錯誤監控 | Sentry (free tier) |

### 為什麼用 Claude 不用 OpenAI
- 繁中表達自然 (對台灣使用者體驗差很多)
- 結構化 JSON 輸出穩定 (用 tool use 強制 schema)
- 你 (Boris) 熟悉 Claude，不用重新學
- Haiku 比 GPT-4o-mini 便宜且品質夠

### 為什麼 MVP 不用資料庫
- 你的 plan 寫「儲存範例行程與使用紀錄」— 這個 MVP 不需要
- 範例行程用 `data/examples.ts` 靜態檔
- 使用紀錄用 Vercel Analytics 就夠
- 等真的有流量再加 DB

### 為什麼用 satori 不用 html-to-image
- html-to-image 是 client-side，截圖品質常出問題 (字型缺失、佈局跑掉)
- satori 是 Vercel 自家工具,server-side render SVG，**1080x1920 IG 限動版型可以完美輸出**
- 順便支援動態 OG image (Threads 分享連結會顯示行程預覽圖)

---

## 專案結構

```
weekend-picker-tw/
├── app/
│   ├── page.tsx                      # 首頁 (表單)
│   ├── result/
│   │   └── page.tsx                  # 結果頁
│   ├── share/
│   │   └── [id]/
│   │       └── page.tsx              # 分享連結頁 (v1.1)
│   ├── api/
│   │   ├── generate/route.ts         # 產生行程 (POST)
│   │   └── og/route.tsx              # 動態 OG image
│   ├── layout.tsx
│   ├── globals.css
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/                           # ShadCN 元件
│   ├── form/
│   │   ├── city-select.tsx
│   │   ├── duration-select.tsx
│   │   ├── transport-select.tsx
│   │   ├── budget-select.tsx
│   │   ├── preference-tags.tsx
│   │   └── trip-form.tsx             # 組合元件
│   ├── result/
│   │   ├── trip-timeline.tsx
│   │   ├── trip-stop-card.tsx
│   │   ├── budget-summary.tsx
│   │   ├── rainy-backup.tsx
│   │   └── action-bar.tsx            # 重新產生 / 分享
│   ├── share-card/
│   │   ├── card-preview.tsx          # 螢幕上預覽
│   │   ├── card-svg.tsx              # satori 用的 JSX 版型
│   │   └── download-button.tsx
│   └── shared/
│       ├── nav-bar.tsx
│       ├── footer.tsx
│       └── loading-overlay.tsx
├── lib/
│   ├── ai/
│   │   ├── client.ts                 # Anthropic client
│   │   ├── prompt.ts                 # prompt 組裝
│   │   ├── schema.ts                 # tool use schema
│   │   └── generate-trip.ts          # 主要呼叫函數
│   ├── validators/
│   │   ├── trip-request.ts           # Zod schema (使用者輸入)
│   │   └── trip-plan.ts              # Zod schema (AI 輸出)
│   ├── share-card/
│   │   ├── render.ts                 # satori → png
│   │   └── template.tsx              # 卡片版型 (1080x1920)
│   ├── utils/
│   │   ├── google-maps.ts            # 產生 maps 搜尋 URL
│   │   ├── format-cost.ts
│   │   └── share.ts                  # 複製連結 / 開 Threads
│   └── constants/
│       ├── cities.ts
│       ├── preferences.ts
│       └── transport.ts
├── data/
│   └── examples.ts                   # 5-10 組範例行程 (靜態)
├── public/
│   ├── og-default.png
│   └── favicon.ico
├── CLAUDE.md
├── product-plan.md                   # 完整企劃 (原 plan)
├── README.md
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
└── package.json
```

---

## TypeScript 型別 (核心)

```typescript
// lib/validators/trip-request.ts
import { z } from 'zod';

export const TripRequestSchema = z.object({
  departureCity: z.enum(['taipei', 'taoyuan', 'hsinchu', 'taichung', 'kaohsiung']),
  duration: z.enum(['half_day', 'full_day', 'two_days']),
  transportation: z.enum(['public_transit', 'car', 'scooter', 'less_walking']),
  budget: z.enum(['500', '1000', '1500', '2500_plus']),
  preferences: z.array(z.enum([
    'photo', 'food', 'relax', 'family', 'rainy', 'date', 'culture'
  ])).min(1).max(4),
});

export type TripRequest = z.infer<typeof TripRequestSchema>;
```

```typescript
// lib/validators/trip-plan.ts
import { z } from 'zod';

export const TripStopSchema = z.object({
  startTime: z.string(),              // "09:30"
  endTime: z.string(),                // "10:30"
  placeName: z.string(),
  city: z.string(),
  description: z.string(),
  transportNote: z.string(),
  estimatedCost: z.number().int(),    // 元
  mapSearchUrl: z.string().url(),
});

export const TripPlanSchema = z.object({
  title: z.string(),
  summary: z.string(),
  estimatedCost: z.number().int(),
  targetAudience: z.array(z.string()),
  stops: z.array(TripStopSchema).min(3).max(5),
  rainyDayBackup: z.string(),
  socialCaption: z.string(),
});

export type TripPlan = z.infer<typeof TripPlanSchema>;
export type TripStop = z.infer<typeof TripStopSchema>;
```

**重要**：所有金額用整數 (元為單位)，不要用浮點數。

---

## AI 整合規範

### 用 Tool Use 強制結構化輸出
不要靠 prompt 叫 AI「請回傳 JSON」— 不穩定。用 Anthropic tool use 機制：

```typescript
// lib/ai/schema.ts
export const tripPlanTool = {
  name: 'create_trip_plan',
  description: '產生一份台灣微旅行行程',
  input_schema: {
    type: 'object',
    properties: {
      title: { type: 'string', description: '行程標題，例如「淡水半日甜點散策」' },
      summary: { type: 'string', description: '一句話摘要' },
      estimatedCost: { type: 'integer', description: '總預估花費 (元)' },
      targetAudience: {
        type: 'array',
        items: { type: 'string' },
        description: '適合對象標籤，例如「情侶」「文青」'
      },
      stops: {
        type: 'array',
        minItems: 3,
        maxItems: 5,
        items: {
          type: 'object',
          properties: {
            startTime: { type: 'string' },
            endTime: { type: 'string' },
            placeName: { type: 'string' },
            city: { type: 'string' },
            description: { type: 'string' },
            transportNote: { type: 'string' },
            estimatedCost: { type: 'integer' },
            mapSearchUrl: { type: 'string' },
          },
          required: ['startTime', 'endTime', 'placeName', 'city',
                     'description', 'transportNote', 'estimatedCost', 'mapSearchUrl']
        }
      },
      rainyDayBackup: { type: 'string' },
      socialCaption: { type: 'string', description: 'IG / Threads 可直接複製的貼文文案' },
    },
    required: ['title', 'summary', 'estimatedCost', 'targetAudience',
               'stops', 'rainyDayBackup', 'socialCaption']
  }
};
```

```typescript
// lib/ai/generate-trip.ts
import Anthropic from '@anthropic-ai/sdk';
import { tripPlanTool } from './schema';
import { buildPrompt } from './prompt';
import { TripPlanSchema, type TripRequest, type TripPlan } from '@/lib/validators/trip-plan';

const client = new Anthropic();

export async function generateTrip(request: TripRequest): Promise<TripPlan> {
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    tools: [tripPlanTool],
    tool_choice: { type: 'tool', name: 'create_trip_plan' },
    messages: [{ role: 'user', content: buildPrompt(request) }],
  });

  const toolUse = response.content.find(c => c.type === 'tool_use');
  if (!toolUse || toolUse.type !== 'tool_use') {
    throw new Error('AI 沒有回傳 tool_use');
  }

  // 用 Zod 再驗一次 (防 AI schema 漂移)
  return TripPlanSchema.parse(toolUse.input);
}
```

### Prompt 設計原則 (Claude 必須遵守)
1. **不亂編地點** — 用真實存在的台灣景點 / 店家
2. **交通時間要合理** — 半日不跨縣市、大眾運輸不去偏僻地點
3. **時間軸要連貫** — 上一站結束時間 = 下一站開始時間 - 交通時間
4. **預算合理** — 不寫「視情況而定」，給具體數字
5. **`socialCaption` 要像真人寫的** — 不要 AI 味、不要硬要 hashtag

完整 prompt 模板放在 `lib/ai/prompt.ts`，包含 few-shot 範例。

### 模型選擇
- **預設**：`claude-haiku-4-5-20251001` (快、便宜、品質夠)
- **品質不夠時**：升 `claude-sonnet-4-6`
- **絕對不要**：用 opus (太貴，不值得)

---

## 編碼規範

### TypeScript
- 永遠 strict mode
- **禁止 `any`** — 用 `unknown` + narrow
- 金額用整數
- Component props 用 `interface`，data shape 用 `type`

### React / Next.js
- Component 用 named export (除了 page.tsx / layout.tsx)
- 檔名 **kebab-case** (`trip-form.tsx`)
- Component 名 **PascalCase** (`TripForm`)
- Hooks 用 `use-` 前綴
- API route 用 Route Handlers，不用 pages/api
- 預設用 Server Component，需要互動才加 `'use client'`

### 樣式
- 用 Tailwind utility classes
- 共用樣式抽到 ShadCN component
- 不要寫 CSS Module
- **手機優先** — 寫 mobile 版式，用 `sm:` `md:` 往上加

### 表單
- 永遠用 React Hook Form + Zod
- 錯誤訊息用繁體中文
- 提交按鈕在 loading 時 disable + 顯示 spinner

### 命名
- 函數動詞開頭：`generateTrip`、`renderShareCard`、`buildPrompt`
- 布林值用 `is/has/can` 前綴
- 常數用 `SCREAMING_SNAKE_CASE`

---

## 重要架構決策 (不要改)

1. **MVP 沒有資料庫** — 範例行程靜態 JSON、使用紀錄用 Vercel Analytics
2. **沒有登入** — 不蒐集 PII，分享門檻最低
3. **結果頁用 URL params 或 sessionStorage** — 不存伺服器
4. **AI 一律用 tool use 強制 schema** — 不要靠 prompt 叫 AI 回 JSON
5. **分享卡用 satori server-side render** — 不用 html-to-image

---

## 不要做的事

- ❌ 不要建議改用其他框架
- ❌ 不要 MVP 階段就加登入、會員、訂閱
- ❌ 不要用 OpenAI / Vercel AI SDK (直接用 `@anthropic-ai/sdk`)
- ❌ 不要用 html-to-image (用 satori)
- ❌ 不要過度抽象 — MVP 階段「看得懂 > 優雅」
- ❌ 不要一次寫超過 3 個檔案 — 一次寫一個、跑起來、commit
- ❌ 不要在 v1 就做地圖視覺化 (Google Maps API 要錢，留 v2)
- ❌ 不要編造不存在的台灣地點 (Prompt 嚴格要求)
- ❌ 不要讓 AI 自由發揮 JSON 格式 (用 tool use)

---

## 溝通規範

- 與我 (Boris) 對話用繁體中文
- Code comment 可英文 (慣例) 或繁中
- Git commit message 用英文，conventional commits 風格 (`feat:`, `fix:`, `chore:`)
- 不確定的設計決策 **先問我**，不要自作主張

---

## 環境變數

```bash
# .env.local

# Anthropic API
ANTHROPIC_API_KEY=

# Sentry
NEXT_PUBLIC_SENTRY_DSN=

# Google Analytics
NEXT_PUBLIC_GA_ID=

# 網域 (OG image / 分享連結)
NEXT_PUBLIC_SITE_URL=https://weekend-picker.vercel.app
```

---

## 當前里程碑

### Week 1 (本週)：UI 骨架 + 假資料跑通
- Day 1：初始化 + ShadCN + 首頁表單骨架
- Day 2：表單元件 (城市、時長、交通、預算、偏好)
- Day 3：結果頁佈局 + 時間軸元件 (用假資料)
- Day 4：分享卡 satori 版型
- Day 5：把假資料換成 hardcoded 範例行程
- 週末：部署 Vercel + 第一個可分享連結

### Week 2：AI 串接
- Anthropic API + tool use
- Prompt 設計 + 測試
- Loading / Error states
- Zod 驗證 fallback

### Week 3：打磨 + 範例行程
- 手機版完美化
- 5-10 組高品質範例行程 (hardcoded)
- 分享卡下載 + 文案複製

### Week 4：發布 + 行銷
- 動態 OG image
- Demo 影片 (錄表單 → 結果 → 分享)
- 第一波 Threads 內容 (5 則)
- 開始持續發文

---

## 給 Claude Code 的最後提醒

1. **每完成一個功能就 commit**，不要憋大招
2. **遇到模糊地方先問 Boris**，不要自己亂決定
3. **設計決策出現衝突時，以本檔為準**，不是 `product-plan.md` (那是產品企劃，本檔是技術規範)
4. **每個對話一開始**，先 `view CLAUDE.md` 再 `view product-plan.md` (如果還需要產品脈絡)
5. **Boris 是 YouTuber + 工程師**，懂技術但常常規劃太多 — 主動建議「先 ship 再改」勝於「先想清楚」
