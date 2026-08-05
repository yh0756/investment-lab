"use client";

import { useMemo } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalculatorActions } from "@/components/calculator-actions";
import { CalculatorShell } from "@/components/calculator-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NumberField } from "@/components/number-field";
import { MetricCard } from "@/components/metric-card";
import { ChartCard } from "@/components/chart-card";
import { ResultMessage } from "@/components/result-message";
import { DataTable } from "@/components/data-table";
import { useScenarioState } from "@/lib/hooks/use-scenario-state";
import { calculateDividendGrowth } from "@/lib/calculations/dividend-growth";
import { formatWon } from "@/lib/format";

interface PlanState {
  name: string;
  price: number;
  yieldRate: number;
  dividendGrowth: number;
  priceGrowth: number;
  fee: number;
  growthYears: number;
  laterDividendGrowth: number;
}
interface State {
  initial: number;
  years: number;
  taxRate: number;
  reinvest: boolean;
  paymentFrequency: "annual" | "monthly";
  fractionalShares: boolean;
  a: PlanState;
  b: PlanState;
}
const initialState: State = {
  initial: 10_000_000,
  years: 20,
  taxRate: 15.4,
  reinvest: true,
  paymentFrequency: "annual",
  fractionalShares: true,
  a: { name: "고배당 ETF", price: 100, yieldRate: 8, dividendGrowth: 1, priceGrowth: 2, fee: 0.3, growthYears: 20, laterDividendGrowth: 1 },
  b: { name: "배당성장 ETF", price: 100, yieldRate: 3, dividendGrowth: 8, priceGrowth: 6, fee: 0.3, growthYears: 20, laterDividendGrowth: 3 },
};

function PlanForm({ title, plan, onChange }: { title: string; plan: PlanState; onChange: (plan: PlanState) => void }) {
  return <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent className="space-y-4">
    <label className="block text-sm font-semibold text-slate-700">이름<input className="mt-2 h-11 w-full rounded-xl border border-slate-300 px-3" value={plan.name} onChange={(event) => onChange({ ...plan, name: event.target.value })} /></label>
    <NumberField label="현재 주가" value={plan.price} onChange={(price) => onChange({ ...plan, price })} min={0.01} />
    <NumberField label="초기 배당수익률" value={plan.yieldRate} onChange={(yieldRate) => onChange({ ...plan, yieldRate })} min={0} max={30} unit="%" slider />
    <NumberField label="연평균 배당성장률" value={plan.dividendGrowth} onChange={(dividendGrowth) => onChange({ ...plan, dividendGrowth })} min={-20} max={30} unit="%" slider />
    <NumberField label="연평균 주가상승률" value={plan.priceGrowth} onChange={(priceGrowth) => onChange({ ...plan, priceGrowth })} min={-20} max={30} unit="%" slider />
    <NumberField label="연간 총보수" value={plan.fee} onChange={(fee) => onChange({ ...plan, fee })} min={0} max={5} unit="%" />
    <details className="rounded-xl border border-slate-200 p-3"><summary className="cursor-pointer text-sm font-bold">고급 배당성장 설정</summary><div className="mt-4 space-y-4"><NumberField label="기본 배당성장률 적용 기간" value={plan.growthYears} onChange={(growthYears) => onChange({ ...plan, growthYears: Math.round(growthYears) })} min={1} max={50} unit="년" /><NumberField label="이후 배당성장률" value={plan.laterDividendGrowth} onChange={(laterDividendGrowth) => onChange({ ...plan, laterDividendGrowth })} min={-20} max={30} unit="%" /></div></details>
  </CardContent></Card>;
}

