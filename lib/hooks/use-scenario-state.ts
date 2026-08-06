"use client";

import { useEffect, useMemo, useState } from "react";
import { decodeScenario } from "@/lib/share";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeWithInitial<T>(initial: T, candidate: unknown): T {
  if (Array.isArray(initial)) {
    if (!Array.isArray(candidate)) return initial;
    if (initial.length === 0) return candidate as T;

    const template = initial[0];
    return candidate.map((item) => mergeWithInitial(template, item)) as T;
  }

  if (isPlainObject(initial)) {
    const source = isPlainObject(candidate) ? candidate : {};
    return Object.fromEntries(
      Object.entries(initial).map(([key, defaultValue]) => [
        key,
        mergeWithInitial(defaultValue, source[key]),
      ]),
    ) as T;
  }

  if (typeof initial === "number") {
    return (typeof candidate === "number" && Number.isFinite(candidate) ? candidate : initial) as T;
  }

  return (typeof candidate === typeof initial ? candidate : initial) as T;
}

export function useScenarioState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const urlValue = new URLSearchParams(window.location.search).get("s");
    const fromUrl = urlValue ? decodeScenario<unknown>(urlValue) : null;

    if (fromUrl !== null) {
      setValue(mergeWithInitial(initialValue, fromUrl));
      setReady(true);
      return;
    }

    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setValue(mergeWithInitial(initialValue, JSON.parse(saved)));
      } catch {
        localStorage.removeItem(key);
      }
    }
    setReady(true);
  }, [initialValue, key]);

  useEffect(() => {
    if (ready) localStorage.setItem(key, JSON.stringify(value));
  }, [key, ready, value]);

  return useMemo(() => ({ value, setValue, ready }), [value, ready]);
}
