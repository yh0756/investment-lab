import { Activity, ChartNoAxesCombined, Goal, PieChart, RefreshCcw, TrendingUp } from "lucide-react";

export const calculators = [
  { href: "/calculators/leverage-etf", name: "레버리지 ETF 변동성 손실 계산기", description: "같은 지수 수익률이라도 등락 경로에 따라 레버리지 ETF 결과가 어떻게 달라지는지 확인합니다.", tag: "ETF 구조", icon: Activity },
  { href: "/calculators/dividend-growth", name: "배당성장 ETF 역전 시점 계산기", description: "고배당 ETF와 배당성장 ETF의 연간 배당금과 누적 자산이 언제 역전되는지 비교합니다.", tag: "배당 투자", icon: TrendingUp },
  { href: "/calculators/loss-recovery", name: "투자 손실 회복 계산기", description: "현재 손실을 회복하기 위해 필요한 상승률과 추가 투자 효과를 계산합니다.", tag: "위험 관리", icon: RefreshCcw },
  { href: "/calculators/portfolio-rebalancing", name: "포트폴리오 리밸런싱 계산기", description: "현재 자산 비중과 목표 비중을 비교하여 필요한 매수·매도 금액을 계산합니다.", tag: "자산 배분", icon: PieChart },
  { href: "/calculators/goal-asset", name: "목표 자산 역산 계산기", description: "목표 자산을 달성하기 위해 필요한 월 투자금, 수익률 또는 투자 기간을 역산합니다.", tag: "장기 계획", icon: Goal },
  { href: "/calculators/share-buyback", name: "자사주매입 효과 계산기", description: "자사주매입과 주식 수 감소가 EPS에 미치는 영향을 분리하여 확인합니다.", tag: "기업 분석", icon: ChartNoAxesCombined }
];
