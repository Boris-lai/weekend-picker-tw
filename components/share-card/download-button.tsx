'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { TripPlan } from '@/lib/validators/trip-plan';

interface DownloadShareCardButtonProps {
  plan: TripPlan;
}

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'trip-card'
  );
}

export function DownloadShareCardButton({ plan }: DownloadShareCardButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  async function handleDownload() {
    setStatus('loading');
    try {
      const res = await fetch('/api/share-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slugify(plan.title)}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setStatus('idle');
    } catch (err) {
      console.error('share-card download failed', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2500);
    }
  }

  return (
    <Button
      type="button"
      onClick={handleDownload}
      disabled={status === 'loading'}
      className={cn(
        'group/dl relative h-13 w-full overflow-hidden rounded-full border border-amber text-base font-medium',
        'bg-amber text-paper transition-all',
        'hover:shadow-[0_0_40px_var(--amber-soft)]',
        'sm:h-14 sm:text-[1.05rem]',
      )}
    >
      {status === 'loading' ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="size-4 animate-spin" /> 產生分享卡中…
        </span>
      ) : status === 'error' ? (
        <span>產生失敗・再試一次</span>
      ) : (
        <span className="inline-flex items-center gap-2">
          <Download className="size-4" />
          下載 IG 限動分享卡
        </span>
      )}
    </Button>
  );
}
