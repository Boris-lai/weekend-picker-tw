import { z } from 'zod';

export const TripRequestSchema = z.object({
  departureCity: z.enum(['taipei', 'taoyuan', 'hsinchu', 'taichung', 'kaohsiung'], {
    message: '請選擇出發城市',
  }),
  duration: z.enum(['half_day', 'full_day', 'two_days'], {
    message: '請選擇時長',
  }),
  transportation: z.enum(['public_transit', 'car', 'scooter', 'less_walking'], {
    message: '請選擇交通方式',
  }),
  budget: z.enum(['500', '1000', '1500', '2500_plus'], {
    message: '請選擇預算',
  }),
  preferences: z
    .array(z.enum(['photo', 'food', 'relax', 'family', 'rainy', 'date', 'culture']))
    .min(1, { message: '至少選擇一個偏好' })
    .max(4, { message: '最多選擇四個偏好' }),
});

export type TripRequest = z.infer<typeof TripRequestSchema>;