export function DividendGrowthCalculator() {
  const { value, setValue } = useScenarioState<State>("investment-lab-dividend", initialState);
  const result = useMemo(() => calculateDividendGrowth({
    initial: value.initial,
    years: value.years,
    taxRate: value.taxRate / 100,
    reinvest: value.reinvest,
    paymentsPerYear: value.paymentFrequency === "monthly" ? 12 : 1,
    fractionalShares: value.fractionalShares,
    plans: [
      { ...value.a, yieldRate: value.a.yieldRate / 100, dividendGrowth: value.a.dividendGrowth / 100, priceGrowth: value.a.priceGrowth / 100, fee: value.a.fee / 100, laterDividendGrowth: value.a.laterDividendGrowth / 100 },
      { ...value.b, yieldRate: value.b.yieldRate / 100, dividendGrowth: value.b.dividendGrowth / 100, priceGrowth: value.b.priceGrowth / 100, fee: value.b.fee / 100, laterDividendGrowth: value.b.laterDividendGrowth / 100 },
    ],
  }), [value]);
  const cross = (year: number | null) => year ? `${year}년 차` : `${value.years}년 내 없음`;
  const csvRows = result.rows.map((row) => ({ 연도: row.year, [`${value.a.name} 연간배당`]: Math.round(row.aDividend), [`${value.b.name} 연간배당`]: Math.round(row.bDividend), [`${value.a.name} 누적배당`]: Math.round(row.aCumulative), [`${value.b.name} 누적배당`]: Math.round(row.bCumulative), [`${value.a.name} 총자산`]: Math.round(row.aAsset), [`${value.b.name} 총자산`]: Math.round(row.bAsset) }));

  const input = <>
    <Card><CardHeader><CardTitle>공통 조건</CardTitle></CardHeader><CardContent className="space-y-5">
      <NumberField label="초기 투자금" value={value.initial} onChange={(initial) => setValue({ ...value, initial })} min={0} unit="원" />
      <NumberField label="투자 기간" value={value.years} onChange={(years) => setValue({ ...value, years: Math.round(years) })} min={1} max={50} unit="년" slider />
      <NumberField label="배당소득세율" value={value.taxRate} onChange={(taxRate) => setValue({ ...value, taxRate })} min={0} max={50} unit="%" />
      <label className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 px-3"><input type="checkbox" checked={value.reinvest} onChange={(event) => setValue({ ...value, reinvest: event.target.checked })} /><span className="text-sm font-semibold">세후 배당금 재투자</span></label>
      <div className="grid grid-cols-2 gap-2"><Button variant={value.paymentFrequency === "annual" ? "default" : "secondary"} onClick={() => setValue({ ...value, paymentFrequency: "annual" })}>연말 지급 가정</Button><Button variant={value.paymentFrequency === "monthly" ? "default" : "secondary"} onClick={() => setValue({ ...value, paymentFrequency: "monthly" })}>매월 지급 가정</Button></div>
      <label className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 px-3"><input type="checkbox" checked={value.fractionalShares} onChange={(event) => setValue({ ...value, fractionalShares: event.target.checked })} /><span className="text-sm font-semibold">소수점 주식 매수 가능</span></label>
    </CardContent></Card>
    <PlanForm title="투자안 A · 고배당형" plan={value.a} onChange={(a) => setValue({ ...value, a })} />
    <PlanForm title="투자안 B · 배당성장형" plan={value.b} onChange={(b) => setValue({ ...value, b })} />
  </>;

  const resultNode = <>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"><MetricCard label="연간 배당금 역전" value={cross(result.annualCrossover)} tone="positive" /><MetricCard label="누적 배당금 역전" value={cross(result.cumulativeCrossover)} /><MetricCard label="총자산 역전" value={cross(result.assetCrossover)} tone="positive" /><MetricCard label={`${value.a.name} 최종 배당`} value={formatWon(result.finalDividend[0])} /><MetricCard label={`${value.b.name} 최종 배당`} value={formatWon(result.finalDividend[1])} /><MetricCard label="최종 총자산 차이" value={formatWon(result.finalAsset[1] - result.finalAsset[0])} tone={result.finalAsset[1] >= result.finalAsset[0] ? "positive" : "negative"} /></div>
    <ResultMessage conclusion={result.annualCrossover ? `${result.annualCrossover}년 차부터 ${value.b.name}의 연간 세후 배당금이 더 많아집니다.` : `설정한 ${value.years}년 안에는 연간 배당금이 역전되지 않습니다.`} reason={`${value.a.name}은 초기 현금흐름이 크고 ${value.b.name}은 배당성장률과 주가상승률이 높게 설정되어 있습니다. 연간 배당·누적 배당·총자산은 서로 다른 시점에 역전될 수 있습니다.`} warning={value.b.dividendGrowth > 12 ? "두 자릿수 배당성장률이 장기간 유지된다는 가정은 낙관적일 수 있습니다. 성장률을 낮춘 시나리오도 비교하세요." : undefined} />
    <ChartCard title="연간 세후 배당금 비교"><ResponsiveContainer width="100%" height="100%"><LineChart data={result.rows}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" /><YAxis tickFormatter={(number) => `${Math.round(number / 10000)}만`} /><Tooltip formatter={(number) => formatWon(Number(number), false)} /><Legend /><Line dataKey="aDividend" name={value.a.name} stroke="#64748b" dot={false} /><Line dataKey="bDividend" name={value.b.name} stroke="#2563eb" dot={false} /></LineChart></ResponsiveContainer></ChartCard>
    <ChartCard title="누적 세후 배당금"><ResponsiveContainer width="100%" height="100%"><LineChart data={result.rows}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" /><YAxis tickFormatter={(number) => `${Math.round(number / 10000)}만`} /><Tooltip formatter={(number) => formatWon(Number(number), false)} /><Legend /><Line dataKey="aCumulative" name={value.a.name} stroke="#64748b" dot={false} /><Line dataKey="bCumulative" name={value.b.name} stroke="#2563eb" dot={false} /></LineChart></ResponsiveContainer></ChartCard>
    <ChartCard title="총자산 비교"><ResponsiveContainer width="100%" height="100%"><LineChart data={result.rows}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" /><YAxis tickFormatter={(number) => `${Math.round(number / 100000000)}억`} /><Tooltip formatter={(number) => formatWon(Number(number), false)} /><Legend /><Line dataKey="aAsset" name={value.a.name} stroke="#64748b" dot={false} /><Line dataKey="bAsset" name={value.b.name} stroke="#2563eb" dot={false} /></LineChart></ResponsiveContainer></ChartCard>
    <DataTable title="연도별 상세 결과" rows={result.rows} columns={[{ key: "year", label: "연도" }, { key: "aDividend", label: `${value.a.name} 연간 배당`, format: (number) => formatWon(Number(number), false), align: "right" }, { key: "bDividend", label: `${value.b.name} 연간 배당`, format: (number) => formatWon(Number(number), false), align: "right" }, { key: "aCumulative", label: `${value.a.name} 누적 배당`, format: (number) => formatWon(Number(number), false), align: "right" }, { key: "bCumulative", label: `${value.b.name} 누적 배당`, format: (number) => formatWon(Number(number), false), align: "right" }, { key: "aAsset", label: `${value.a.name} 총자산`, format: (number) => formatWon(Number(number), false), align: "right" }, { key: "bAsset", label: `${value.b.name} 총자산`, format: (number) => formatWon(Number(number), false), align: "right" }]} />
  </>;

  return <CalculatorShell title="배당성장 ETF 역전 시점 계산기" description="초기 배당률이 높은 투자안과 배당성장률이 높은 투자안의 연간 배당금, 누적 배당금, 총자산을 각각 비교합니다." headline="현재 배당률이 높은 ETF가 장기적으로도 항상 더 많은 배당금을 지급하는 것은 아닙니다." actions={<CalculatorActions value={value} reset={() => setValue(initialState)} example={() => setValue(initialState)} csvRows={csvRows} csvName="배당성장-역전시점.csv" />} input={input} result={resultNode} education={[{ title: "세 가지 역전", body: "연간 배당금이 먼저 역전되어도 초기 배당 차이 때문에 누적 배당금과 총자산은 더 늦게 역전될 수 있습니다." }, { title: "가장 많이 하는 오해", body: "현재 배당률이 높다는 사실만으로 장기 총수익률이 더 높다고 볼 수 없습니다." }, { title: "재투자의 영향", body: "세후 배당금을 재투자하면 보유 주식 수가 늘어나 배당금과 평가금액에 복리 효과가 반영됩니다." }]} assumptions={["배당성장률과 주가상승률은 입력한 구간별 비율로 적용됩니다.", "배당소득세는 입력한 세율로 단순 계산합니다.", value.reinvest ? `세후 배당금은 ${value.paymentFrequency === "monthly" ? "매월" : "연말"} 주가로 재투자합니다.` : "배당금은 현금으로 누적합니다.", value.fractionalShares ? "소수점 주식 매수가 가능하다고 가정합니다." : "정수 단위 주식만 매수하고 잔액은 현금으로 보유합니다."]} />;
}
