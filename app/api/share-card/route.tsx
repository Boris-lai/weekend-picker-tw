import { TripPlanSchema } from '@/lib/validators/trip-plan';
import { renderShareCard } from '@/lib/share-card/render';
import { ShareCard, extractCardText } from '@/lib/share-card/template';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: '無法解析 JSON body' }, { status: 400 });
  }

  const parsed = TripPlanSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: 'TripPlan 格式錯誤', issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const plan = parsed.data;

  try {
    const png = await renderShareCard(
      <ShareCard plan={plan} />,
      extractCardText(plan),
    );
    return new Response(new Uint8Array(png), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('renderShareCard failed', err);
    return Response.json({ error: '分享卡產生失敗' }, { status: 500 });
  }
}
