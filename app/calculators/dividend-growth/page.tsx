import { DividendGrowthCalculator } from "@/components/calculators/dividend-growth-calculator";
import { JsonLd } from "@/components/json-ld";
export const metadata={title:"배당성장 ETF 역전 시점 계산기",description:"고배당 ETF와 배당성장 ETF의 연간 배당금, 누적 배당금, 총자산 역전 시점을 비교하세요."};
export default function Page(){return <><JsonLd name="배당성장 ETF 역전 시점 계산기" description="고배당 ETF와 배당성장 ETF 비교"/><DividendGrowthCalculator/></>}
