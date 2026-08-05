"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { getTermHelp } from "@/lib/term-help";

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  hint?: string;
  slider?: boolean;
  disabled?: boolean;
}

function displayNumber(value: number): string {
  return Number.isFinite(value) ? value.toLocaleString("ko-KR", { maximumFractionDigits: 4 }) : "";
}

export function NumberField({ label, value, onChange, min, max, step = 1, unit, hint, slider = false, disabled = false }: NumberFieldProps) {
  const [text, setText] = useState(displayNumber(value));
  useEffect(() => setText(displayNumber(value)), [value]);

  const update = (raw: string) => {
    setText(raw);
    if (raw.trim() === "" || raw.trim() === "-") return;
    const parsed = Number(raw.replace(/,/g, ""));
    if (!Number.isFinite(parsed)) return;
    const bounded = Math.min(max ?? parsed, Math.max(min ?? parsed, parsed));
    onChange(bounded);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <label className={getTermHelp(label) ? "cursor-help border-b border-dotted border-slate-400 text-sm font-semibold text-slate-700" : "text-sm font-semibold text-slate-700"} title={getTermHelp(label)}>{label}</label>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      <div className="relative">
        <Input
          inputMode="decimal"
          value={text}
          onChange={(event) => update(event.target.value)}
          onBlur={() => { if (text.trim() === "" || text.trim() === "-") setText(displayNumber(value)); }}
          onWheel={(event) => event.currentTarget.blur()}
          aria-label={label}
          disabled={disabled}
          className={unit ? "pr-16 disabled:bg-slate-100 disabled:text-slate-500" : "disabled:bg-slate-100 disabled:text-slate-500"}
        />
        {unit && <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-slate-500">{unit}</span>}
      </div>
      {slider && min !== undefined && max !== undefined && (
        <input className="w-full accent-blue-600 disabled:opacity-40" type="range" min={min} max={max} step={step} value={value} disabled={disabled} onChange={(event) => onChange(Number(event.target.value))} aria-label={`${label} 슬라이더`} />
      )}
    </div>
  );
}
