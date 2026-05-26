'use client';

import { motion } from 'framer-motion';

import { TripForm } from '@/components/form/trip-form';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Home() {
  return (
    <main className="grain relative mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 pt-10 pb-20 sm:px-8 sm:pt-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="mb-6 flex items-center justify-between sm:mb-10"
      >
        <span className="running-head">週末去哪裡 / weekend picker</span>
        <span className="font-mono text-[0.78rem] tracking-wide text-muted-foreground">
          試刊號 / 試試看
        </span>
      </motion.div>

      <header className="relative mb-16 space-y-7 sm:mb-24">
        <motion.div
          initial={{ opacity: 0, rotate: 0, scale: 0.9 }}
          animate={{ opacity: 1, rotate: -7, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.9, ease: EASE }}
          className="absolute -top-2 right-0 hidden sm:block"
        >
          <span className="stamp">
            <span aria-hidden>✦</span> issue 001
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex items-center gap-3"
        >
          <span className="animate-amber-pulse inline-block h-2 w-2 rounded-full bg-amber" />
          <span className="label-eyebrow">AI 微旅行指南・台灣</span>
        </motion.div>

        <h1 className="display-serif text-[3rem] leading-[1.02] font-black sm:text-[4.75rem]">
          <motion.span
            initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="inline-block"
          >
            週末
          </motion.span>
          <br />
          <span className="relative inline-block">
            <motion.span
              initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
              className="relative z-10 inline-block pr-2"
            >
              去哪裡
            </motion.span>
            <svg
              aria-hidden
              viewBox="0 0 200 24"
              preserveAspectRatio="none"
              className="absolute inset-x-0 -bottom-2 z-0 h-[0.5em] w-full"
            >
              <motion.path
                d="M2 14 Q40 6 80 12 T160 14 T198 10"
                stroke="var(--amber)"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
                opacity={0.85}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, delay: 0.95, ease: EASE }}
              />
            </svg>
          </span>
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: 1.6,
              ease: EASE,
            }}
            className="inline-block text-amber"
          >
            .
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.7, ease: EASE }}
          className="max-w-lg text-[1.05rem] leading-relaxed text-muted-foreground sm:text-[1.18rem]"
        >
          給我一個方向，AI 幫你排一份
          <span className="text-foreground"> 真的走得完 </span>
          的台灣半日 / 一日小旅行 ——
          <span className="block sm:inline">
            不用查地圖、不用比 CP 值、不用看部落客置入。
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.85, ease: EASE }}
          className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2"
        >
          <span className="font-mono text-[0.82rem] tracking-wide text-cream/80">
            <span className="text-amber">5</span> 秒填表
          </span>
          <span className="hairline h-px w-6" />
          <span className="font-mono text-[0.82rem] tracking-wide text-cream/80">
            <span className="text-amber">10</span> 秒產生
          </span>
          <span className="hairline h-px w-6" />
          <span className="font-mono text-[0.82rem] tracking-wide text-cream/80">
            <span className="text-amber">1</span> 鍵分享 IG 限動
          </span>
        </motion.div>
      </header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.1, ease: EASE }}
        className="relative mb-12 sm:mb-16"
      >
        <div className="absolute inset-x-0 top-1/2 hairline h-px" />
        <div className="relative flex justify-center">
          <span className="bg-background px-4 font-mono text-[0.78rem] uppercase tracking-[0.24em] text-amber">
            ✦ 告訴我你想怎麼玩 ✦
          </span>
        </div>
      </motion.div>

      <TripForm />

      <motion.aside
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mt-24 sm:mt-32"
      >
        <div className="mb-4 flex items-center gap-3">
          <span className="hairline h-px w-8" />
          <span className="label-eyebrow">編輯按 / editor&apos;s note</span>
        </div>
        <p className="pull-quote">
          「不是要做完整旅行 App，<br className="hidden sm:block" />
          是要讓你
          <span className="text-amber">三秒</span>
          決定週末。」
        </p>
        <p className="mt-3 font-mono text-[0.82rem] tracking-wide text-muted-foreground">
          — 從一個不想再花一小時排行程的人開始
        </p>
      </motion.aside>

      <footer className="mt-20 flex flex-col gap-2 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono text-[0.78rem] uppercase tracking-[0.18em] text-muted-foreground">
          weekend-picker.app
        </span>
        <span className="font-mono text-[0.78rem] uppercase tracking-[0.18em] text-muted-foreground">
          made by hand <span className="text-amber">·</span> 在台灣這座島上{' '}
          <span className="text-amber">·</span> {new Date().getFullYear()}
        </span>
      </footer>
    </main>
  );
}
