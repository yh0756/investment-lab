import { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";

export function CalculatorShell({ title, description, headline, actions, input, result, education, assumptions }: {
  title: string;
  description: string;
  headline: string;
  actions: ReactNode;
  input: ReactNode;
  result: ReactNode;
  education: Array<{ title: string; body: string }>;
  assumptions: string[];
}) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="mb-2 text-sm font-bold text-brand">투자실험실 계산기</p>
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl leading-7 text-slate-600">{description}</p>
        <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 font-semibold text-navy">{headline}</div>
        <div className="mt-4">{actions}</div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
        <section className="space-y-4">{input}</section>
        <section id="calculator-result" className="space-y-4 lg:sticky lg:top-4 lg:self-start">{result}</section>
      </div>
      <section className="mt-10">
        <h2 className="text-2xl font-black text-slate-900">쉽게 이해하는 계산 원리</h2>
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
