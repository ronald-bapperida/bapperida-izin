import { useEffect, useRef, useCallback } from 'react';
import type { UseFormReturn } from 'react-hook-form';

const DRAFT_PREFIX = 'draft:';

/** Clears every draft entry across all forms */
export function clearAllDrafts() {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(DRAFT_PREFIX)) keysToRemove.push(key);
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

export function useDraft(key: string, form: UseFormReturn<Record<string, unknown>>) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const storageKey = `${DRAFT_PREFIX}${key}`;

  // Restore on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const saved = JSON.parse(raw);
      for (const [k, v] of Object.entries(saved)) {
        if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
          form.setValue(k, v);
        }
      }
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Auto-save debounced
  const save = useCallback((values: Record<string, unknown>) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const toSave: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(values)) {
        if (!(v instanceof File)) toSave[k] = v;
      }
      try { localStorage.setItem(storageKey, JSON.stringify(toSave)); } catch { /* ignore */ }
    }, 800);
  }, [storageKey]);

  useEffect(() => {
    const sub = form.watch((values) => save(values as Record<string, unknown>));
    return () => sub.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [save]);

  const clearDraft = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    clearAllDrafts();
  }, []);

  return { clearDraft };
}
