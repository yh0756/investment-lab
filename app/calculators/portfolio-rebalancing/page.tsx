import { RebalancingCalculator } from "@/components/calculators/rebalancing-calculator";
import { JsonLd } from "@/components/json-ld";
export const metadata={title:"포트폴리오 리밸런싱 계산기",description:"현재 자산 비중과 목표 비중을 비교해 필요한 매수·매도 금액을 계산하세요."};
export default function Page(){return <><JsonLd name="포트폴리오 리밸런싱 계산기" description="목표 비중별 매수·매도 금액 계산" path="/calculators/portfolio-rebalancing"/><RebalancingCalculator/></>}
