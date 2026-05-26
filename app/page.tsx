import { TripForm } from '@/components/form/trip-form';

export default function Home() {
  return (
    <main className="grain relative mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 pt-12 pb-20 sm:px-8 sm:pt-20">
      <header className="mb-14 space-y-7 sm:mb-20">
        <div className="flex items-center gap-3">
          <span className="inline-block h-2 w-2 rounded-full bg-amber shadow-[0_0_20px_var(--amber)]" />
          <span className="label-eyebrow">No. 001 · AI 微旅行指南</span>
        </div>

        <h1 className="display-serif text-[2.75rem] leading-[1.02] font-black sm:text-[4.25rem]">
          週末
          <br />
          <span className="relative inline-block">
            <span className="relative z-10">去哪裡</span>
            <span
              aria-hidden
              className="absolute inset-x-[-4px] bottom-[8px] h-[14px] -z-0 sm:bottom-[14px] sm:h-[22px]"
              style={{ background: 'var(--amber-soft)' }}
            />
          </span>
          <span className="text-amber">.</span>
        </h1>

        <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
          給我一個方向，AI 幫你排一份
          <span className="text-foreground">真的走得完</span>
          的台灣半日 / 一日小旅行 ——
          <span className="block sm:inline">不用查地圖、不用比 CP 值。</span>
        </p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">
          <span>5 秒填表</span>
          <span className="hairline h-px w-6" />
          <span>10 秒產生</span>
          <span className="hairline h-px w-6" />
          <span>1 鍵分享</span>
        </div>
      </header>

      <div
        aria-hidden
        className="mb-12 flex items-center gap-3 sm:mb-16"
      >
        <span className="hairline h-px flex-1" />
        <span className="label-eyebrow">告訴我你想怎麼玩</span>
        <span className="hairline h-px flex-1" />
      </div>

      <TripForm />

      <footer className="mt-20 flex items-center justify-between border-t border-border/60 pt-6 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
        <span>weekend-picker.app</span>
        <span>made in 台灣 · {new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}
