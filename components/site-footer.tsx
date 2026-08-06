import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-500 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row">
          <div>
            <p className="font-bold text-slate-800">투자실험실</p>
            <p className="mt-1">숫자로 미리 보는 투자 시나리오</p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 font-semibold">
            <Link href="/privacy" className="hover:text-slate-900">개인정보처리방침</Link>
            <Link href="/terms" className="hover:text-slate-900">이용약관·면책</Link>
            <Link href="/contact" className="hover:text-slate-900">문의</Link>
          </div>
        </div>
        <p className="mt-6 max-w-4xl leading-6">
          계산 입력값은 브라우저에서 처리되며 별도의 회원 데이터베이스를 운영하지 않습니다. 계산 결과는 입력한 가정에 따른 교육용 시뮬레이션으로 실제 투자 성과를 보장하지 않습니다.
        </p>
        <p className="mt-2 text-xs text-slate-400">© {new Date().getFullYear()} 투자실험실. All rights reserved.</p>
      </div>
    </footer>
  );
}
