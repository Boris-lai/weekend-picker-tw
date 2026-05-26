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
        <p className="font-mono text-sm uppercase tracking-[0.22em] text-muted-foreground">
          排行程中・先去倒杯水…
        </p>
      </main>
    );
  }

  return (
    <main className="grain relative mx-auto w-full max-w-2xl px-5 pt-8 pb-24 sm:px-8 sm:pt-12">
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="group/back inline-flex items-center gap-2 font-mono text-[0.82rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-amber"
        >
          <ArrowLeft className="size-4 transition-transform group-hover/back:-translate-x-0.5" />
          重新規劃
        </button>
        <span className="running-head">行程・itinerary</span>
      </div>

      <div className="relative mt-6 sm:mt-8">
        <div className="absolute -top-1 right-0 hidden rotate-[6deg] sm:block">
          <span className="stamp">
            <span aria-hidden>★</span> draft
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber shadow-[0_0_18px_var(--amber)]" />
          <span className="font-mono text-[0.82rem] uppercase tracking-[0.22em] text-muted-foreground">
            AI 行程・No. 001
          </span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="display-serif mt-5 text-[2.5rem] font-black leading-[1.06] sm:text-[3.5rem]"
        >
          {plan.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="drop-cap mt-6 max-w-xl text-[1.08rem] leading-[1.7] text-foreground/80 sm:text-[1.18rem]"
        >
          {plan.summary}
        </motion.p>

        <div className="mt-7 flex flex-wrap gap-2">
          {plan.targetAudience.map((tag, idx) => {
            const rotate = ['rotate-[-1.5deg]', 'rotate-[1deg]', 'rotate-[-0.5deg]', 'rotate-[1.5deg]'][idx % 4];
            return (
              <span
                key={tag}
                className={cn(
                  'inline-flex items-center gap-1 border-2 border-dashed border-amber/50 bg-amber-soft px-3 py-1 text-[0.92rem] text-cream',
                  rotate,
                )}
                style={{ borderRadius: 4 }}
              >
                <span className="font-mono text-amber">#</span>
                {tag}
              </span>
            );
          })}
        </div>
      </div>

      <div className="my-14 grid grid-cols-12 gap-4 sm:my-20">
        <div className="col-span-12 sm:col-span-4">
          <div className="running-head mb-2">預估總花費</div>
          <div className="font-mono text-[0.82rem] tracking-wide text-muted-foreground">
            單人 / per person
          </div>
        </div>
        <div className="col-span-12 sm:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-baseline gap-3 border-b-2 border-amber pb-3"
          >
            <span className="font-mono text-[1rem] text-muted-foreground">NT$</span>
            <span className="font-mono text-[3.5rem] font-bold leading-none tracking-tight text-foreground sm:text-[4.5rem]">
              {plan.estimatedCost.toLocaleString()}
            </span>
            <span
              aria-hidden
              className="absolute -right-2 -top-2 h-12 w-12 rounded-full opacity-50 blur-2xl"
              style={{ background: 'var(--amber)' }}
            />
          </motion.div>
        </div>
      </div>

      <div className="mb-8 flex items-baseline justify-between gap-3 sm:mb-10">
        <h2 className="display-serif text-[1.5rem] font-bold sm:text-[1.85rem]">
          一站站照著走
        </h2>
        <span className="running-head">{plan.stops.length} stops</span>
      </div>

      <section className="relative">
        <div
          aria-hidden
          className="absolute left-[5.5rem] top-3 bottom-3 w-px bg-border sm:left-[6.5rem]"
        />
        <div className="space-y-10 sm:space-y-14">
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
              className="relative grid grid-cols-[5.5rem_1fr] gap-x-5 sm:grid-cols-[6.5rem_1fr] sm:gap-x-7"
            >
              <div className="flex flex-col gap-1 pt-1">
                <span className="font-mono text-[1.1rem] font-bold text-amber sm:text-[1.2rem]">
                  {stop.startTime}
                </span>
                <span className="font-mono text-[0.82rem] tracking-wide text-muted-foreground">
                  → {stop.endTime}
                </span>
                <span className="mt-1 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-muted-foreground/70">
                  · {String(i + 1).padStart(2, '0')} ·
                </span>
              </div>

              <div className="relative space-y-3 pl-6 sm:pl-8">
                <span
                  aria-hidden
                  className="absolute -left-[6px] top-2.5 size-3 rotate-45 bg-amber ring-4 ring-background"
                />
                <a
                  href={stop.mapSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/place display-serif inline-flex items-baseline gap-2 text-[1.55rem] font-bold leading-snug text-foreground transition-colors hover:text-amber sm:text-[1.85rem]"
                >
                  {stop.placeName}
                  <ArrowUpRight className="size-4 shrink-0 opacity-50 transition-transform group-hover/place:-translate-y-0.5 group-hover/place:translate-x-0.5 group-hover/place:opacity-100" />
                </a>
                <div className="flex items-center gap-2 font-mono text-[0.82rem] uppercase tracking-[0.18em] text-amber/80">
                  <span aria-hidden>◉</span>
                  {stop.city}
                </div>
                <p className="pt-1 text-[1.02rem] leading-relaxed text-foreground/85">
                  {stop.description}
                </p>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-border/50 pt-3 font-mono text-[0.82rem]">
                  <span className="inline-flex items-baseline gap-1.5 text-muted-foreground">
                    <span className="text-amber">↳</span>
                    {stop.transportNote}
                  </span>
                  <span className="ml-auto font-bold text-foreground/80">
                    NT$ {stop.estimatedCost.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <div className="mt-20 grid grid-cols-1 gap-8 sm:mt-24 sm:grid-cols-[1fr_1fr] sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="taped-note px-6 py-7 sm:px-7"
        >
          <div className="mb-3 flex items-center gap-2 font-mono text-[0.82rem] uppercase tracking-[0.2em] text-amber">
            <Cloud className="size-4" />
            下雨備案
          </div>
          <p className="text-[1.02rem] leading-relaxed text-cream/90">
            {plan.rainyDayBackup}
          </p>
          <div className="mt-4 font-mono text-[0.78rem] tracking-wide text-cream/50">
            ※ 萬一天氣不給面子用
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-[0.82rem] uppercase tracking-[0.2em] text-amber">
              <span>✦</span>
              分享文案
            </div>
            <button
              type="button"
              onClick={copyCaption}
              className={cn(
                'group/copy inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 font-mono text-[0.78rem] uppercase tracking-[0.18em] transition-colors',
                copied
                  ? 'border-amber bg-amber text-paper'
                  : 'border-border text-muted-foreground hover:border-amber hover:text-amber',
              )}
            >
              <Copy className="size-3" />
              {copied ? '已複製' : 'copy'}
            </button>
          </div>
          <div className="relative pl-7">
            <span
              aria-hidden
              className="display-serif absolute -left-1 -top-3 text-[5rem] leading-none text-amber/30"
            >
              &ldquo;
            </span>
            <p className="display-serif whitespace-pre-wrap text-[1.15rem] leading-[1.55] text-foreground/90 sm:text-[1.28rem]">
              {plan.socialCaption}
            </p>
          </div>
          <div className="mt-4 pl-7 font-mono text-[0.78rem] tracking-wide text-muted-foreground">
            ※ 直接複製貼 Threads / IG
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
        className="mt-20 space-y-3 sm:mt-24"
      >
        <DownloadShareCardButton plan={plan} />
        <Button
          variant="outline"
          onClick={() => router.push('/')}
          className="h-14 w-full rounded-full border-2 border-border bg-transparent text-[1.02rem] font-medium text-foreground hover:border-foreground/60 hover:bg-secondary/40 sm:h-[60px] sm:text-[1.08rem]"
        >
          <RotateCw className="size-4" /> 不滿意・換一份
        </Button>
      </motion.div>

      <footer className="mt-16 flex flex-col gap-2 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono text-[0.78rem] uppercase tracking-[0.18em] text-muted-foreground">
          weekend-picker.app
        </span>
        <span className="font-mono text-[0.78rem] uppercase tracking-[0.18em] text-muted-foreground">
          地點請自行 google 二次確認
        </span>
      </footer>
    </main>
  );
}
