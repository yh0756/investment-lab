"use client";

import html2canvas from "html2canvas";
import { BookOpen, Download, ImageDown, Link2, Printer, RotateCcw, Save } from "lucide-react";
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
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="secondary" size="sm" onClick={example}><BookOpen className="h-4 w-4" />예시 불러오기</Button>
      <Button type="button" variant="secondary" size="sm" onClick={() => alert("현재 조건은 이 브라우저에 자동 저장되어 있습니다.")}><Save className="h-4 w-4" />현재 조건 저장</Button>
      <Button type="button" variant="secondary" size="sm" onClick={reset}><RotateCcw className="h-4 w-4" />초기화</Button>
      <Button type="button" variant="secondary" size="sm" onClick={() => copyScenarioUrl(value).then(() => alert("공유 링크를 복사했습니다."))}><Link2 className="h-4 w-4" />결과 공유</Button>
      <Button type="button" variant="secondary" size="sm" onClick={() => downloadCsv(csvName, csvRows)}><Download className="h-4 w-4" />CSV</Button>
      <Button type="button" variant="secondary" size="sm" onClick={saveImage}><ImageDown className="h-4 w-4" />이미지</Button>
      <Button type="button" variant="secondary" size="sm" onClick={() => window.print()}><Printer className="h-4 w-4" />인쇄</Button>
    </div>
  );
}
