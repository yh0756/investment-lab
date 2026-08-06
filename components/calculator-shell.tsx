import { ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle, BookOpen, CheckCircle2, Lightbulb } from "lucide-react";

export function CalculatorShell({ title, description, headline, guideHref, input, result, education, assumptions }: {
  title: string;
  description: string;
  headline: string;
  guideHref: string;
  input: ReactNode;
  result: ReactNode;
  education: Array<{ title: string; body: string }>;
  assumptions: string[];
}) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-6 border-b border-slate-200 pb-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand">투자실험실 계산기</p>
        <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">{description}</p>
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold leading-6 text-navy">{headline}</p>
          <Link
            href={guideHref}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 text-sm font-bold text-navy transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <BookOpen className="h-4 w-4" />
            개념·계산 기준 보기
          </Link>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)]">
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black text-slate-900">조건 입력</h2>
            <span className="text-xs text-slate-400">입력 즉시 결과 반영</span>
          </div>
          {input}
        </section>
        <section id="calculator-result" className="space-y-4 lg:sticky lg:top-32 lg:self-start">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black text-slate-900">핵심 결과</h2>
            <span className="text-xs text-slate-400">입력값을 바꾸면 결과가 바로 반영됩니다</span>
          </div>
          {result}
        </section>
      </div>
      <section className="mt-12">
        <h2 className="text-xl font-black text-slate-900 sm:text-2xl">쉽게 이해하는 계산 원리</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {education.map((item) => (
            <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2 text-navy"><Lightbulb className="h-5 w-5" /><h3 className="font-bold">{item.title}</h3></div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-positive" /><h2 className="font-bold text-slate-900">현재 적용된 계산 가정</h2></div>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">{assumptions.map((item) => <li key={item}>• {item}</li>)}</ul>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-caution" /><h2 className="font-bold text-slate-900">면책 및 주의사항</h2></div>
          <p className="mt-3 text-sm leading-6 text-slate-700">본 서비스의 계산 결과는 사용자가 입력한 가정에 따른 단순 시뮬레이션이며 실제 투자 결과를 보장하지 않습니다. 세금, 수수료, 환율, 상품 구조 및 시장 상황에 따라 실제 결과는 달라질 수 있으며 특정 금융상품의 매수 또는 매도를 권유하지 않습니다.</p>
        </div>
      </section>
    </main>
  );
}
