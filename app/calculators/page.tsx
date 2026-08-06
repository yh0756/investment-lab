import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { calculators } from "@/lib/calculator-catalog";

export const metadata = { title: "전체 투자 계산기", description: "투자실험실의 금융·주식·ETF 계산기 6종을 확인하세요." };

export default function CalculatorsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black">전체 계산기</h1>
      <p className="mt-3 text-slate-600">계산기를 바로 실행하거나 각 계산의 기준과 개념을 먼저 확인하세요.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {calculators.map((calculator) => (
          <article key={calculator.href} className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-blue-300">
            <h2 className="font-black">{calculator.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{calculator.description}</p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              <Link href={calculator.href} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-brand">계산기 열기 <ArrowRight className="h-4 w-4" /></Link>
              <Link href={calculator.guideHref} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-slate-500 hover:text-navy"><BookOpen className="h-4 w-4" />기준과 개념 보기</Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
