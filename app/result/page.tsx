'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  Cloud,
  Copy,
  RotateCw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DownloadShareCardButton } from '@/components/share-card/download-button';
import { TAMSUI_HALF_DAY } from '@/data/examples';
import { TripPlanSchema, type TripPlan } from '@/lib/validators/trip-plan';
import { cn } from '@/lib/utils';

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
    setTimeout(() => setCopied(false), 1600);
  }

  if (!plan) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-5">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
          載入中・loading…
        </p>
      </main>
    );
  }

  return (
    <main className="grain relative mx-auto w-full max-w-2xl px-5 pt-8 pb-24 sm:px-8 sm:pt-12">
      <button
        type="button"
        onClick={() => router.push('/')}
        className="group/back inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-amber"
      >
        <ArrowLeft className="size-3.5 transition-transform group-hover/back:-translate-x-0.5" />
        重新規劃
      </button>

      <div className="mt-8 flex items-center gap-3 sm:mt-10">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber shadow-[0_0_16px_var(--amber)]" />
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
          AI 行程・No. 001
        </span>
      </div>

      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mt-5 space-y-6"
      >
        <h1 className="display-serif text-[2.25rem] font-black leading-[1.08] sm:text-[3.25rem]">
          {plan.title}
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {plan.summary}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {plan.targetAudience.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-foreground/85"
            >
              <span className="mr-0.5 text-amber">#</span>
              {tag}
            </span>
          ))}
        </div>
      </motion.header>

      <div className="my-10 flex items-center gap-4 sm:my-14">
        <span className="hairline h-px flex-1" />
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
          預估總花費
        </span>
        <span className="hairline h-px flex-1" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl border border-border bg-card/80 px-6 py-7 backdrop-blur-sm sm:px-8 sm:py-8"
      >
        <div
          aria-hidden
          className="absolute -right-12 -top-12 h-40 w-40 rounded-full"
          style={{ background: 'radial-gradient(circle, var(--amber-soft), transparent 70%)' }}
        />
        <div className="relative flex items-baseline gap-4">
          <span className="font-mono text-sm text-muted-foreground">NT$</span>
          <span className="font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            {plan.estimatedCost.toLocaleString()}
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            單人 / per
          </span>
        </div>
      </motion.div>

      <div className="my-10 flex items-center gap-4 sm:my-14">
        <span className="hairline h-px flex-1" />
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
          行程時間軸 / itinerary
        </span>
        <span className="hairline h-px flex-1" />
      </div>

      <section className="relative">
        <div
          aria-hidden
          className="absolute left-[5.25rem] top-2 bottom-2 w-px bg-border sm:left-[6rem]"
        />
        <div className="space-y-9 sm:space-y-12">
          {plan.stops.map((stop, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.12 + i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative grid grid-cols-[5.25rem_1fr] gap-x-5 sm:grid-cols-[6rem_1fr] sm:gap-x-7"
            >
              <div className="flex flex-col gap-1 pt-0.5">
                <span className="font-mono text-[0.95rem] font-medium text-amber">
                  {stop.startTime}
                </span>
                <span className="font-mono text-[0.7rem] tracking-wide text-muted-foreground">
                  → {stop.endTime}
                </span>
              </div>

              <div className="relative -ml-px space-y-3 border-l-0 pl-5 sm:pl-7">
                <span
                  aria-hidden
                  className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-amber ring-4 ring-background sm:-left-[5px]"
                />
                <div className="flex items-baseline justify-between gap-3">
                  <a
                    href={stop.mapSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/place display-serif inline-flex items-baseline gap-2 text-[1.4rem] font-bold leading-snug text-foreground transition-colors hover:text-amber sm:text-[1.65rem]"
                  >
                    {stop.placeName}
                    <ArrowUpRight className="size-4 shrink-0 opacity-50 transition-transform group-hover/place:-translate-y-0.5 group-hover/place:translate-x-0.5 group-hover/place:opacity-100" />
                  </a>
                </div>
                <div className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">
                  {stop.city}
                </div>
                <p className="pt-1 text-[0.95rem] leading-relaxed text-foreground/80">
                  {stop.description}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/60 pt-3 font-mono text-[0.72rem] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="opacity-60">→</span>
                    {stop.transportNote}
                  </span>
                  <span className="ml-auto text-foreground/70">
                    NT$ {stop.estimatedCost.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <div className="my-10 flex items-center gap-4 sm:my-14">
        <span className="hairline h-px flex-1" />
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
          備案・bonus
        </span>
        <span className="hairline h-px flex-1" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-border bg-secondary/40 px-6 py-6 sm:px-8 sm:py-7"
      >
        <div className="mb-3 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
          <Cloud className="size-3.5 text-amber" />
          下雨備案
        </div>
        <p className="text-[0.95rem] leading-relaxed text-foreground/80">
          {plan.rainyDayBackup}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-6 rounded-2xl border border-border bg-card/60 px-6 py-6 sm:px-8 sm:py-7"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
            <span className="text-amber">✦</span>
            分享文案 / caption
          </div>
          <button
            type="button"
            onClick={copyCaption}
            className={cn(
              'group/copy inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.18em] transition-colors',
              copied
                ? 'border-amber bg-amber text-paper'
                : 'text-muted-foreground hover:border-amber hover:text-amber',
            )}
          >
            <Copy className="size-3" />
            {copied ? '已複製 ✓' : 'copy'}
          </button>
        </div>
        <p
          className="display-serif relative whitespace-pre-wrap pl-5 text-[1.05rem] leading-[1.55] text-foreground/90 sm:text-[1.15rem]"
        >
          <span
            aria-hidden
            className="absolute left-0 top-1 bottom-1 w-[3px] rounded bg-amber/70"
          />
          {plan.socialCaption}
        </p>
      </motion.div>

      <div className="my-12 sm:my-16" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-3"
      >
        <DownloadShareCardButton plan={plan} />
        <Button
          variant="outline"
          onClick={() => router.push('/')}
          className="h-12 w-full rounded-full border-border bg-transparent text-base font-medium text-foreground hover:border-foreground/60 hover:bg-secondary/40 sm:h-13"
        >
          <RotateCw className="size-4" /> 換一份行程
        </Button>
      </motion.div>

      <footer className="mt-16 flex items-center justify-between border-t border-border/60 pt-6 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
        <span>weekend-picker.app</span>
        <span>地點請自行 google 二次確認</span>
      </footer>
    </main>
  );
}
