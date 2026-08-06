import { StaticPage } from "@/components/static-page";
import { StorageManager } from "@/components/storage-manager";

export const metadata = { title: "이용 안내" };

export default function Page() {
  return (
    <StaticPage
      title="이용 안내"
      lead="투자실험실은 사용자가 직접 입력한 가정을 바탕으로 계산하는 교육형 시뮬레이션 서비스입니다."
    >
      <p>
        회원가입 없이 모든 계산기를 사용할 수 있습니다. 입력값은 원칙적으로 브라우저에서 계산되며, 최근 조건 복원을 위해 localStorage에 자동 저장될 수 있습니다.
        별도의 회원 계정이나 계산 데이터베이스는 운영하지 않습니다.
      </p>
      <p>
        주소에 계산 조건이 포함된 경우 해당 URL은 브라우저 기록, 공유 상대방 또는 호스팅 로그에 노출될 수 있습니다. 계좌번호나 개인 식별정보처럼 민감한 값은 계산기와 URL에 입력하지 마세요.
      </p>
      <div className="rounded-xl border border-red-100 bg-red-50 p-4">
        <p className="mb-3 text-sm text-slate-700">아래 버튼을 누르면 투자실험실이 이 브라우저에 저장한 모든 계산기 조건을 삭제합니다.</p>
        <StorageManager />
      </div>
    </StaticPage>
  );
}
