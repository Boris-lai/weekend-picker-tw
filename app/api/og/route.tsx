import { renderShareCard } from '@/lib/share-card/render';
import {
  OG_HEIGHT,
  OG_TEXT,
  OG_WIDTH,
  OgCard,
} from '@/lib/share-card/og-template';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const png = await renderShareCard(<OgCard />, OG_TEXT, {
      width: OG_WIDTH,
      height: OG_HEIGHT,
    });
    return new Response(new Uint8Array(png), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, immutable',
      },
    });
  } catch (err) {
    console.error('OG image render failed', err);
    return new Response('OG image render failed', { status: 500 });
  }
}
