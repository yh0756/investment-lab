import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-500 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row">
          <div><p className="font-bold text-slate-800">투자실험실</p><p className="mt-1">숫자로 미리 보는 투자 시나리오</p></div>
          <div className="flex flex-wrap gap-4"><Link href="/privacy">개인정보처리방침</Link><Link href="/terms">이용약관·면책</Link><Link href="/contact">문의</Link></div>
        </div>
        <p className="mt-6 max-w-4xl leading-6">모든 계산은 브라우저에서 처리되며 입력 정보는 외부 서버로 전송되지 않습니다. 계산 결과는 교육용 시뮬레이션으로 실제 투자 성과를 보장하지 않습니다.</p>
      </div>
    </footer>
  );
}
