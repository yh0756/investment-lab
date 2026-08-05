import { StaticPage } from "@/components/static-page";
export const metadata={title:"개인정보처리방침"};
export default function Page(){return <StaticPage title="개인정보처리방침" lead="투자실험실은 계산기 이용을 위해 이름, 이메일, 계좌정보 등 개인정보를 요구하지 않습니다."><p>계산 입력값은 이용자의 브라우저에서만 처리되며 localStorage에 저장될 수 있습니다. 별도 서버 데이터베이스로 전송하거나 저장하지 않습니다.</p><p>이용자는 브라우저의 사이트 데이터 삭제 기능을 통해 저장된 값을 언제든 삭제할 수 있습니다.</p></StaticPage>}
