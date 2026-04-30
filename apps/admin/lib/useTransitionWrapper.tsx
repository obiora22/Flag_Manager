import { useCallback, useState, useTransition } from "react";

export function useTransitionWrapper() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<Error | null>(null);
  const start = useCallback((callback: () => Promise<void>) => {
    try {
      startTransition(async () => {
        await callback();
      });
    } catch (err) {
      setError(err as unknown as Error);
    }
  }, []);

  return { start, isPending, error };
}
