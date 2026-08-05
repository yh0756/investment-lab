import { GoalAssetCalculator } from "@/components/calculators/goal-asset-calculator";
import { JsonLd } from "@/components/json-ld";
export const metadata={title:"목표 자산 역산 계산기",description:"목표 자산 달성에 필요한 월 투자금, 수익률 또는 투자 기간을 계산하세요."};
export default function Page(){return <><JsonLd name="목표 자산 역산 계산기" description="목표자산 달성 조건 역산"/><GoalAssetCalculator/></>}
