export const PREFERENCES = [
  { value: 'photo', label: '拍照打卡' },
  { value: 'food', label: '美食' },
  { value: 'relax', label: '放鬆' },
  { value: 'family', label: '親子' },
  { value: 'rainy', label: '雨天備案' },
  { value: 'date', label: '約會' },
  { value: 'culture', label: '文化人文' },
] as const;

export type PreferenceValue = (typeof PREFERENCES)[number]['value'];
