'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Cloud,
  MapPin,
  RotateCw,
  Wallet,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DownloadShareCardButton } from '@/components/share-card/download-button';
import { TAMSUI_HALF_DAY } from '@/data/examples';
import { TripPlanSchema, type TripPlan } from '@/lib/validators/trip-plan';

const STORAGE_KEY = 'weekend-picker:trip-plan';

export default function ResultPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setPlan(TAMSUI_HALF_DAY);
      return;
    }
    const parsed = TripPlanSchema.safeParse(JSON.parse(raw));
    setPlan(parsed.success ? parsed.data : TAMSUI_HALF_DAY);
  }, []);

  async function copyCaption() {
    if (!plan) return;
    await navigator.clipboard.writeText(plan.socialCaption);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (!plan) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-5">
        <p className="text-sm text-muted-foreground">載入中…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-xl px-5 py-8 sm:py-12">
      <button
        type="button"
        onClick={() => router.push('/')}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> 重新規劃
      </button>

      <header className="mb-6 space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {plan.title}
        </h1>
        <p className="text-base text-muted-foreground">{plan.summary}</p>
        <div className="flex flex-wrap gap-1.5">
          {plan.targetAudience.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      </header>

      <Card className="mb-6 flex flex-row items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Wallet className="size-4" /> 預估總花費
        </div>
        <div className="text-lg font-semibold">
          NT$ {plan.estimatedCost.toLocaleString()}
        </div>
      </Card>

      <section className="mb-6 space-y-3">
        {plan.stops.map((stop, i) => (
          <Card key={i} className="gap-3 px-5">
            <div className="flex items-baseline justify-between gap-3">
              <div className="font-mono text-sm text-muted-foreground">
                {stop.startTime}–{stop.endTime}
              </div>
              <div className="text-xs text-muted-foreground">{stop.city}</div>
            </div>
            <a
              href={stop.mapSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-lg font-semibold hover:underline"
            >
              <MapPin className="size-4 shrink-0" /> {stop.placeName}
            </a>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {stop.description}
            </p>
            <div className="flex items-center justify-between gap-3 border-t pt-3 text-xs">
              <span className="text-muted-foreground">{stop.transportNote}</span>
              <span className="shrink-0 font-medium">
                NT$ {stop.estimatedCost.toLocaleString()}
              </span>
            </div>
          </Card>
        ))}
      </section>

      <Card className="mb-6 gap-2 px-5">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Cloud className="size-4" /> 下雨備案
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {plan.rainyDayBackup}
        </p>
      </Card>

      <Card className="mb-6 gap-3 px-5">
        <div className="text-sm font-medium">分享文案</div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {plan.socialCaption}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={copyCaption}
          className="self-start"
        >
          {copied ? '已複製 ✓' : '複製文案'}
        </Button>
      </Card>

      <div className="space-y-3">
        <DownloadShareCardButton plan={plan} />
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push('/')}
        >
          <RotateCw className="size-4" /> 重新產生
        </Button>
      </div>
    </main>
  );
}
