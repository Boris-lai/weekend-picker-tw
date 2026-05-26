import { TripForm } from '@/components/form/trip-form';

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 py-10 sm:py-16">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          週末去哪裡
        </h1>
        <p className="text-base text-muted-foreground">
          告訴我你想怎麼玩，AI 幫你排一份走得完的台灣微旅行。
        </p>
      </header>
      <TripForm />
    </main>
  );
}
