export const TRANSPORTS = [
  { value: 'public_transit', label: '大眾運輸' },
  { value: 'car', label: '開車' },
  { value: 'scooter', label: '機車' },
  { value: 'less_walking', label: '少走路' },
] as const;

export const DURATIONS = [
  { value: 'half_day', label: '半日（約 4 小時）' },
  { value: 'full_day', label: '一日（約 8 小時）' },
  { value: 'two_days', label: '兩天一夜' },
] as const;

export const BUDGETS = [
  { value: '500', label: '500 元以內' },
  { value: '1000', label: '1,000 元以內' },
  { value: '1500', label: '1,500 元以內' },
  { value: '2500_plus', label: '2,500 元以上' },
] as const;

export type TransportValue = (typeof TRANSPORTS)[number]['value'];
export type DurationValue = (typeof DURATIONS)[number]['value'];
export type BudgetValue = (typeof BUDGETS)[number]['value'];
