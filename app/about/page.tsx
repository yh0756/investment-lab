import { StaticPage } from "@/components/static-page";
import { StorageManager } from "@/components/storage-manager";
export const metadata={title:"이용 안내"};
export default function Page(){return <StaticPage title="이용 안내" lead="투자실험실은 사용자가 직접 입력한 가정을 바탕으로 계산하는 교육형 시뮬레이션 서비스입니다."><p>회원가입 없이 모든 계산기를 사용할 수 있습니다. 입력값은 브라우저 localStorage에 자동 저장되어 새로고침 후 복원되며 외부 서버로 전송되지 않습니다.</p><p>공유 링크에는 입력 조건이 URL 파라미터로 포함됩니다. 민감하다고 판단되는 값은 공유 전에 확인하세요.</p><div className="rounded-xl border border-red-100 bg-red-50 p-4"><p className="mb-3 text-sm text-slate-700">아래 버튼을 누르면 투자실험실이 이 브라우저에 저장한 모든 계산기 조건을 삭제합니다.</p><StorageManager/></div></StaticPage>}
