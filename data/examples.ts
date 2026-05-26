import type { TripPlan } from '@/lib/validators/trip-plan';

const mapUrl = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export const TAMSUI_HALF_DAY: TripPlan = {
  title: '淡水半日夕陽散策',
  summary: '搭捷運就到的河岸小旅行，咖啡、夕陽、老街一次收。',
  estimatedCost: 680,
  targetAudience: ['情侶', '文青', '不想開車的台北人'],
  stops: [
    {
      startTime: '14:00',
      endTime: '15:00',
      placeName: '榕堤水灣餐廳',
      city: '新北淡水',
      description: '靠著淡水河的木造平台，點杯飲料配河景，平日下午幾乎都有位子。',
      transportNote: '淡水捷運站走路約 10 分鐘，沿河岸往北。',
      estimatedCost: 200,
      mapSearchUrl: mapUrl('榕堤水灣餐廳 淡水'),
    },
    {
      startTime: '15:15',
      endTime: '16:30',
      placeName: '淡水老街・文化阿給',
      city: '新北淡水',
      description: '老街隨意逛，重點是真理街那家文化阿給，魚丸湯也別錯過。',
      transportNote: '走回淡水捷運站方向，沿中正路約 15 分鐘。',
      estimatedCost: 180,
      mapSearchUrl: mapUrl('文化阿給 淡水真理街'),
    },
    {
      startTime: '16:45',
      endTime: '18:00',
      placeName: '漁人碼頭情人橋',
      city: '新北淡水',
      description: '北台灣經典夕陽點，木棧道整段都是好拍角度。',
      transportNote: '淡水捷運站轉紅 26 公車約 15 分鐘到漁人碼頭。',
      estimatedCost: 30,
      mapSearchUrl: mapUrl('淡水漁人碼頭情人橋'),
    },
    {
      startTime: '18:15',
      endTime: '19:30',
      placeName: '漁人碼頭情人塔',
      city: '新北淡水',
      description: '看完夕陽搭旋轉觀景塔上去看夜景，淡水河、觀音山一覽無遺。',
      transportNote: '從情人橋走過去約 5 分鐘。',
      estimatedCost: 270,
      mapSearchUrl: mapUrl('淡水漁人碼頭情人塔'),
    },
  ],
  rainyDayBackup:
    '下雨改去淡水紅毛城逛完古蹟，再到附近的有河書店窩一個下午，配杯熱茶。',
  socialCaption:
    '臨時想出門但不想開車 → 淡水半日 680 元解決，夕陽真的很可以 🌅',
};
