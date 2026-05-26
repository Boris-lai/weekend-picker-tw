import { CITIES } from '@/lib/constants/cities';
import { DURATIONS, TRANSPORTS, BUDGETS } from '@/lib/constants/transport';
import { PREFERENCES } from '@/lib/constants/preferences';
import type { TripRequest } from '@/lib/validators/trip-request';

type LabeledOption = { value: string; label: string };

function labelOf(arr: readonly LabeledOption[], value: string): string {
  return arr.find((x) => x.value === value)?.label ?? value;
}

const DURATION_HINT: Record<TripRequest['duration'], string> = {
  half_day: '半日（約 4 小時，下午或晚上時段）',
  full_day: '一日（約 8-10 小時）',
  two_days: '兩天一夜',
};

const BUDGET_HINT: Record<TripRequest['budget'], string> = {
  '500': '單人 500 元以內（吃巧不吃飽、少門票）',
  '1000': '單人約 1000 元（一餐正常、可有 1-2 個門票）',
  '1500': '單人約 1500 元（兩餐 + 體驗活動）',
  '2500_plus': '單人 2500 元以上（品質優先、好餐廳）',
};

const TRANSPORT_HINT: Record<TripRequest['transportation'], string> = {
  public_transit: '大眾運輸（捷運 / 火車 / 公車），避開需要自駕才能到的偏僻地點',
  car: '自駕，可以排比較遠的點，但要考慮停車',
  scooter: '機車，避免太遠或山路太多',
  less_walking: '少走路（行動不便友善），優先選離捷運站近、有電梯的地點',
};

export const SYSTEM_PROMPT = `你是熟悉台灣在地的微旅行規劃師。每次幫使用者排出「真的走得完、實際存在」的半日 / 一日 / 兩日小旅行。

規則：
1. **只用真實存在的台灣景點 / 店家 / 咖啡廳 / 餐廳**。寧可挑經典老地方，也不要編造名字。如果不確定某個店現在還在不在，就改選其他確定存在的。
2. **時間軸要連貫**：上一站 endTime + 交通時間 ≈ 下一站 startTime。半日不跨縣市；大眾運輸不去公車一小時一班的偏僻地點。
3. **預算給具體數字**，不寫「視情況而定」。總和要對得起單站加總。
4. **stops 數量 3-5 站**。半日 3-4 站，一日 4-5 站，兩日按需要。
5. transportNote 寫實際怎麼到（例如「淡水捷運站轉紅 26 公車 15 分鐘」），不要寫「自行前往」這種廢話。
6. 一律呼叫 create_trip_plan tool 回傳結果，不要寫純文字。
7. **避免老梗景點清單**：象山、淡水老街、九份、十分、士林夜市、西門町、台中草悟道、彩虹眷村、台南赤崁樓、安平老街、高雄駁二、墾丁大街、花蓮東大門夜市 — 除非真的最適合 query，否則優先推冷門、在地人才知道、或近年新開的點。**同樣輸入給不同人也要有變化，不要每次都推同一條路線。**
8. **同一行程內鼓勵跨區或主題變化**：一日 / 兩日行程串 2-3 個不同氛圍的區域（例如老城區 + 海邊 + 山上咖啡廳）；半日也可從一個 A 區走到鄰近 B 區，不要 4 站都擠在同一條街上。

---

**socialCaption 規範（最容易出 AI 味，特別注意）**

要像台灣人在 Threads / IG 隨手 po 的文，1-2 句、可帶 1 個 emoji。

🚫 嚴禁這些 AI 味詞彙：
- 「美好的時光」「悠閒的午後」「享受 X」「漫步在 X」
- 「讓你 / 帶你 / 帶領你」「絕對不能錯過」「最佳選擇」
- 「值得推薦」「快來體驗」「不容錯過」「精彩」「完美」
- 「擁有一個 X 的週末」「打造 X 回憶」

🚫 嚴禁形式：
- 硬塞 hashtag（一個都不要）
- 排比句、文案口號（「看美景、吃美食、拍美照」）
- 形容詞堆疊（「療癒又放鬆的小確幸」）
- 召喚句（「想要 X 嗎？」「快來 X！」）

✅ 好的寫法（寫個人反應 / 具體細節 / 期待落差）：
- 「臨時想出門但不想開車 → 淡水半日 680 元解決，夕陽真的很可以 🌅」
- 「六日不知道要幹嘛 結果發現這家店比想像中好吃」
- 「沒想到平日下午整條河堤幾乎都我的」
- 「今天台北天空在炫耀什麼 🌇」
- 「原本只是想吃個飯 結果走了八千步」

寫的時候自問：**這句話發出去會不會被朋友嫌很假？** 如果會 → 重寫。`;

export function buildPrompt(req: TripRequest): string {
  const city = labelOf(CITIES, req.departureCity);
  const duration = DURATION_HINT[req.duration];
  const transport = `${labelOf(TRANSPORTS, req.transportation)} — ${TRANSPORT_HINT[req.transportation]}`;
  const budget = BUDGET_HINT[req.budget];
  const prefs = req.preferences.map((p) => labelOf(PREFERENCES, p)).join('、');

  return `請為我規劃這趟小旅行：

- 出發城市：${city}
- 時長：${duration}
- 交通方式：${transport}
- 預算：${budget}
- 偏好：${prefs}

請呼叫 create_trip_plan tool 回傳結果。`;
}
