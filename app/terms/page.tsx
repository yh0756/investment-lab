import Link from "next/link";

export const metadata = {
  title: "이용약관 및 면책 안내",
  description: "투자실험실의 서비스 이용 조건과 계산 결과의 한계를 안내합니다."
};

const updatedAt = "2026년 8월 6일";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header>
        <p className="text-sm font-bold text-blue-700">투자실험실 운영 정책</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">이용약관 및 면책 안내</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          투자실험실은 사용자가 입력한 조건을 바탕으로 투자 시나리오를 비교하는 교육용 계산 서비스입니다.
          실제 투자 주문이나 개인별 투자·세무·법률 자문을 제공하지 않습니다.
        </p>
        <p className="mt-3 text-sm text-slate-500">시행일 및 최종 업데이트: {updatedAt}</p>
      </header>

      <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="font-black text-red-950">계산 결과를 이용하기 전에 확인하세요</p>
        <p className="mt-2 leading-7 text-red-900">
          계산 결과는 입력한 가정에 따른 시뮬레이션이며 실제 수익이나 손실을 보장하지 않습니다.
          투자 전에는 상품 설명서, 세금, 수수료, 환율과 본인의 재무 상황을 별도로 확인해야 합니다.
        </p>
      </div>

      <div className="mt-8 space-y-8 rounded-3xl border border-slate-200 bg-white p-6 leading-7 text-slate-700 shadow-sm sm:p-8">
        <section>
          <h2 className="text-xl font-black text-slate-950">1. 서비스 안내</h2>
          <p className="mt-3">
            투자실험실은 레버리지 ETF, 배당성장 ETF, 투자 손실 회복, 포트폴리오 리밸런싱, 목표 자산 및 자사주매입 관련 계산기와
            계산 기준·개념 설명을 제공합니다. 회원가입 없이 이용할 수 있으며, 기능과 화면은 운영 과정에서 변경될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">2. 계산 결과의 한계</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>결과는 이용자가 입력한 숫자와 사이트에 적용된 계산식에 따라 산출됩니다.</li>
            <li>실시간 시세, 상품별 추적오차, 시장 유동성, 모든 세금·수수료와 개인별 상황을 반영하지 않을 수 있습니다.</li>
            <li>수익률, 배당성장률, 주가상승률 등 입력한 가정은 실제 시장에서 일정하게 유지되지 않을 수 있습니다.</li>
            <li>차트와 설명은 이해를 돕기 위한 요약이므로 입력값과 계산 가정을 함께 확인해야 합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">3. 투자 자문이 아닙니다</h2>
          <p className="mt-3">
            투자실험실은 특정 상품이나 종목의 매수·매도·보유를 권유하지 않습니다. 세금과 법률 관련 내용도 일반적인 교육 정보이며,
            중요한 의사결정은 금융회사, 세무사, 변호사 등 적절한 전문가와 최신 공식 자료를 통해 확인해야 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">4. 이용자가 확인할 사항</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>입력값과 계산 가정이 본인의 상황에 적절한지 확인해야 합니다.</li>
            <li>최종 투자 결정과 그 결과에 대한 책임은 이용자에게 있습니다.</li>
            <li>계산기, 공유 주소 또는 문의 이메일에 계좌번호·비밀번호·주민등록번호 등 민감한 정보를 입력하지 마세요.</li>
            <li>브라우저 저장값은 삭제되거나 다른 기기와 동기화되지 않을 수 있습니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">5. 서비스 이용 제한</h2>
          <p className="mt-3">
            서비스 운영을 방해하는 과도한 자동 요청, 보안 취약점 악용, 타인의 권리 침해, 계산 결과를 확정 수익이나 공식 투자 권고로 오인시키는 행위는 허용되지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">6. 서비스 변경과 외부 서비스</h2>
          <p className="mt-3">
            유지보수, 보안 대응, 호스팅 장애 또는 운영상 필요로 서비스가 변경되거나 일시 중단될 수 있습니다.
            사이트에서 연결되는 외부 서비스와 자료에는 해당 운영자의 이용약관과 개인정보 처리 기준이 적용됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">7. 콘텐츠와 책임 범위</h2>
          <p className="mt-3">
            운영자는 계산식과 콘텐츠의 정확성을 높이기 위해 노력하지만 모든 오류·누락·중단이 없음을 보장하지 않습니다.
            계산 결과만을 근거로 한 투자, 잘못된 입력값 또는 외부 서비스 이용으로 발생한 손해에 대해서는 관련 법령이 허용하는 범위에서 책임을 부담하지 않습니다.
          </p>
          <p className="mt-3">
            사이트의 브랜드, 설명문, 디자인과 자체 제작 콘텐츠는 관련 권리의 보호를 받으며, 오픈소스 코드와 제3자 자료는 각 라이선스와 출처 조건을 따릅니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">8. 정책 변경과 문의</h2>
          <p className="mt-3">
            서비스 또는 관련 법령이 변경되면 본 안내를 수정할 수 있으며, 변경 시 페이지 상단의 업데이트 날짜를 갱신합니다.
            개인정보 처리에 관한 내용은 <Link href="/privacy" className="font-bold text-blue-700 underline underline-offset-4">개인정보처리방침</Link>에서 확인할 수 있습니다.
          </p>
          <p className="mt-3">
            계산 오류, 서비스 이용 또는 정책 관련 문의는 <a href="mailto:investcalc.help@gmail.com" className="font-bold text-blue-700 underline underline-offset-4">investcalc.help@gmail.com</a>으로 보내주세요.
          </p>
        </section>
      </div>
    </main>
  );
}
