import { TripForm } from '@/components/form/trip-form';

export default function Home() {
  return (
    <main className="grain relative mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 pt-10 pb-20 sm:px-8 sm:pt-16">
      <div className="mb-6 flex items-center justify-between sm:mb-10">
        <span className="running-head">週末去哪裡 / weekend picker</span>
        <span className="font-mono text-[0.78rem] tracking-wide text-muted-foreground">
          試刊號 / 試試看
        </span>
      </div>

      <header className="relative mb-16 space-y-7 sm:mb-24">
        <div className="absolute -top-2 right-0 hidden rotate-[-7deg] sm:block">
          <span className="stamp">
            <span aria-hidden>✦</span> issue 001
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-block h-2 w-2 rounded-full bg-amber shadow-[0_0_22px_var(--amber)]" />
          <span className="label-eyebrow">AI 微旅行指南・台灣</span>
        </div>

        <h1 className="display-serif text-[3rem] leading-[1.02] font-black sm:text-[4.75rem]">
          週末
          <br />
          <span className="marker-underline pr-2">去哪裡</span>
          <span className="text-amber">.</span>
        </h1>

        <p className="max-w-lg text-[1.05rem] leading-relaxed text-muted-foreground sm:text-[1.18rem]">
          給我一個方向，AI 幫你排一份
          <span className="text-foreground"> 真的走得完 </span>
          的台灣半日 / 一日小旅行 ——
          <span className="block sm:inline">不用查地圖、不用比 CP 值、不用看部落客置入。</span>
        </p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2">
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
        </div>
      </header>

      <div className="relative mb-12 sm:mb-16">
        <div className="absolute inset-x-0 top-1/2 hairline h-px" />
        <div className="relative flex justify-center">
          <span className="bg-background px-4 font-mono text-[0.78rem] uppercase tracking-[0.24em] text-amber">
            ✦ 告訴我你想怎麼玩 ✦
          </span>
        </div>
      </div>

      <TripForm />

      <aside className="mt-24 sm:mt-32">
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
      </aside>

      <footer className="mt-20 flex flex-col gap-2 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono text-[0.78rem] uppercase tracking-[0.18em] text-muted-foreground">
          weekend-picker.app
        </span>
        <span className="font-mono text-[0.78rem] uppercase tracking-[0.18em] text-muted-foreground">
          made by hand <span className="text-amber">·</span> 在台灣這座島上 <span className="text-amber">·</span>{' '}
          {new Date().getFullYear()}
        </span>
      </footer>
    </main>
  );
}
