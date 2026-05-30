import { useState, useCallback } from "react";
import type { IPInfo } from "@/types";
import { getIPInfo, getIPBatch } from "@/lib/tauri";

export function useIPInfo() {
  const [ipInfo, setIPInfo] = useState<IPInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIPInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const info = await getIPInfo();
      setIPInfo(info);
      return info;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBatch = useCallback(async (ips: string[]) => {
    setLoading(true);
    setError(null);
    try {
      return await getIPBatch(ips);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { ipInfo, loading, error, fetchIPInfo, fetchBatch };
}
