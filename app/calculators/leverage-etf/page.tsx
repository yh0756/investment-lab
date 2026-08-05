import { LeverageCalculator } from "@/components/calculators/leverage-calculator";
import { JsonLd } from "@/components/json-ld";
export const metadata={title:"레버리지 ETF 변동성 손실 계산기 | 2배·3배 ETF 수익률 시뮬레이션",description:"지수의 상승과 하락 경로에 따라 2배·3배 레버리지 ETF의 장기 수익률이 어떻게 달라지는지 직접 계산해보세요."};
export default function Page(){return <><JsonLd name="레버리지 ETF 변동성 손실 계산기" description="2배·3배 ETF 경로 효과 시뮬레이션"/><LeverageCalculator/></>}
