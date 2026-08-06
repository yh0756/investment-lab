import Link from "next/link";

export const metadata = {
  title: "개인정보처리방침",
  description: "투자실험실의 브라우저 저장, 접속정보, 이메일 문의 및 광고 서비스 처리 기준을 안내합니다."
};

const updatedAt = "2026년 8월 6일";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header>
        <p className="text-sm font-bold text-blue-700">투자실험실 운영 정책</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">개인정보처리방침</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          투자실험실은 회원가입 없이 이용할 수 있습니다. 계산기에 입력한 값은 브라우저에서 처리되며,
          서비스 이용을 위해 개인정보 입력을 요구하지 않습니다. 이메일 문의를 보내는 경우에만 이용자가 제공한 정보를 확인합니다.
        </p>
        <p className="mt-3 text-sm text-slate-500">시행일 및 최종 업데이트: {updatedAt}</p>
      </header>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          ["회원가입 없음", "이름·비밀번호·계좌번호를 요구하지 않습니다."],
          ["브라우저 내 계산", "계산 조건은 이용 중인 브라우저에만 저장됩니다."],
          ["이메일 문의", "문의에 필요한 정보만 확인하고 답변 목적으로 사용합니다."]
        ].map(([title, body]) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="font-bold text-slate-950">{title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-8 rounded-3xl border border-slate-200 bg-white p-6 leading-7 text-slate-700 shadow-sm sm:p-8">
        <section>
          <h2 className="text-xl font-black text-slate-950">1. 처리되는 정보와 이용 목적</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-y border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-4 py-3">구분</th>
                  <th className="px-4 py-3">처리 내용</th>
                  <th className="px-4 py-3">이용 목적·보관</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-4 font-bold text-slate-900">계산기 입력값</td>
                  <td className="px-4 py-4">투자금, 수익률, 기간, 목표 비중 등 이용자가 입력한 조건</td>
                  <td className="px-4 py-4">
                    최근 조건 복원을 위해 브라우저 localStorage에 저장됩니다. 운영자 서버로 전송되지 않으며,
                    이용자가 삭제하거나 브라우저 데이터를 정리할 때까지 해당 기기에 남을 수 있습니다.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-bold text-slate-900">접속 기술정보</td>
                  <td className="px-4 py-4">IP 주소, 브라우저·기기 정보, 접속 시각, 요청 주소, 오류·보안 기록</td>
                  <td className="px-4 py-4">
                    사이트 제공, 장애 대응 및 보안을 위해 호스팅 사업자가 자동 처리할 수 있습니다.
                    보관 범위와 기간은 해당 사업자의 서비스 설정과 정책을 따릅니다.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-bold text-slate-900">이메일 문의정보</td>
                  <td className="px-4 py-4">보낸 사람의 이메일 주소, 문의 내용 및 이용자가 첨부한 자료</td>
                  <td className="px-4 py-4">
                    문의 확인과 답변을 위해 사용하며, 답변과 후속 대응이 끝난 뒤 최대 1년 이내 삭제합니다.
                    법령상 보관이 필요한 경우에는 해당 기간 동안 보관할 수 있습니다.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-500">
            계좌번호, 비밀번호, 주민등록번호, 카드번호 등 서비스 이용에 필요하지 않은 정보는 계산기나 문의 메일에 입력하지 마세요.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">2. 브라우저 저장과 삭제</h2>
          <p className="mt-3">
            계산 조건 자동 저장에는 브라우저의 <strong>localStorage</strong>를 사용합니다. 이는 회원 계정이나 별도 계산 데이터베이스에
            저장되는 정보가 아닙니다. 저장된 계산 조건은 <Link href="/about" className="font-bold text-blue-700 underline underline-offset-4">이용 안내</Link>의
            ‘저장된 데이터 전체 삭제’ 기능 또는 브라우저의 사이트 데이터 삭제 기능으로 제거할 수 있습니다.
          </p>
          <p className="mt-3">
            계산 조건이 포함된 주소를 직접 공유하는 경우 해당 값이 브라우저 기록이나 공유 상대방에게 노출될 수 있으므로,
            개인을 식별할 수 있는 정보는 입력하지 마세요.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">3. 외부 서비스</h2>
          <p className="mt-3">
            사이트 운영과 이메일 문의 처리를 위해 아래 외부 서비스를 사용합니다. 이 과정에서 정보가 대한민국 외 지역의 서버를 통해 처리될 수 있으며,
            구체적인 처리 기준은 각 서비스 제공자의 정책을 따릅니다.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[840px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-y border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-4 py-3">서비스</th>
                  <th className="px-4 py-3">처리 지역·시점</th>
                  <th className="px-4 py-3">처리 정보</th>
                  <th className="px-4 py-3">목적·보관</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-4 font-bold text-slate-900">Vercel</td>
                  <td className="px-4 py-4">미국을 포함한 서비스 제공 지역 / 사이트 접속 시 네트워크 전송</td>
                  <td className="px-4 py-4">접속 기술정보와 요청 기록</td>
                  <td className="px-4 py-4">호스팅, 전송, 장애 대응 및 보안 / 서비스 설정과 제공자 정책에 따른 기간</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-bold text-slate-900">Google Gmail</td>
                  <td className="px-4 py-4">미국을 포함한 서비스 제공 지역 / 이메일 발송 시 네트워크 전송</td>
                  <td className="px-4 py-4">이메일 주소, 문의 내용 및 첨부자료</td>
                  <td className="px-4 py-4">문의 수신·보관·답변 / 문의 종료 후 최대 1년 이내</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-bold text-slate-900">Google AdSense</td>
                  <td className="px-4 py-4">미국을 포함한 서비스 제공 지역 / 사이트 접속 및 광고 노출 시</td>
                  <td className="px-4 py-4">IP 주소, 쿠키·기기 식별정보, 방문 페이지 및 광고 상호작용 정보</td>
                  <td className="px-4 py-4">광고 제공, 빈도 제한, 부정 이용 방지 및 성과 측정 / Google 정책에 따른 기간</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold">
            <a href="https://vercel.com/legal/privacy-notice" target="_blank" rel="noreferrer" className="text-blue-700 underline underline-offset-4">Vercel 개인정보 보호 안내</a>
            <a href="https://policies.google.com/privacy?hl=ko" target="_blank" rel="noreferrer" className="text-blue-700 underline underline-offset-4">Google 개인정보처리방침</a>
            <a href="https://adssettings.google.com/" target="_blank" rel="noreferrer" className="text-blue-700 underline underline-offset-4">Google 광고 설정</a>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">4. 쿠키와 광고</h2>
          <p className="mt-3">
            투자실험실은 광고 제공을 위해 Google AdSense를 사용합니다. Google과 제3자 광고 제공업체는 쿠키 또는 유사한 기술을 사용하여
            광고를 제공하고, 광고 노출 빈도를 조절하며, 부정 이용을 방지하고 광고 성과를 측정할 수 있습니다.
          </p>
          <p className="mt-3">
            이용자는 <a href="https://adssettings.google.com/" target="_blank" rel="noreferrer" className="font-bold text-blue-700 underline underline-offset-4">Google 광고 설정</a>에서
            개인 맞춤 광고 설정을 관리할 수 있습니다. 관련 법령에 따라 동의가 필요한 지역에서는 동의 여부에 따라 개인 맞춤 또는 비개인 맞춤 광고가 제공될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">5. 이용자의 권리와 문의</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>브라우저에 저장된 계산 조건은 언제든 수정하거나 삭제할 수 있습니다.</li>
            <li>이메일로 제공한 개인정보의 열람·정정·삭제를 요청할 수 있습니다.</li>
            <li>공유한 주소나 외부 서비스에 남은 정보는 해당 서비스에서 별도로 삭제해야 할 수 있습니다.</li>
          </ul>
          <p className="mt-4">
            개인정보 보호 담당은 투자실험실 운영자이며, 열람·정정·삭제 또는 개인정보 관련 문의는
            <a href="mailto:investcalc.help@gmail.com" className="ml-1 font-bold text-blue-700 underline underline-offset-4">investcalc.help@gmail.com</a>으로 보내주세요.
            확인이 끝난 전자파일은 메일함과 휴지통에서 삭제합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-950">6. 안전성 확보와 방침 변경</h2>
          <p className="mt-3">
            운영자는 계산 입력값의 서버 전송을 최소화하고 HTTPS가 적용된 호스팅 환경을 사용합니다. 서비스 기능, 외부 서비스 또는 관련 법령이 변경되면
            실제 운영 내용에 맞춰 본 방침을 수정하고 페이지 상단의 업데이트 날짜를 변경합니다.
          </p>
        </section>
      </div>
    </main>
  );
}
