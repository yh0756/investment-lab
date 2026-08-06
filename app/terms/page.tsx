export const metadata = {
  title: "이용약관 및 면책 안내",
  description: "투자실험실의 서비스 이용 조건, 계산 결과의 성격, 이용자 책임 및 책임 제한 범위를 안내합니다."
};

const updatedAt = "2026년 8월 6일";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header>
        <p className="text-sm font-bold text-blue-700">투자실험실 운영 정책</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">이용약관 및 면책 안내</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          투자실험실은 사용자가 직접 입력한 조건으로 결과를 비교하는 교육용 시뮬레이션 서비스입니다.
          실제 투자 주문, 투자자문, 세무·법률 상담을 제공하지 않습니다.
        </p>
        <p className="mt-3 text-sm text-slate-500">시행일 및 최종 업데이트: {updatedAt}</p>
      </header>

      <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="font-black text-red-950">핵심 면책 안내</p>
        <p className="mt-2 leading-7 text-red-900">
          계산 결과는 입력한 가정에 따른 예시이며 미래 수익이나 손실을 보장하지 않습니다. 실제 투자 전에는 상품 설명서, 세금,
          수수료, 환율, 거래 가능 여부와 본인의 재무 상황을 별도로 확인해야 합니다.
        </p>
      </div>

      <div className="mt-8 space-y-8 rounded-3xl border border-slate-200 bg-white p-6 leading-7 text-slate-700 shadow-sm sm:p-8">
        <section>
          <h2 className="text-xl font-black text-slate-950">제1조 목적과 적용</h2>
          <p className="mt-3">
            본 약관은 투자실험실 운영자와 이용자 사이의 서비스 이용 조건, 권리·의무 및 책임 범위를 정합니다. 이용자가 사이트를 이용하면 본 약관과
            <Link href="/privacy" className="font-bold text-blue-700 underline underline-offset-4"> 개인정보처리방침</Link>의 적용을 받습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">제2조 제공 서비스</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>레버리지 ETF, 배당성장 ETF, 손실 회복, 포트폴리오 리밸런싱, 목표 자산 및 자사주매입 관련 계산기</li>
            <li>계산 기준, 공식, 예시 및 투자 개념을 설명하는 교육 콘텐츠</li>
            <li>브라우저 저장소를 이용한 최근 계산 조건 복원</li>
          </ul>
          <p className="mt-3">서비스는 회원가입 없이 무료로 제공될 수 있으며, 운영 여건에 따라 기능·화면·제공 범위가 변경될 수 있습니다.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">제3조 계산 결과의 성격</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>결과는 이용자가 입력한 숫자와 고정된 계산식에 따른 단순 시뮬레이션입니다.</li>
            <li>실시간 시세, 기업 공시, 상품별 실제 추적오차, 유동성, 세부 과세 규정 및 개인별 세무 상황을 모두 반영하지 않습니다.</li>
            <li>수익률·배당성장률·주가상승률 등이 일정하게 유지된다는 가정은 실제 시장과 다를 수 있습니다.</li>
            <li>차트와 설명 문구는 이해를 돕기 위한 요약이며, 원본 입력값과 계산 가정을 함께 확인해야 합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">제4조 투자·세무·법률 자문이 아님</h2>
          <p className="mt-3">
            투자실험실은 특정 금융상품이나 종목의 매수·매도·보유를 권유하지 않으며, 개인의 투자성향에 맞춘 자문을 제공하지 않습니다.
            세금 및 법률 관련 설명은 일반적인 교육 정보이므로, 중요한 의사결정은 금융회사·세무사·변호사 등 적절한 전문가와 확인해야 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">제5조 이용자의 책임</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>입력값과 계산 가정의 적절성을 확인할 책임은 이용자에게 있습니다.</li>
            <li>최종 투자 결정 및 그 결과에 대한 책임은 이용자에게 있습니다.</li>
            <li>공유 주소나 문의 이메일에 계좌번호·비밀번호·주민등록번호 등 민감한 정보를 작성하지 않아야 합니다.</li>
            <li>브라우저 저장값이 삭제되거나 기기 간 동기화되지 않을 수 있으므로 중요한 자료는 별도로 기록해야 합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">제6조 금지 행위</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>서비스의 정상 운영을 방해하거나 과도한 자동 요청을 보내는 행위</li>
            <li>보안 취약점을 악용하거나 다른 이용자·운영자의 권리를 침해하는 행위</li>
            <li>서비스의 콘텐츠·코드를 관련 법령이나 라이선스에 위반하여 복제·배포하는 행위</li>
            <li>계산 결과를 확정 수익, 공식 투자 권고 또는 보장된 자료인 것처럼 오인시키는 행위</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">제7조 서비스 변경과 중단</h2>
          <p className="mt-3">
            유지보수, 보안 대응, 호스팅 장애, 법령 변경 또는 운영상 필요로 서비스의 일부 또는 전부가 일시 중단되거나 변경될 수 있습니다.
            가능한 경우 사전에 안내하지만 긴급한 보안·장애 상황에서는 사후 안내할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">제8조 외부 서비스와 링크</h2>
          <p className="mt-3">
            사이트에는 금융기관, 공공기관, Google, Vercel 등 외부 사이트로 연결되는 링크가 포함될 수 있습니다.
            외부 서비스의 내용, 이용 가능성 및 개인정보 처리에 대해서는 해당 운영자의 정책이 적용됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">제9조 책임의 제한</h2>
          <p className="mt-3">
            운영자는 계산식과 콘텐츠의 정확성을 높이기 위해 합리적으로 노력하지만, 모든 오류·누락·중단이 없음을 보장하지 않습니다.
            이용자가 계산 결과만을 근거로 투자하거나 입력값을 잘못 설정하여 발생한 손해에 대해 운영자는 관련 법령이 허용하는 범위에서 책임을 부담하지 않습니다.
          </p>
          <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            다만 운영자의 고의 또는 중대한 과실로 발생한 손해, 또는 관련 법령상 제한하거나 배제할 수 없는 책임까지 면제하는 것은 아닙니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">제10조 콘텐츠와 지식재산권</h2>
          <p className="mt-3">
            별도 표시가 없는 한 사이트의 브랜드, 설명문, 디자인 및 자체 제작 콘텐츠에 관한 권리는 운영자에게 있습니다.
            오픈소스 코드와 제3자 자료는 각각의 라이선스와 출처 조건을 따릅니다. 개인적인 학습과 검토 범위를 넘어 복제·재배포하려면 사전 확인이 필요합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">제11조 약관 변경과 준거법</h2>
          <p className="mt-3">
            서비스 기능이나 관련 법령의 변경에 따라 약관을 수정할 수 있으며, 중요한 변경은 시행일을 갱신하여 안내합니다.
            본 약관은 대한민국 법령에 따라 해석하며 분쟁이 발생할 경우 관계 법령이 정한 절차와 관할에 따릅니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">제12조 문의</h2>
          <p className="mt-3">
            계산 오류, 서비스 이용 또는 정책 관련 문의는 <a href="mailto:investcalc.help@gmail.com" className="font-bold text-blue-700 underline underline-offset-4">investcalc.help@gmail.com</a>으로 보내주세요.
          </p>
        </section>
      </div>
    </main>
  );
}
