import { LossRecoveryCalculator } from "@/components/calculators/loss-recovery-calculator";
import { JsonLd } from "@/components/json-ld";
export const metadata={title:"투자 손실 회복 계산기",description:"손실률별 원금 회복 필요 상승률과 추가 투자·월 적립식 투자 효과를 계산하세요."};
export default function Page(){return <><JsonLd name="투자 손실 회복 계산기" description="원금 회복 필요 상승률과 기간 계산" path="/calculators/loss-recovery"/><LossRecoveryCalculator/></>}
