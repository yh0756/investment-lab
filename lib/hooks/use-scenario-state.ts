"use client";

import { useEffect, useMemo, useState } from "react";
import { decodeScenario } from "@/lib/share";

export function useScenarioState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const urlValue = new URLSearchParams(window.location.search).get("s");
    const fromUrl = urlValue ? decodeScenario<T>(urlValue) : null;
    if (fromUrl) {
      setValue(fromUrl);
      setReady(true);
      return;
    }
    const saved = localStorage.getItem(key);
    if (saved) {
      try { setValue(JSON.parse(saved) as T); } catch { /* ignore damaged storage */ }
    }
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (ready) localStorage.setItem(key, JSON.stringify(value));
  }, [key, ready, value]);

  return useMemo(() => ({ value, setValue, ready }), [value, ready]);
}
