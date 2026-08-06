import Link from "next/link";
import { ArrowRight, BookOpen, Calculator } from "lucide-react";
import { calculators } from "@/lib/calculator-catalog";

export const metadata = {
  title: "투자 계산 기준과 핵심 개념",
  description: "투자실험실 계산기 6종의 계산 기준, 공식, 결과 해석 방법과 주의사항을 확인하세요.",
};

export default function GuidesPage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-black text-brand">투자 기초</span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950">계산 기준과 핵심 개념</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">숫자만 확인하지 않고 결과가 나온 이유까지 이해할 수 있도록 계산 원리, 대표 예시, 해석 방법과 주의사항을 계산기별로 정리했습니다.</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {calculators.map(({ href, guideHref, name, description, tag, icon: Icon }) => (
            <article key={guideHref} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="flex items-start justify-between gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-navy"><Icon className="h-5 w-5" /></span><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-brand">{tag}</span></div>
              <h2 className="mt-5 text-xl font-black text-slate-950">{name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-4">
                <Link href={guideHref} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-brand"><BookOpen className="h-4 w-4" />기준과 개념 자세히 보기 <ArrowRight className="h-4 w-4" /></Link>
                <Link href={href} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-slate-500 hover:text-navy"><Calculator className="h-4 w-4" />계산기 바로 사용</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
