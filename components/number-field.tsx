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
  /**
   * 화면에 표시할 때 내부 값을 나누는 단위입니다.
   * 예: 원 단위 상태값을 만원 단위로 입력받을 때 10_000을 사용합니다.
   */
  inputScale?: number;
}

function displayNumber(value: number, inputScale: number): string {
  const displayed = value / inputScale;
  return Number.isFinite(displayed)
    ? displayed.toLocaleString("ko-KR", { maximumFractionDigits: 4 })
    : "";
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  hint,
  slider = false,
  disabled = false,
  inputScale = 1,
}: NumberFieldProps) {
  const safeScale = Number.isFinite(inputScale) && inputScale > 0 ? inputScale : 1;
  const [text, setText] = useState(displayNumber(value, safeScale));

  useEffect(() => setText(displayNumber(value, safeScale)), [value, safeScale]);

  const update = (raw: string) => {
    setText(raw);
    if (raw.trim() === "" || raw.trim() === "-") return;

    const parsed = Number(raw.replace(/,/g, ""));
    if (!Number.isFinite(parsed)) return;

    const scaledValue = parsed * safeScale;
    const bounded = Math.min(max ?? scaledValue, Math.max(min ?? scaledValue, scaledValue));
    onChange(bounded);
  };

  const sliderMin = min === undefined ? undefined : min / safeScale;
  const sliderMax = max === undefined ? undefined : max / safeScale;
  const sliderStep = step / safeScale;
  const sliderValue = value / safeScale;

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <label
          className={
            getTermHelp(label)
              ? "cursor-help border-b border-dotted border-slate-400 text-sm font-semibold text-slate-700"
              : "text-sm font-semibold text-slate-700"
          }
          title={getTermHelp(label)}
        >
          {label}
        </label>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      <div className="relative">
        <Input
          inputMode="decimal"
          value={text}
          onChange={(event) => update(event.target.value)}
          onBlur={() => {
            if (text.trim() === "" || text.trim() === "-") {
              setText(displayNumber(value, safeScale));
            }
          }}
          onWheel={(event) => event.currentTarget.blur()}
          aria-label={label}
          disabled={disabled}
          className={unit ? "pr-16 disabled:bg-slate-100 disabled:text-slate-500" : "disabled:bg-slate-100 disabled:text-slate-500"}
        />
        {unit && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-slate-500">
            {unit}
          </span>
        )}
      </div>
      {slider && sliderMin !== undefined && sliderMax !== undefined && (
        <input
          className="w-full accent-blue-600 disabled:opacity-40"
          type="range"
          min={sliderMin}
          max={sliderMax}
          step={sliderStep}
          value={sliderValue}
          disabled={disabled}
          onChange={(event) => onChange(Number(event.target.value) * safeScale)}
          aria-label={`${label} 슬라이더`}
        />
      )}
    </div>
  );
}
