import { TripRequestSchema } from '@/lib/validators/trip-request';
import { generateTrip } from '@/lib/ai/generate-trip';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: '無法解析 JSON body' }, { status: 400 });
  }

  const parsed = TripRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: '輸入格式錯誤', issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const plan = await generateTrip(parsed.data);
    return Response.json(plan);
  } catch (err) {
    console.error('generateTrip failed', err);
    const message = err instanceof Error ? err.message : '產生行程失敗';
    return Response.json({ error: message }, { status: 500 });
  }
}
