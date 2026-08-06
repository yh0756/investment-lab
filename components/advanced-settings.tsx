import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdvancedSettings({
  title = "상세 설정",
  description = "기본값 그대로 사용해도 계산할 수 있습니다.",
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <details className={cn("group overflow-hidden rounded-2xl border border-slate-200 bg-white", className)}>
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 marker:content-none">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <SlidersHorizontal className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="font-bold text-slate-900">{title}</p>
            <p className="mt-0.5 text-xs leading-5 text-slate-500">{description}</p>
          </div>
        </div>
        <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-slate-100 px-5 py-5">{children}</div>
    </details>
  );
}
