import { useRef, useEffect, useCallback, useState } from "react";

interface UseAutoSaveOptions {
  questionId: string;
  value: unknown;
  enabled?: boolean;
  debounceMs?: number;
}

export function useAutoSave({
  questionId,
  value,
  enabled = true,
  debounceMs = 1500,
}: UseAutoSaveOptions) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastValueRef = useRef<string>("");

  const save = useCallback(
    async (val: unknown) => {
      if (!enabled || !questionId || val === null || val === undefined) return;
      const serialized = JSON.stringify(val);
      if (serialized === lastValueRef.current) return;

      setIsSaving(true);
      try {
        const res = await fetch("/api/answers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionId, response: val, submit: false }),
        });
        if (res.ok) {
          lastValueRef.current = serialized;
          setLastSaved(new Date());
        }
      } catch (err) {
        console.error("Auto-save failed:", err);
      } finally {
        setIsSaving(false);
      }
    },
    [questionId, enabled],
  );

  useEffect(() => {
    if (!enabled) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      save(value);
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, debounceMs, save, enabled]);

  // Reset last value tracking when question changes
  useEffect(() => {
    lastValueRef.current = "";
  }, [questionId]);

  return { isSaving, lastSaved };
}
