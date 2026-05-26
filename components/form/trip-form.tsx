'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="departureCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>出發城市</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? null}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="選擇出發城市" />
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>時長</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? null}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="選擇時長" />
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transportation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>交通方式</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? null}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="選擇交通方式" />
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>預算</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? null}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="選擇預算" />
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferences"
          render={() => (
            <FormItem>
              <FormLabel>偏好（1–4 個）</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {PREFERENCES.map((p) => {
                    const active = selectedPreferences.includes(p.value);
                    return (
                      <button
                        type="button"
                        key={p.value}
                        onClick={() => togglePreference(p.value)}
                        className={cn(
                          'rounded-full border px-3 py-1.5 text-sm transition-colors',
                          active
                            ? 'border-foreground bg-foreground text-background'
                            : 'border-input hover:bg-accent'
                        )}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {submitError ? (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {submitError}
          </p>
        ) : null}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" /> AI 規劃中（約 10 秒）…
            </>
          ) : (
            '產生行程'
          )}
        </Button>
      </form>
    </Form>
  );
}
