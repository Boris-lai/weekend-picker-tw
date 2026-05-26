import { getAnthropic } from './client';
import { tripPlanTool, TRIP_PLAN_TOOL_NAME } from './schema';
import { SYSTEM_PROMPT, buildPrompt } from './prompt';
import { TripPlanSchema, type TripPlan } from '@/lib/validators/trip-plan';
import type { TripRequest } from '@/lib/validators/trip-request';

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 2048;

function mapSearchUrl(placeName: string, city: string): string {
  const query = encodeURIComponent(`${placeName} ${city}`.trim());
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export async function generateTrip(request: TripRequest): Promise<TripPlan> {
  const client = getAnthropic();

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: SYSTEM_PROMPT,
    tools: [tripPlanTool],
    tool_choice: { type: 'tool', name: TRIP_PLAN_TOOL_NAME },
    messages: [{ role: 'user', content: buildPrompt(request) }],
  });

  const toolUse = response.content.find((c) => c.type === 'tool_use');
  if (!toolUse || toolUse.type !== 'tool_use') {
    throw new Error('AI 沒有回傳 tool_use，可能輸出被截斷');
  }

  const rawInput = toolUse.input as Record<string, unknown>;
  const rawStops = (rawInput.stops ?? []) as Array<Record<string, unknown>>;

  const enriched = {
    ...rawInput,
    stops: rawStops.map((stop) => ({
      ...stop,
      mapSearchUrl: mapSearchUrl(
        String(stop.placeName ?? ''),
        String(stop.city ?? ''),
      ),
    })),
  };

  return TripPlanSchema.parse(enriched);
}
