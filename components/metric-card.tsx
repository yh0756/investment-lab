import { cn } from "@/lib/utils";
import { getTermHelp } from "@/lib/term-help";

export function MetricCard({ label, value, note, tone = "default" }: { label: string; value: string; note?: string; tone?: "default" | "positive" | "negative" | "caution" }) {
  const tones = { default: "text-navy", positive: "text-positive", negative: "text-negative", caution: "text-caution" };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className={cn("text-xs font-semibold text-slate-500", getTermHelp(label) && "cursor-help underline decoration-dotted underline-offset-4")} title={getTermHelp(label)}>{label}</p>
      <p className={cn("mt-2 text-2xl font-black tracking-tight", tones[tone])}>{value}</p>
      {note && <p className="mt-1 text-xs leading-5 text-slate-500">{note}</p>}
    </div>
  );
}
