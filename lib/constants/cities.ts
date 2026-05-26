export const CITIES = [
  { value: 'keelung', label: '基隆' },
  { value: 'taipei', label: '台北' },
  { value: 'newtaipei', label: '新北' },
  { value: 'taoyuan', label: '桃園' },
  { value: 'hsinchu', label: '新竹' },
  { value: 'yilan', label: '宜蘭' },
  { value: 'miaoli', label: '苗栗' },
  { value: 'taichung', label: '台中' },
  { value: 'changhua', label: '彰化' },
  { value: 'nantou', label: '南投' },
  { value: 'yunlin', label: '雲林' },
  { value: 'chiayi', label: '嘉義' },
  { value: 'tainan', label: '台南' },
  { value: 'kaohsiung', label: '高雄' },
  { value: 'pingtung', label: '屏東' },
  { value: 'hualien', label: '花蓮' },
  { value: 'taitung', label: '台東' },
] as const;

export type CityValue = (typeof CITIES)[number]['value'];

export const CITY_VALUES = CITIES.map((c) => c.value) as unknown as readonly [
  CityValue,
  ...CityValue[],
];
