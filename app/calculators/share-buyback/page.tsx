import { BuybackCalculator } from "@/components/calculators/buyback-calculator";
import { JsonLd } from "@/components/json-ld";
export const metadata={title:"자사주매입 효과 계산기 | EPS·주식 수 감소 분석",description:"자사주매입과 신규 주식 발행이 EPS와 순주식 수 감소율에 미치는 영향을 계산하세요."};
export default function Page(){return <><JsonLd name="자사주매입 효과 계산기" description="자사주매입의 EPS 효과 분해"/><BuybackCalculator/></>}
