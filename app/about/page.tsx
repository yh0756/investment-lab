import Link from "next/link";
import { BookOpenCheck, Calculator, CheckCircle2, Database, ShieldCheck, TriangleAlert } from "lucide-react";
import { StaticPage } from "@/components/static-page";
import { StorageManager } from "@/components/storage-manager";

export const metadata = {
  title: "이용 안내",
  description: "투자실험실의 서비스 목적, 계산 방식, 콘텐츠 작성 원칙, 입력값 저장 방식과 결과 활용 시 주의사항을 안내합니다.",
};

const principles = [
  "계산식과 주요 가정을 사용자가 확인할 수 있도록 공개합니다.",
  "실시간 시세나 외부 금융 API 대신 사용자가 입력한 조건만 사용합니다.",
  "특정 종목이나 금융상품의 매수·매도를 권유하지 않습니다.",
  "계산 오류나 설명상 문제가 확인되면 내용을 검토하고 수정합니다.",
];

export default function Page() {
  return (
    <StaticPage
      title="이용 안내"
      lead="투자실험실은 복잡한 투자 개념을 사용자가 직접 숫자를 바꾸며 이해할 수 있도록 만든 교육형 시뮬레이션 서비스입니다."
    >
      <section>
        <h2 className="text-xl font-black text-slate-950">투자실험실은 왜 만들었나요?</h2>
        <p className="mt-3">투자에서는 같은 수익률이라도 순서와 기간, 추가 투자 여부에 따라 결과가 크게 달라질 수 있습니다. 투자실험실은 설명만 읽는 데서 끝나지 않고 사용자가 자신의 조건을 입력해 결과가 어떻게 달라지는지 직접 확인하도록 돕습니다.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
          <div className="flex items-center gap-2 text-navy"><Calculator className="h-5 w-5" /><h2 className="font-black">이런 분께 적합합니다</h2></div>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            <li>• 투자 결과를 숫자로 미리 비교해보고 싶은 개인 투자자</li>
            <li>• 레버리지, 배당성장, 손실 회복과 리밸런싱 원리를 공부하는 분</li>
            <li>• 목표 자산을 달성하기 위한 월 투자금과 기간을 점검하려는 분</li>
          </ul>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center gap-2 text-navy"><BookOpenCheck className="h-5 w-5" /><h2 className="font-black">제공하지 않는 기능</h2></div>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            <li>• 실시간 주가와 ETF 데이터</li>
            <li>• 개인별 투자 자문이나 종목 추천</li>
            <li>• 수익률 보장과 미래 시장 예측</li>
          </ul>
        </article>
      </section>

      <section>
        <h2 className="text-xl font-black text-slate-950">계산기는 어떻게 작동하나요?</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            ["1", "조건 입력", "투자금, 기간, 수익률 등 사용자가 직접 가정을 입력합니다."],
            ["2", "브라우저 계산", "입력값을 정해진 계산식에 적용해 브라우저에서 즉시 결과를 계산합니다."],
            ["3", "결과 비교", "핵심 결과, 표와 차트를 통해 조건별 차이를 확인합니다."],
            ["4", "해석 확인", "계산 원리, 적용 가정과 주의사항을 함께 확인합니다."],
          ].map(([step, title, body]) => (
            <article key={step} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy text-xs font-black text-white">{step}</span>
                <div><h3 className="font-black text-slate-900">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{body}</p></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-positive" /><h2 className="text-xl font-black text-slate-950">콘텐츠 작성과 검토 원칙</h2></div>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
          {principles.map((item) => <li key={item} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-positive" />{item}</li>)}
        </ul>
        <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">계산 기준과 개념 페이지에는 대표 예시, 결과 해석, 확인 기준과 최종 검토일을 표시합니다. 검토일은 실제 내용을 확인하거나 수정했을 때만 갱신합니다.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center gap-2"><Database className="h-5 w-5 text-brand" /><h2 className="text-xl font-black text-slate-950">입력값 저장과 개인정보</h2></div>
        <p className="mt-3">회원가입 없이 모든 계산기를 사용할 수 있습니다. 입력값은 원칙적으로 브라우저에서 계산되며, 최근 조건 복원을 위해 localStorage에 자동 저장될 수 있습니다. 별도의 회원 계정이나 계산 데이터베이스는 운영하지 않습니다.</p>
        <p className="mt-3">주소에 계산 조건이 포함된 경우 해당 URL은 브라우저 기록, 공유 상대방 또는 호스팅 로그에 노출될 수 있습니다. 계좌번호나 개인 식별정보처럼 민감한 값은 계산기와 URL에 입력하지 마세요.</p>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-center gap-2"><TriangleAlert className="h-5 w-5 text-caution" /><h2 className="text-xl font-black text-slate-950">결과를 활용할 때 주의할 점</h2></div>
        <p className="mt-3 text-sm leading-7 text-slate-700">계산 결과는 입력한 가정이 일정하게 유지된다는 단순 시뮬레이션입니다. 실제 투자에서는 시장 변동, 세금, 수수료, 환율, 상품 구조와 거래 시점에 따라 결과가 달라질 수 있습니다. 결과는 투자 결정을 대신하는 정답이 아니라 여러 조건을 비교하기 위한 참고자료로 활용하세요.</p>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
        <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-brand" /><h2 className="text-xl font-black text-slate-950">오류 제보와 문의</h2></div>
        <p className="mt-3 text-sm leading-6 text-slate-700">계산 결과가 예상과 다르거나 설명 수정이 필요한 부분을 발견했다면 입력한 조건과 확인한 내용을 함께 보내주세요. 개인별 투자 판단이나 종목 추천 요청에는 답변하지 않습니다.</p>
        <Link href="/contact" className="mt-4 inline-flex min-h-10 items-center rounded-xl bg-navy px-4 text-sm font-bold text-white transition hover:bg-slate-800">문의 페이지로 이동</Link>
      </section>

      <section className="rounded-xl border border-red-100 bg-red-50 p-4">
        <p className="mb-3 text-sm text-slate-700">아래 버튼을 누르면 투자실험실이 이 브라우저에 저장한 모든 계산기 조건을 삭제합니다.</p>
        <StorageManager />
      </section>
    </StaticPage>
  );
}
