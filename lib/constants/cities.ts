export const CITIES = [
  { value: 'taipei', label: '台北' },
  { value: 'taoyuan', label: '桃園' },
  { value: 'hsinchu', label: '新竹' },
  { value: 'taichung', label: '台中' },
  { value: 'kaohsiung', label: '高雄' },
] as const;

export type CityValue = (typeof CITIES)[number]['value'];
