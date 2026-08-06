import { ChevronDown } from "lucide-react";

export function SecondaryResults({ children, title = "세부 결과 보기" }: { children: React.ReactNode; title?: string }) {
  return (
    <details className="group rounded-2xl border border-slate-200 bg-white">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-5 py-3 marker:content-none">
        <span className="text-sm font-bold text-slate-700">{title}</span>
        <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-slate-100 p-4">{children}</div>
    </details>
  );
}
