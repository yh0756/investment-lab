import Link from "next/link";

export const metadata = {
  title: "개인정보처리방침",
  description: "투자실험실의 브라우저 저장소, 접속 기록, 문의 정보 및 광고·쿠키 처리 기준을 안내합니다."
};

const updatedAt = "2026년 8월 6일";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header>
        <p className="text-sm font-bold text-blue-700">투자실험실 운영 정책</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">개인정보처리방침</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          투자실험실은 회원가입 없이 이용할 수 있으며, 계산기에 입력한 값은 원칙적으로 이용자의 브라우저 안에서 처리됩니다.
          아래에서 실제로 저장되거나 자동 처리될 수 있는 정보를 투명하게 안내합니다.
        </p>
        <p className="mt-3 text-sm text-slate-500">시행일 및 최종 업데이트: {updatedAt}</p>
      </header>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          ["회원가입 없음", "이름·비밀번호·계좌번호를 요구하지 않습니다."],
          ["브라우저 내 계산", "계산 조건은 localStorage에 저장될 수 있습니다."],
          ["직접 삭제 가능", "이용 안내 페이지에서 저장값을 한 번에 삭제할 수 있습니다."]
        ].map(([title, body]) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="font-bold text-slate-950">{title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-8 rounded-3xl border border-slate-200 bg-white p-6 leading-7 text-slate-700 shadow-sm sm:p-8">
        <section>
          <h2 className="text-xl font-black text-slate-950">1. 적용 범위와 운영자</h2>
          <p className="mt-3">
            본 방침은 투자실험실 웹사이트에서 제공하는 투자 계산기, 계산 기준·개념 페이지 및 관련 안내 페이지에 적용됩니다.
            서비스 운영 주체는 <strong>투자실험실 운영자</strong>이며, 개인정보 관련 문의는
            <a href="mailto:investcalc.help@gmail.com" className="ml-1 font-bold text-blue-700 underline underline-offset-4">investcalc.help@gmail.com</a>으로 접수할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">2. 처리될 수 있는 정보</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-y border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-4 py-3">구분</th>
                  <th className="px-4 py-3">내용</th>
                  <th className="px-4 py-3">목적·보관</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-4 font-bold text-slate-900">계산기 입력값</td>
                  <td className="px-4 py-4">투자금, 수익률, 기간, 목표 비중 등 이용자가 직접 입력한 조건</td>
                  <td className="px-4 py-4">최근 조건 복원을 위해 브라우저 localStorage에 저장되며, 이용자가 삭제할 때까지 해당 브라우저에 남을 수 있습니다.</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-bold text-slate-900">URL 조건값</td>
                  <td className="px-4 py-4">주소에 <code className="rounded bg-slate-100 px-1.5 py-0.5">?s=</code> 형태로 포함된 계산 조건</td>
                  <td className="px-4 py-4">조건 복원에 사용됩니다. URL은 브라우저 기록, 공유 상대방, 호스팅·보안 로그에 노출될 수 있으므로 민감한 정보를 입력하지 마세요.</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-bold text-slate-900">접속 기술정보</td>
                  <td className="px-4 py-4">IP 주소, 브라우저·기기 정보, 접속 시각, 요청 주소, 오류·보안 로그 등</td>
                  <td className="px-4 py-4">서비스 제공, 장애 대응 및 보안을 위해 호스팅·전송 사업자가 자동 처리할 수 있으며 보관기간은 해당 사업자의 정책과 관련 법령에 따릅니다.</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-bold text-slate-900">문의 정보</td>
                  <td className="px-4 py-4">보낸 사람의 이메일 주소, 문의 내용과 첨부자료 등 이용자가 자발적으로 제공한 정보</td>
                  <td className="px-4 py-4">문의 확인과 답변을 위해 처리하며, 문의 처리 완료 후 불필요해진 정보는 합리적인 기간 내 삭제합니다.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-500">
            투자실험실은 계산기 이용을 위해 주민등록번호, 계좌번호, 카드번호, 비밀번호와 같은 민감한 식별정보를 요구하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">3. localStorage와 쿠키</h2>
          <p className="mt-3">
            계산 조건 자동 저장에는 브라우저의 <strong>localStorage</strong>를 사용합니다. 이는 서버 계정에 저장되는 정보가 아니며,
            브라우저별로 관리됩니다. 저장값은 <Link href="/about" className="font-bold text-blue-700 underline underline-offset-4">이용 안내</Link>의
            ‘저장된 데이터 전체 삭제’ 기능 또는 브라우저의 사이트 데이터 삭제 기능으로 제거할 수 있습니다.
          </p>
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="font-bold text-amber-950">광고·분석 도구가 추가되는 경우</p>
            <p className="mt-2 text-sm leading-6 text-amber-900">
              현재 프로젝트 코드에는 운영자가 직접 설치한 방문 분석 도구나 광고 쿠키가 포함되어 있지 않습니다. 향후 Google AdSense 등 광고 서비스가 활성화되면
              Google 및 광고 파트너가 광고 게재, 빈도 제한, 부정 사용 방지 및 맞춤 광고를 위해 쿠키나 유사 기술을 사용할 수 있습니다.
              이 경우 필요한 지역에는 동의 관리 절차를 제공하고 본 방침을 업데이트합니다.
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm font-bold">
              <a href="https://policies.google.com/technologies/ads?hl=ko" target="_blank" rel="noreferrer" className="text-blue-700 underline underline-offset-4">Google 광고 기술 안내</a>
              <a href="https://myadcenter.google.com/" target="_blank" rel="noreferrer" className="text-blue-700 underline underline-offset-4">광고 설정 관리</a>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">4. 외부 서비스와 국외 처리 가능성</h2>
          <p className="mt-3">
            사이트 제공을 위해 Vercel 등 클라우드 호스팅·콘텐츠 전송 서비스를 이용할 수 있습니다. 페이지 요청 과정에서 접속 기술정보가
            대한민국 외 지역의 서버 또는 하위 처리업체를 통해 처리될 수 있습니다. 해당 사업자의 구체적인 처리 방식과 보관 기준은 각 사업자의 정책을 따릅니다.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold">
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer" className="text-blue-700 underline underline-offset-4">Vercel 개인정보 보호정책</a>
            <a href="https://vercel.com/legal/dpa" target="_blank" rel="noreferrer" className="text-blue-700 underline underline-offset-4">Vercel 데이터 처리 안내</a>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">5. 이용자의 권리와 삭제 방법</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>계산기 입력값은 언제든 수정하거나 브라우저에서 삭제할 수 있습니다.</li>
            <li>문의로 제공한 개인정보의 열람·정정·삭제를 요청할 수 있습니다.</li>
            <li>브라우저 설정에서 쿠키, 사이트 데이터 및 추적 방지 설정을 관리할 수 있습니다.</li>
            <li>다른 사람과 공유한 URL이나 공개 게시물은 상대방 또는 외부 서비스에 별도로 남을 수 있으므로 직접 삭제 요청이 필요할 수 있습니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">6. 아동의 개인정보</h2>
          <p className="mt-3">
            투자실험실은 만 14세 미만 아동을 대상으로 개인정보를 의도적으로 수집하지 않습니다. 문의 과정에서도 보호가 필요한 개인정보를 작성하지 않도록 안내합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">7. 안전성 확보와 방침 변경</h2>
          <p className="mt-3">
            입력값의 서버 전송을 최소화하고, HTTPS를 사용하는 호스팅 환경에서 서비스를 제공합니다. 서비스 기능, 사용 도구 또는 관련 법령이 변경되면
            본 방침을 수정할 수 있으며 중요한 변경은 페이지 상단의 시행일을 갱신해 안내합니다.
          </p>
        </section>
      </div>
    </main>
  );
}
