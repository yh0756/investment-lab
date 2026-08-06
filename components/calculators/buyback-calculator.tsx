"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalculatorActions } from "@/components/calculator-actions";
import { CalculatorShell } from "@/components/calculator-shell";
import { NumberField } from "@/components/number-field";
import { MetricCard } from "@/components/metric-card";
import { ChartCard } from "@/components/chart-card";
import { ResultMessage } from "@/components/result-message";
import { DataTable } from "@/components/data-table";
import { AdvancedSettings } from "@/components/advanced-settings";
import { SecondaryResults } from "@/components/secondary-results";
import { InputCard } from "@/components/input-card";
import { useScenarioState } from "@/lib/hooks/use-scenario-state";
import { calculateBuyback, type BuybackTiming } from "@/lib/calculations/buyback";
import { formatNumber, formatPercent, formatWon } from "@/lib/format";

interface State { netIncome: number; shares: number; price: number; buybackAmount: number; averagePrice: number; incomeGrowth: number; newShares: number; dilutedShares: number; interestCost: number; taxRate: number; analysisYears: number; timing: BuybackTiming; }
const initialState: State = { netIncome: 1_000_000_000_000, shares: 100_000_000, price: 100_000, buybackAmount: 500_000_000_000, averagePrice: 100_000, incomeGrowth: 5, newShares: 1_000_000, dilutedShares: 0, interestCost: 0, taxRate: 24, analysisYears: 1, timing: "average" };

