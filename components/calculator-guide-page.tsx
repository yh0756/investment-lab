import Link from "next/link";
import { AlertTriangle, ArrowRight, BookOpen, Calculator, CheckCircle2, ChevronRight, Lightbulb, Sigma } from "lucide-react";
import { calculators } from "@/lib/calculator-catalog";
import type { CalculatorGuide } from "@/lib/calculator-guides";
import { siteUrl } from "@/lib/site-url";

export function CalculatorGuidePage({ guide }: { guide: CalculatorGuide }) {
  const current = calculators.find((calculator) => calculator.slug === guide.slug);
  const others = calculators.filter((calculator) => calculator.slug !== guide.slug);
  const guideUrl = `${siteUrl}/guides/${guide.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.seoDescription,
        author: { "@type": "Organization", name: "투자실험실" },
        publisher: { "@type": "Organization", name: "투자실험실" },
        dateModified: guide.reviewedAtIso,
        url: guideUrl,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "투자실험실", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "계산 기준과 개념", item: `${siteUrl}/guides` },
          { "@type": "ListItem", position: 3, name: guide.title, item: guideUrl },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: guide.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <nav className="flex flex-wrap items-center gap-1 text-xs font-semibold text-slate-500" aria-label="현재 위치">
            <Link href="/" className="hover:text-brand">홈</Link><ChevronRight className="h-3.5 w-3.5" />
            <Link href="/guides" className="hover:text-brand">기준과 개념</Link><ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-700">{current?.shortName ?? guide.tag}</span>
          </nav>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-black text-brand">{guide.tag} · 계산 기준</span>
              <h1 className="mt-4 max-w-4xl text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">{guide.title}</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">{guide.lead}</p>
            </div>
            <Link href={guide.calculatorHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-navy px-6 text-sm font-bold text-white transition hover:bg-slate-800">
              <Calculator className="h-5 w-5" /> 계산기 바로 사용하기 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
        <section>
          <div className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-brand" /><h2 className="text-2xl font-black text-slate-950">먼저 알아둘 핵심</h2></div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {guide.highlights.map((item, index) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                <span className="text-xs font-black text-brand">POINT {index + 1}</span>
                <h3 className="mt-2 text-lg font-black text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2"><Sigma className="h-5 w-5 text-brand" /><h2 className="text-2xl font-black text-slate-950">계산 기준과 방법</h2></div>
          <p className="mt-2 text-sm leading-6 text-slate-600">계산기는 아래 순서로 입력값을 처리합니다. 상세 설정을 바꾸면 같은 구조 안에서 가정만 달라집니다.</p>
          <div className="mt-5 space-y-4">
            {guide.methods.map((method) => (
              <article key={method.step} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-[56px_minmax(0,1fr)] sm:p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-sm font-black text-brand">{method.step}</span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{method.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{method.body}</p>
                  {method.formula && <div className="mt-3 overflow-x-auto rounded-xl bg-slate-950 px-4 py-3 font-mono text-sm text-slate-100">{method.formula}</div>}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-blue-200 bg-blue-50/70 p-6 sm:p-8">
          <div className="flex items-center gap-2 text-navy"><Lightbulb className="h-6 w-6" /><h2 className="text-2xl font-black">숫자로 보는 예시</h2></div>
          <h3 className="mt-5 text-lg font-black text-slate-950">{guide.example.title}</h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl bg-white p-5"><p className="text-xs font-black text-slate-500">입력 가정</p><p className="mt-2 text-sm leading-7 text-slate-700">{guide.example.scenario}</p></div>
            <div className="rounded-2xl bg-white p-5"><p className="text-xs font-black text-slate-500">계산 결과의 의미</p><p className="mt-2 text-sm leading-7 text-slate-700">{guide.example.result}</p></div>
          </div>
          <p className="mt-4 rounded-2xl bg-navy px-5 py-4 text-sm font-bold leading-6 text-white">핵심: {guide.example.takeaway}</p>
          <details className="group mt-4 rounded-2xl border border-blue-100 bg-white/80 p-5">
            <summary className="cursor-pointer list-none text-sm font-black text-navy">다른 조건 2가지도 비교하기</summary>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {guide.additionalExamples.map((item) => (
                <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-4">
                  <h3 className="text-sm font-black text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.scenario}</p>
                  <p className="mt-3 border-t border-slate-100 pt-3 text-sm font-semibold leading-6 text-navy">{item.takeaway}</p>
                </article>
              ))}
            </div>
          </details>
        </section>

        <section>
          <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-positive" /><h2 className="text-2xl font-black text-slate-950">결과를 해석하는 방법</h2></div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {guide.interpretations.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-black text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-caution" /><h2 className="text-xl font-black text-slate-950">계산 전에 확인할 점</h2></div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              {guide.cautions.map((item) => <li key={item} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-caution" />{item}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-black text-slate-950">자주 묻는 질문</h2>
            <div className="mt-4 divide-y divide-slate-200">
              {guide.faq.map((item) => (
                <details key={item.question} className="group py-3">
                  <summary className="cursor-pointer list-none pr-5 text-sm font-bold text-slate-900">{item.question}</summary>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-brand">검토 정보</p>
              <h2 className="mt-1 text-xl font-black text-slate-950">계산 근거와 확인 기준</h2>
            </div>
            <p className="text-xs font-semibold text-slate-500">콘텐츠 최종 검토일: {guide.reviewedAt}</p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {guide.references.map((item) => (
              <article key={item.title} className="rounded-xl bg-slate-50 p-4">
                <h3 className="text-sm font-black text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-500">이 페이지는 실시간 시세를 제공하지 않습니다. 실제 내용을 검토하거나 계산 기준을 수정한 경우에만 최종 검토일을 갱신합니다.</p>
        </section>

        <section className="rounded-3xl bg-navy p-6 text-white sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-sm font-bold text-blue-200">개념을 확인했다면</p><h2 className="mt-1 text-2xl font-black">내 조건을 입력해 직접 비교해보세요</h2></div>
            <Link href={guide.calculatorHref} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-black text-navy transition hover:bg-blue-50">계산기 바로 사용하기 <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">다른 계산기 살펴보기</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((calculator) => (
              <Link key={calculator.href} href={calculator.guideHref} className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-soft">
                <span className="text-xs font-black text-brand">{calculator.tag}</span>
                <p className="mt-1 font-bold text-slate-900">{calculator.shortName}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-slate-500">기준과 개념 보기 <ArrowRight className="h-3.5 w-3.5" /></span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
