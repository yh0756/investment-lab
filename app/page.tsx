import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, ShieldCheck } from "lucide-react";
import { calculators } from "@/lib/calculator-catalog";

export default function Home() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-bold text-brand">외부 API 없이 브라우저에서 즉시 계산</span>
          <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">복잡한 투자 문제를<br className="hidden sm:block" /> 직접 계산해보세요</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">회원가입 없이 나의 투자 조건을 입력하고 결과가 달라지는 이유까지 바로 확인할 수 있습니다.</p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600"><span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-positive" />입력 즉시 결과 업데이트</span><span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-brand" />금융정보 외부 전송 없음</span></div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8"><h2 className="text-3xl font-black text-slate-950">투자 계산기 6종</h2><p className="mt-2 text-slate-600">바로 계산하거나, 먼저 기준과 계산 원리를 확인할 수 있습니다.</p></div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {calculators.map(({ href, guideHref, name, description, tag, icon: Icon }) => (
            <article key={href} className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1">
              <div className="flex items-start justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-navy"><Icon className="h-6 w-6" /></span><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-brand">{tag}</span></div>
              <h3 className="mt-5 text-xl font-black text-slate-950">{name}</h3><p className="mt-3 min-h-16 text-sm leading-6 text-slate-600">{description}</p>
              <div className="mt-auto pt-5">
                <Link href={href} className="inline-flex min-h-11 items-center gap-2 font-bold text-brand">계산해보기 <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></Link>
                <div className="mt-2 border-t border-slate-100 pt-3">
                  <Link href={guideHref} className="inline-flex items-center gap-2 text-sm font-semibold leading-6 text-slate-500 transition hover:text-navy"><BookOpen className="h-4 w-4" />기준과 계산 방법, 개념 자세히 보기</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