export function BuybackCalculator() {
  const { value, setValue } = useScenarioState<State>("investment-lab-buyback", initialState);
  const result = useMemo(() => calculateBuyback({ ...value, incomeGrowth: value.incomeGrowth / 100, taxRate: value.taxRate / 100 }), [value]);
  const priceData = Array.from({ length: 13 }, (_, index) => {
    const price = value.price * (0.5 + index * 0.1);
    const scenario = calculateBuyback({ ...value, averagePrice: price, incomeGrowth: value.incomeGrowth / 100, taxRate: value.taxRate / 100 });
    return { price, epsGrowth: scenario.totalEpsGrowth * 100, shareReduction: scenario.netReduction * 100 };
  });
  const epsData = [{ stage: "현재 EPS", eps: result.currentEps }, { stage: "이익 성장 반영", eps: result.growthOnlyEps }, { stage: "자사주매입 반영", eps: result.finalEps }];
  const shareData = [{ stage: "현재", shares: value.shares }, { stage: "매입 후", shares: result.finalShares }];
  const csvRows = [{ 구분: "현재 EPS", 값: result.currentEps }, { 구분: "이익 성장 반영 EPS", 값: result.growthOnlyEps }, { 구분: "최종 EPS", 값: result.finalEps }, { 구분: "사업 성장 효과", 값: result.businessEffect }, { 구분: "주식 수 감소 효과", 값: result.shareEffect }, { 구분: "순주식 수 감소율", 값: result.netReduction }];

  const input = <>
    <InputCard title="핵심 입력" description="기업 이익·주식 수·매입 규모와 가격만 입력하면 EPS 효과를 확인할 수 있습니다.">
      <NumberField label="현재 순이익" value={value.netIncome} onChange={(netIncome) => setValue({ ...value, netIncome })} min={0} unit="원" />
      <NumberField label="현재 발행주식 수" value={value.shares} onChange={(shares) => setValue({ ...value, shares })} min={1} unit="주" />
      <NumberField label="현재 주가" value={value.price} onChange={(price) => setValue({ ...value, price })} min={0} unit="원" />
      <NumberField label="자사주매입 예정 금액" value={value.buybackAmount} onChange={(buybackAmount) => setValue({ ...value, buybackAmount })} min={0} unit="원" />
      <NumberField label="예상 평균 매입가격" value={value.averagePrice} onChange={(averagePrice) => setValue({ ...value, averagePrice })} min={0.01} unit="원" />
      <NumberField label="예상 순이익 성장률" value={value.incomeGrowth} onChange={(incomeGrowth) => setValue({ ...value, incomeGrowth })} min={-100} max={100} unit="%" slider />
    </InputCard>
    <AdvancedSettings title="희석·이자비용·매입 시점" description="주식보상과 차입 자금까지 반영할 때 조정합니다.">
      <div className="space-y-5">
        <NumberField label="분석 기간" value={value.analysisYears} onChange={(analysisYears) => setValue({ ...value, analysisYears })} min={1} max={20} unit="년" />
        <NumberField label="신규 발행주식 수" value={value.newShares} onChange={(newShares) => setValue({ ...value, newShares })} min={0} unit="주" />
        <NumberField label="희석 가능 주식 수" value={value.dilutedShares} onChange={(dilutedShares) => setValue({ ...value, dilutedShares })} min={0} unit="주" />
        <NumberField label="연간 이자비용" value={value.interestCost} onChange={(interestCost) => setValue({ ...value, interestCost })} min={0} unit="원" />
        <NumberField label="법인세율" value={value.taxRate} onChange={(taxRate) => setValue({ ...value, taxRate })} min={0} max={60} unit="%" />
        <div><p className="mb-2 text-sm font-semibold text-slate-700">자사주매입 시점</p><div className="grid grid-cols-3 gap-2">{(["begin", "average", "end"] as BuybackTiming[]).map((timing) => <button key={timing} className={`min-h-11 rounded-xl border px-2 text-xs font-bold ${value.timing === timing ? "border-navy bg-navy text-white" : "border-slate-200 bg-white text-slate-600"}`} onClick={() => setValue({ ...value, timing })}>{timing === "begin" ? "연초" : timing === "average" ? "연중 평균" : "연말"}</button>)}</div></div>
      </div>
    </AdvancedSettings>
  </>;

  const expensive = result.premium > 0.2;
  const resultNode = <>
    <div className="grid gap-3 sm:grid-cols-3"><MetricCard label="최종 예상 EPS" value={`${formatNumber(result.finalEps, 0)}원`} tone="positive" /><MetricCard label="총 EPS 성장률" value={formatPercent(result.totalEpsGrowth)} tone={result.totalEpsGrowth >= 0 ? "positive" : "negative"} /><MetricCard label="순주식 수 감소율" value={formatPercent(result.netReduction)} tone={result.netReduction >= 0 ? "positive" : "negative"} /></div>
    <ResultMessage conclusion={`최종 EPS는 ${formatPercent(result.totalEpsGrowth)} 증가하며, 사업 성장 효과는 ${formatPercent(result.businessEffect)}, 주식 수 감소 효과는 ${formatPercent(result.shareEffect)}입니다.`} reason={`자사주매입으로 약 ${formatNumber(result.purchasedShares, 0)}주를 매입하지만 신규·희석 주식을 반영한 최종 발행주식 수는 ${formatNumber(result.finalShares, 0)}주입니다.`} warning={expensive ? `평균 매입가격이 현재 주가보다 ${formatPercent(result.premium)} 높습니다. 같은 자금으로 매입할 수 있는 주식 수가 줄어 자본배분 효율이 낮아질 수 있습니다.` : result.netReduction < 0 ? "신규 발행과 희석 주식이 매입 주식보다 많아 순발행주식 수가 오히려 증가합니다." : undefined} />
    <ChartCard title="EPS 효과 단계 비교"><ResponsiveContainer width="100%" height="100%"><BarChart data={epsData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="stage" /><YAxis /><Tooltip formatter={(number) => `${formatNumber(Number(number), 0)}원`} /><Bar dataKey="eps" name="EPS" fill="#2563eb" /></BarChart></ResponsiveContainer></ChartCard>
    <SecondaryResults><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"><MetricCard label="현재 EPS" value={`${formatNumber(result.currentEps, 0)}원`} /><MetricCard label="이익 성장 반영 EPS" value={`${formatNumber(result.growthOnlyEps, 0)}원`} /><MetricCard label="사업 성장 효과" value={formatPercent(result.businessEffect)} /><MetricCard label="자사주매입 기여" value={formatPercent(result.shareEffect)} tone="positive" /><MetricCard label="주식 수 감소율" value={formatPercent(result.grossReduction)} /><MetricCard label="자사주매입 수익률" value={formatPercent(result.buybackYield)} /></div></SecondaryResults>
    <AdvancedSettings title="발행주식 수와 매입가격 민감도" description="매입가격이 달라질 때 EPS 효과가 어떻게 바뀌는지 확인합니다.">
      <div className="space-y-4"><ChartCard title="발행주식 수 변화"><ResponsiveContainer width="100%" height="100%"><BarChart data={shareData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="stage" /><YAxis tickFormatter={(number) => `${formatNumber(number / 10000, 0)}만`} /><Tooltip formatter={(number) => `${formatNumber(Number(number), 0)}주`} /><Bar dataKey="shares" name="발행주식 수" fill="#64748b" /></BarChart></ResponsiveContainer></ChartCard><ChartCard title="평균 매입가격별 EPS 효과"><ResponsiveContainer width="100%" height="100%"><LineChart data={priceData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="price" tickFormatter={(number) => `${formatNumber(number / 10000, 0)}만`} /><YAxis unit="%" /><Tooltip formatter={(number) => `${Number(number).toFixed(2)}%`} labelFormatter={(number) => `평균 매입가격 ${formatWon(Number(number), false)}`} /><Line dataKey="epsGrowth" name="EPS 성장률" stroke="#2563eb" dot={false} /><Line dataKey="shareReduction" name="순주식 수 감소율" stroke="#15803d" dot={false} /></LineChart></ResponsiveContainer></ChartCard><DataTable title="매입가격별 민감도" rows={priceData} columns={[{ key: "price", label: "평균 매입가격", format: (number) => formatWon(Number(number), false), align: "right" }, { key: "epsGrowth", label: "최종 EPS 성장률", format: (number) => `${Number(number).toFixed(2)}%`, align: "right" }, { key: "shareReduction", label: "순주식 수 감소율", format: (number) => `${Number(number).toFixed(2)}%`, align: "right" }]} /></div>
    </AdvancedSettings>
  </>;

  return <CalculatorShell title="자사주매입 효과 계산기" description="기업 이익 증가와 발행주식 수 감소가 EPS 성장에 미치는 영향을 분리해 계산합니다." headline="EPS 증가는 사업 성장뿐 아니라 발행주식 수 감소로도 발생할 수 있습니다." actions={<CalculatorActions value={value} reset={() => setValue(initialState)} example={() => setValue(initialState)} csvRows={csvRows} csvName="자사주매입-EPS-효과.csv" />} input={input} result={resultNode} education={[{ title: "자사주매입 수익률", body: "자사주매입 금액을 현재 시가총액으로 나눈 비율입니다. 실제 주식 수 감소율은 평균 매입가격과 신규 발행에 따라 달라집니다." }, { title: "EPS 효과 분해", body: "순이익 증가로 높아진 EPS와 주식 수 감소로 추가 상승한 EPS를 단계별로 분리합니다." }, { title: "가장 많이 하는 오해", body: "자사주매입 금액만큼 발행주식 수가 그대로 감소하지 않습니다. 주식보상과 스톡옵션 희석을 함께 봐야 합니다." }]} assumptions={[`입력한 평균 매입가격으로 자사주를 매입하며 ${value.timing === "begin" ? "연초" : value.timing === "average" ? "연중 평균" : "연말"} 시점을 EPS 가중평균 주식 수에 반영합니다.`, "매입 주식은 유통주식 수에서 제외된다고 가정합니다.", "이자비용은 세후 금액을 예상 순이익에서 차감합니다."]} />;
}
