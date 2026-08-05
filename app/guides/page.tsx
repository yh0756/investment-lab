import { StaticPage } from "@/components/static-page";
export const metadata={title:"투자 기초"};
export default function Page(){return <StaticPage title="투자 기초" lead="계산 결과를 해석할 때 알아두면 좋은 핵심 개념입니다."><section><h2 className="text-xl font-bold">복리와 경로 효과</h2><p>같은 평균 수익률이라도 상승과 하락의 순서에 따라 최종 자산은 달라질 수 있습니다. 특히 레버리지 상품은 매 기간 목표 배수를 다시 맞추기 때문에 경로의 영향을 크게 받습니다.</p></section><section><h2 className="text-xl font-bold">수익률 가정은 범위로 보기</h2><p>한 개의 기대수익률만 믿기보다 보수적·기준·낙관적 시나리오를 함께 비교하는 것이 좋습니다.</p></section></StaticPage>}
