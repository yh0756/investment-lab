import { Bug, Github, Mail, MessageSquareWarning, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "문의",
  description: "투자실험실의 계산 오류, 기능 개선, 개인정보 및 정책 관련 문의 방법을 안내합니다."
};

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
const githubIssueUrl = "https://github.com/yh0756/investment-lab/issues/new";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header>
        <p className="text-sm font-bold text-blue-700">도움말 및 제보</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">문의</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          계산 결과가 이상하거나 사용 중 불편한 점을 발견했다면 아래 채널로 알려주세요. 재현에 필요한 정보를 함께 보내면 더 정확하게 확인할 수 있습니다.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {contactEmail ? (
          <a
            href={`mailto:${contactEmail}?subject=${encodeURIComponent("[투자실험실 문의]")}`}
            className="rounded-2xl border border-blue-200 bg-blue-50 p-6 transition hover:border-blue-400"
          >
            <Mail className="h-6 w-6 text-blue-700" />
            <p className="mt-4 text-lg font-black text-slate-950">이메일 문의</p>
            <p className="mt-2 break-all text-sm font-semibold text-blue-700">{contactEmail}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">개인정보·정책 문의 또는 공개하기 어려운 내용을 보낼 때 이용하세요.</p>
          </a>
        ) : (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <Mail className="h-6 w-6 text-amber-700" />
            <p className="mt-4 text-lg font-black text-slate-950">이메일 채널 준비 중</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              운영 이메일이 연결되기 전에는 아래 GitHub 오류 제보 채널을 이용해 주세요. 개인정보가 포함된 내용은 공개 이슈에 작성하지 마세요.
            </p>
          </div>
        )}

        <a
          href={githubIssueUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-slate-400"
        >
          <Github className="h-6 w-6 text-slate-800" />
          <p className="mt-4 text-lg font-black text-slate-950">오류·기능 제보</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">GitHub 이슈에서 계산 오류, 화면 깨짐, 기능 개선 의견을 공개적으로 남길 수 있습니다.</p>
        </a>
      </div>

      <div className="mt-8 space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <section>
          <div className="flex items-center gap-3">
            <Bug className="h-6 w-6 text-blue-700" />
            <h2 className="text-xl font-black text-slate-950">오류 제보에 포함하면 좋은 내용</h2>
          </div>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-slate-700">
            <li>사용한 계산기 이름과 페이지 주소</li>
            <li>입력한 값과 예상했던 결과</li>
            <li>실제로 표시된 결과 또는 오류 메시지</li>
            <li>사용 기기와 브라우저 종류</li>
            <li>가능한 경우 개인정보를 가린 화면 캡처</li>
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-emerald-700" />
            <h2 className="text-xl font-black text-slate-950">보내지 말아야 할 정보</h2>
          </div>
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-900">
            계좌번호, 증권사 로그인 정보, 비밀번호, 주민등록번호, 카드번호, 신분증, 실제 거래내역 원본처럼 개인을 식별하거나 금융 피해로 이어질 수 있는 정보는 보내지 마세요.
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3">
            <MessageSquareWarning className="h-6 w-6 text-amber-700" />
            <h2 className="text-xl font-black text-slate-950">문의 처리 기준</h2>
          </div>
          <p className="mt-4 leading-7 text-slate-700">
            접수된 내용은 서비스 오류 확인과 개선을 위해 검토합니다. 모든 제안의 반영이나 개별 답변을 보장하지는 않지만,
            계산 오류·보안 문제·개인정보 관련 요청은 우선적으로 확인합니다. 투자 종목 추천이나 개인별 세금 상담은 제공하지 않습니다.
          </p>
        </section>
      </div>

      {!contactEmail && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
          <strong className="text-slate-900">운영자 배포 설정:</strong> Vercel의 Environment Variables에
          <code className="mx-1 rounded bg-white px-1.5 py-0.5">NEXT_PUBLIC_CONTACT_EMAIL</code>을 추가하고 재배포하면 이메일 문의 버튼이 자동으로 활성화됩니다.
        </div>
      )}
    </main>
  );
}
