import { useState, useCallback } from "react";

export function useTauriInvoke<T>(command: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (args?: Record<string, unknown>) => {
      setLoading(true);
      setError(null);
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        const result = await invoke<T>(command, args);
        setData(result);
        return result;
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [command]
  );

  return { data, loading, error, execute };
}
