"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const formContainerVariants = {
  hidden: { opacity: 1 },
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.08,
    },
  },
};

const formItemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  TripRequestSchema,
  type TripRequest,
} from "@/lib/validators/trip-request";
import { CITIES } from "@/lib/constants/cities";
import { DURATIONS, TRANSPORTS, BUDGETS } from "@/lib/constants/transport";
import { PREFERENCES } from "@/lib/constants/preferences";

const fieldEntries: Array<{
  index: string;
  label: string;
  hint?: string;
}> = [
  { index: "01", label: "出發城市", hint: "你現在人在哪" },
  { index: "02", label: "時長", hint: "半日就好？還是兩天一夜" },
  { index: "03", label: "交通方式", hint: "會大幅影響可去的範圍" },
  { index: "04", label: "預算", hint: "單人花費上限" },
  { index: "05", label: "偏好", hint: "挑 1–4 個關鍵字" },
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
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-[1.1rem] font-bold text-amber sm:text-[1.25rem]">
            {index}
          </span>
          <span className="text-[1.05rem] font-medium text-foreground sm:text-[1.18rem]">
            {label}
          </span>
        </div>
        {hint ? (
          <span className="hidden font-mono text-[0.8rem] tracking-wide text-muted-foreground sm:inline">
            {hint}
          </span>
        ) : null}
      </div>
      {hint ? (
        <p className="font-mono text-[0.8rem] text-muted-foreground sm:hidden">
          {hint}
        </p>
      ) : null}
      {children}
    </div>
  );
}

const selectTriggerCx =
  "h-14 w-full rounded-none border-x-0 border-t-0 border-b-2 border-border bg-transparent px-1 text-[1.05rem] text-foreground transition-colors data-placeholder:text-muted-foreground hover:border-amber focus-visible:border-amber focus-visible:ring-0 sm:h-16 sm:text-[1.18rem]";

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

  const selectedPreferences = watch("preferences") ?? [];

  function togglePreference(value: (typeof PREFERENCES)[number]["value"]) {
    const current = selectedPreferences;
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue("preferences", next, { shouldValidate: true });
  }

  async function onSubmit(values: TripRequest) {
    setSubmitError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? `產生失敗 (HTTP ${res.status})`);
      }
      const plan = await res.json();
      sessionStorage.setItem("weekend-picker:trip-plan", JSON.stringify(plan));
      sessionStorage.setItem(
        "weekend-picker:trip-request",
        JSON.stringify(values),
      );
      router.push("/result");
    } catch (err) {
      console.error("generate failed", err);
      setSubmitError(
        err instanceof Error ? err.message : "產生失敗，請再試一次",
      );
    }
  }

  return (
    <Form {...form}>
      <motion.form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-10 sm:space-y-12"
        variants={formContainerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={formItemVariants}>
          <FormField
            control={form.control}
            name="departureCity"
            render={({ field }) => (
              <FormItem>
                <FieldShell {...fieldEntries[0]}>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? null}
                  >
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
                <FormMessage className="pl-1 pt-2 text-[0.88rem]" />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div variants={formItemVariants}>
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FieldShell {...fieldEntries[1]}>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? null}
                  >
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
                <FormMessage className="pl-1 pt-2 text-[0.88rem]" />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div variants={formItemVariants}>
          <FormField
            control={form.control}
            name="transportation"
            render={({ field }) => (
              <FormItem>
                <FieldShell {...fieldEntries[2]}>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? null}
                  >
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
                <FormMessage className="pl-1 pt-2 text-[0.88rem]" />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          aria-hidden
          variants={formItemVariants}
          className="flex items-start gap-3 rounded-md border-l-2 border-amber/60 bg-cream-soft py-3 pl-4 pr-3 font-mono text-[0.84rem] leading-relaxed text-cream/80 sm:text-[0.92rem]"
        >
          <span>⚠️ 交通方式選錯，可能會排出沒辦法到的點。</span>
        </motion.div>

        <motion.div variants={formItemVariants}>
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FieldShell {...fieldEntries[3]}>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? null}
                  >
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
                <FormMessage className="pl-1 pt-2 text-[0.88rem]" />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div variants={formItemVariants}>
          <FormField
            control={form.control}
            name="preferences"
            render={() => (
              <FormItem>
                <FieldShell {...fieldEntries[4]}>
                  <FormControl>
                    <div className="flex flex-wrap gap-2.5 pt-2">
                      {PREFERENCES.map((p, idx) => {
                        const active = selectedPreferences.includes(p.value);
                        const rotate = [
                          "rotate-[-1.5deg]",
                          "rotate-[0.8deg]",
                          "rotate-[-0.4deg]",
                          "rotate-[1.2deg]",
                        ][idx % 4];
                        return (
                          <motion.button
                            type="button"
                            key={p.value}
                            onClick={() => togglePreference(p.value)}
                            whileTap={{ scale: 0.92 }}
                            whileHover={{ y: -2 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 22,
                            }}
                            className={cn(
                              "relative px-4 py-2 text-[0.95rem] font-medium",
                              "border-2 rounded-[10px]",
                              active
                                ? `${rotate} border-amber bg-amber text-paper shadow-[0_4px_30px_var(--amber-glow)] hover:rotate-0`
                                : "border-border text-foreground/80 hover:rotate-0 hover:border-foreground/50 hover:text-foreground",
                            )}
                          >
                            <span
                              className={cn(
                                "mr-1 font-mono",
                                active ? "opacity-100" : "text-amber",
                              )}
                            >
                              #
                            </span>
                            {p.label}
                          </motion.button>
                        );
                      })}
                    </div>
                  </FormControl>
                </FieldShell>
                <FormMessage className="pl-1 pt-2 text-[0.88rem]" />
              </FormItem>
            )}
          />
        </motion.div>

        {submitError ? (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="flex items-start gap-3 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 font-mono text-[0.88rem] text-destructive"
          >
            <span className="opacity-70">[err]</span>
            <span>{submitError}</span>
          </motion.div>
        ) : null}

        <motion.div variants={formItemVariants} className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "group/submit relative h-16 w-full overflow-hidden rounded-full border-2 border-amber",
              "bg-amber text-paper text-[1.1rem] font-bold",
              "transition-all hover:shadow-[0_0_50px_var(--amber-soft)]",
              "sm:h-[68px] sm:text-[1.2rem]",
            )}
          >
            {isSubmitting ? (
              <>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 overflow-hidden"
                >
                  <span className="animate-shimmer-sweep absolute top-0 h-full w-1/3 bg-linear-to-r from-transparent via-white/35 to-transparent" />
                </span>
                <span className="relative z-10 inline-flex items-center gap-2">
                  <Loader2 className="size-5 animate-spin" />
                  讓 AI 想想・約 10 秒
                </span>
              </>
            ) : (
              <span className="inline-flex items-center gap-2.5">
                給我排一份
                <ArrowRight className="size-5 transition-transform group-hover/submit:translate-x-1" />
              </span>
            )}
          </Button>
          <p className="mt-4 text-center font-mono text-[0.78rem] tracking-wide text-muted-foreground">
            每次產生 ≈ NT$ 1 成本 <span className="text-amber">·</span>{" "}
            真的不確定的地點記得 google
          </p>
        </motion.div>
      </motion.form>
    </Form>
  );
}
