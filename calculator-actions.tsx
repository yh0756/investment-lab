"use client";

import html2canvas from "html2canvas";
import { BookOpen, ChevronDown, Download, ImageDown, Link2, Printer, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copyScenarioUrl } from "@/lib/share";
import { downloadCsv } from "@/lib/csv";

export function CalculatorActions<T>({ value, reset, example, csvRows, csvName, resultId = "calculator-result" }: {
  value: T;
  reset: () => void;
  example: () => void;
  csvRows: Array<Record<string, string | number>>;
  csvName: string;
  resultId?: string;
}) {
  const saveImage = async () => {
    const target = document.getElementById(resultId);
    if (!target) return;
    const canvas = await html2canvas(target, { backgroundColor: "#f8fafc", scale: 2 });
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `${csvName.replace(/\.csv$/i, "")}.png`;
    a.click();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" variant="secondary" size="sm" onClick={example}><BookOpen className="h-4 w-4" />예시</Button>
      <Button type="button" variant="secondary" size="sm" onClick={reset}><RotateCcw className="h-4 w-4" />초기화</Button>
      <Button type="button" size="sm" onClick={() => copyScenarioUrl(value).then(() => alert("공유 링크를 복사했습니다."))}><Link2 className="h-4 w-4" />결과 공유</Button>
      <details className="group relative">
        <summary className="flex h-9 cursor-pointer list-none items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 marker:content-none">
          더보기 <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
        </summary>
        <div className="absolute left-0 top-11 z-20 grid min-w-44 gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-lg sm:left-auto sm:right-0">
          <button type="button" className="flex min-h-10 items-center gap-2 rounded-lg px-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={() => alert("현재 조건은 이 브라우저에 자동 저장되어 있습니다.")}><Save className="h-4 w-4" />자동 저장 안내</button>
          <button type="button" className="flex min-h-10 items-center gap-2 rounded-lg px-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={() => downloadCsv(csvName, csvRows)}><Download className="h-4 w-4" />CSV 다운로드</button>
          <button type="button" className="flex min-h-10 items-center gap-2 rounded-lg px-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={saveImage}><ImageDown className="h-4 w-4" />결과 이미지</button>
          <button type="button" className="flex min-h-10 items-center gap-2 rounded-lg px-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={() => window.print()}><Printer className="h-4 w-4" />인쇄</button>
        </div>
      </details>
    </div>
  );
}
