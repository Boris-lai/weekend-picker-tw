import { z } from 'zod';

export const TripStopSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  placeName: z.string(),
  city: z.string(),
  description: z.string(),
  transportNote: z.string(),
  estimatedCost: z.number().int(),
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
