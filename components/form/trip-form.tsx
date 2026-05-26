'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { TripRequestSchema, type TripRequest } from '@/lib/validators/trip-request';
import { CITIES } from '@/lib/constants/cities';
import { DURATIONS, TRANSPORTS, BUDGETS } from '@/lib/constants/transport';
import { PREFERENCES } from '@/lib/constants/preferences';

const fieldEntries: Array<{
  index: string;
  label: string;
  hint?: string;
}> = [
  { index: '01', label: '出發城市', hint: '你現在人在哪' },
  { index: '02', label: '時長', hint: '半日就好？還是兩天一夜' },
  { index: '03', label: '交通方式', hint: '會大幅影響可去的範圍' },
  { index: '04', label: '預算', hint: '單人花費上限' },
  { index: '05', label: '偏好', hint: '挑 1–4 個關鍵字' },
];

function FieldShell({
  index,
  label,
  hint,
  children,
}: {
  index: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[0.78rem] text-amber">
            {index}
          </span>
          <span className="text-base font-medium text-foreground sm:text-[1.05rem]">
            {label}
          </span>
        </div>
        {hint ? (
          <span className="font-mono text-[0.7rem] tracking-wide text-muted-foreground">
            {hint}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

const selectTriggerCx =
  'h-12 w-full rounded-none border-x-0 border-t-0 border-b border-border bg-transparent px-1 text-base text-foreground transition-colors data-placeholder:text-muted-foreground hover:border-amber focus-visible:border-amber focus-visible:ring-0 sm:h-14 sm:text-[1.05rem]';

export function TripForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<TripRequest>({
    resolver: zodResolver(TripRequestSchema),
    defaultValues: {
      preferences: [],
    },
  });

  const {
    formState: { isSubmitting },
    watch,
    setValue,
  } = form;

  const selectedPreferences = watch('preferences') ?? [];

  function togglePreference(value: (typeof PREFERENCES)[number]['value']) {
    const current = selectedPreferences;
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue('preferences', next, { shouldValidate: true });
  }

  async function onSubmit(values: TripRequest) {
    setSubmitError(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? `產生失敗 (HTTP ${res.status})`);
      }
      const plan = await res.json();
      sessionStorage.setItem('weekend-picker:trip-plan', JSON.stringify(plan));
      sessionStorage.setItem(
        'weekend-picker:trip-request',
        JSON.stringify(values),
      );
      router.push('/result');
    } catch (err) {
      console.error('generate failed', err);
      setSubmitError(err instanceof Error ? err.message : '產生失敗，請再試一次');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-9 sm:space-y-11">
        <FormField
          control={form.control}
          name="departureCity"
          render={({ field }) => (
            <FormItem>
              <FieldShell {...fieldEntries[0]}>
                <Select onValueChange={field.onChange} value={field.value ?? null}>
                  <FormControl>
                    <SelectTrigger className={selectTriggerCx}>
                      <SelectValue placeholder="選一個出發點" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CITIES.map((city) => (
                      <SelectItem key={city.value} value={city.value}>
                        {city.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldShell>
              <FormMessage className="pl-1 pt-2 text-[0.8rem]" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FieldShell {...fieldEntries[1]}>
                <Select onValueChange={field.onChange} value={field.value ?? null}>
                  <FormControl>
                    <SelectTrigger className={selectTriggerCx}>
                      <SelectValue placeholder="選時長" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DURATIONS.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldShell>
              <FormMessage className="pl-1 pt-2 text-[0.8rem]" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transportation"
          render={({ field }) => (
            <FormItem>
              <FieldShell {...fieldEntries[2]}>
                <Select onValueChange={field.onChange} value={field.value ?? null}>
                  <FormControl>
                    <SelectTrigger className={selectTriggerCx}>
                      <SelectValue placeholder="選交通工具" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TRANSPORTS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldShell>
              <FormMessage className="pl-1 pt-2 text-[0.8rem]" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FieldShell {...fieldEntries[3]}>
                <Select onValueChange={field.onChange} value={field.value ?? null}>
                  <FormControl>
                    <SelectTrigger className={selectTriggerCx}>
                      <SelectValue placeholder="選預算" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BUDGETS.map((b) => (
                      <SelectItem key={b.value} value={b.value}>
                        {b.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldShell>
              <FormMessage className="pl-1 pt-2 text-[0.8rem]" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferences"
          render={() => (
            <FormItem>
              <FieldShell {...fieldEntries[4]}>
                <FormControl>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {PREFERENCES.map((p) => {
                      const active = selectedPreferences.includes(p.value);
                      return (
                        <button
                          type="button"
                          key={p.value}
                          onClick={() => togglePreference(p.value)}
                          className={cn(
                            'group/chip relative rounded-full border px-3.5 py-1.5 text-sm transition-all',
                            'before:absolute before:inset-0 before:rounded-full before:transition-opacity',
                            active
                              ? 'border-amber bg-amber text-paper shadow-[0_0_30px_var(--amber-glow)]'
                              : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground',
                          )}
                        >
                          <span className="relative z-10">
                            <span className={cn('mr-0.5', active ? 'opacity-100' : 'opacity-60')}>
                              #
                            </span>
                            {p.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </FormControl>
              </FieldShell>
              <FormMessage className="pl-1 pt-2 text-[0.8rem]" />
            </FormItem>
          )}
        />

        {submitError ? (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 font-mono text-[0.8rem] text-destructive">
            <span className="mr-2 opacity-60">[err]</span>
            {submitError}
          </div>
        ) : null}

        <div className="pt-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'group/submit relative h-14 w-full overflow-hidden rounded-full border border-amber',
              'bg-amber text-paper text-base font-medium',
              'transition-all hover:shadow-[0_0_40px_var(--amber-soft)]',
              'sm:h-16 sm:text-[1.05rem]',
            )}
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-5 animate-spin" />
                AI 規劃中・約 10 秒
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                產生行程
                <ArrowRight className="size-5 transition-transform group-hover/submit:translate-x-0.5" />
              </span>
            )}
          </Button>
          <p className="mt-3 text-center font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
            每次產生 ≈ NT$ 1 成本 · 結果僅供參考
          </p>
        </div>
      </form>
    </Form>
  );
}
