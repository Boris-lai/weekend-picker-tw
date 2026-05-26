import satori from 'satori';
import sharp from 'sharp';
import type { ReactNode } from 'react';

import { CARD_HEIGHT, CARD_WIDTH } from './template';

const GOOGLE_FONTS_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';

const fontCache = new Map<string, Promise<ArrayBuffer>>();

async function loadNotoSansTC(weight: 400 | 700, text: string): Promise<ArrayBuffer> {
  const key = `${weight}::${text}`;
  const cached = fontCache.get(key);
  if (cached) return cached;

  const promise = (async () => {
    const params = new URLSearchParams({
      family: `Noto Sans TC:wght@${weight}`,
      text,
    });
    const cssUrl = `https://fonts.googleapis.com/css2?${params.toString()}`;
    const css = await fetch(cssUrl, {
      headers: { 'User-Agent': GOOGLE_FONTS_USER_AGENT },
    }).then((r) => r.text());

    const match = css.match(/src:\s*url\((https:[^)]+)\)\s*format/);
    if (!match) {
      throw new Error('找不到 Google Fonts 字型 URL，可能 Google API 變了');
    }
    const fontRes = await fetch(match[1]);
    return fontRes.arrayBuffer();
  })();

  fontCache.set(key, promise);
  return promise;
}

export async function renderShareCard(
  jsx: ReactNode,
  text: string,
  options: { width?: number; height?: number } = {},
): Promise<Buffer> {
  const width = options.width ?? CARD_WIDTH;
  const height = options.height ?? CARD_HEIGHT;

  const [regular, bold] = await Promise.all([
    loadNotoSansTC(400, text),
    loadNotoSansTC(700, text),
  ]);

  const svg = await satori(jsx, {
    width,
    height,
    fonts: [
      { name: 'Noto Sans TC', data: regular, weight: 400, style: 'normal' },
      { name: 'Noto Sans TC', data: bold, weight: 700, style: 'normal' },
    ],
  });

  return sharp(Buffer.from(svg)).png().toBuffer();
}
