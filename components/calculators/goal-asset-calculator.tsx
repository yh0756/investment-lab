"use client";

import { useMemo } from "react";
import { Area, CartesianGrid, ComposedChart, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalculatorActions } from "@/components/calculator-actions";
import { CalculatorShell } from "@/components/calculator-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NumberField } from "@/components/number-field";
import { MetricCard } from "@/components/metric-card";
import { ChartCard } from "@/components/chart-card";
import { ResultMessage } from "@/components/result-message";
import { DataTable } from "@/components/data-table";
import { AdvancedSettings } from "@/components/advanced-settings";
import { SecondaryResults } from "@/components/secondary-results";
import { InputCard } from "@/components/input-card";
import { useScenarioState } from "@/lib/hooks/use-scenario-state";
import { calculateGoalAsset, futureValue, type GoalMode } from "@/lib/calculations/goal-asset";
import { formatDuration, formatPercent, formatWon } from "@/lib/format";

interface State { current: number; target: number; annualReturn: number; years: number; monthly: number; paymentTiming: "end" | "begin"; inflationRate: number; targetIsPresentValue: boolean; mode: GoalMode; scenarioGap: number; }
const initialState: State = { current: 50_000_000, target: 300_000_000, annualReturn: 7, years: 10, monthly: 1_000_000, paymentTiming: "end", inflationRate: 2.5, targetIsPresentValue: false, mode: "monthly", scenarioGap: 2 };

export function GoalAssetCalculator() {
  const { value, setValue } = useScenarioState<State>("investment-lab-goal", initialState);
  const result = useMemo(() => calculateGoalAsset({ ...value, annualReturn: value.annualReturn / 100, inflationRate: value.inflationRate / 100 }), [value]);
  const mainValue = value.mode === "monthly" ? formatWon(result.requiredMonthly) : value.mode === "return" ? (result.requiredAnnualReturn === null ? "계산 범위 초과" : formatPercent(result.requiredAnnualReturn)) : formatDuration(result.requiredMonths);
  const mainLabel = value.mode === "monthly" ? "필요한 월 투자금" : value.mode === "return" ? "필요한 연평균 수익률" : "필요한 투자 기간";
  const months = value.mode === "period" ? (result.requiredMonths ?? 1200) : Math.round(value.years * 12);
  const appliedMonthly = value.mode === "monthly" ? result.requiredMonthly : value.monthly;
  const appliedReturn = value.mode === "return" ? (result.requiredAnnualReturn ?? value.annualReturn / 100) : value.annualReturn / 100;
  const scenarioData = Array.from({ length: Math.floor(months / 12) + 1 }, (_, year) => {
    const month = Math.min(months, year * 12);
    return { year, 보수적: futureValue(value.current, appliedMonthly, appliedReturn - value.scenarioGap / 100, month, value.paymentTiming), 기준: futureValue(value.current, appliedMonthly, appliedReturn, month, value.paymentTiming), 낙관적: futureValue(value.current, appliedMonthly, appliedReturn + value.scenarioGap / 100, month, value.paymentTiming) };
  });
  const csvRows = result.rows.map((row) => ({ 개월: row.month, 납입원금: Math.round(row.principal), 평가금액: Math.round(row.value), 투자수익: Math.round(row.gain), 목표금액: Math.round(row.target) }));
  const predictedDate = useMemo(() => { const date = new Date(); date.setMonth(date.getMonth() + months); return `${date.getFullYear()}년 ${date.getMonth() + 1}월`; }, [months]);

  const input = <>
    <Card><CardHeader><CardTitle>무엇을 계산할까요?</CardTitle></CardHeader><CardContent className="grid gap-2 sm:grid-cols-3">{(["monthly","return","period"] as GoalMode[]).map((mode) => <Button key={mode} variant={value.mode === mode ? "default" : "secondary"} onClick={() => setValue({ ...value, mode })}>{mode === "monthly" ? "월 투자금" : mode === "return" ? "필요 수익률" : "투자 기간"}</Button>)}</CardContent></Card>
    <InputCard title="핵심 목표 조건" description="목표와 현재 자산을 입력하고, 계산에 필요한 조건만 설정합니다.">
      <NumberField label="현재 보유자산" value={value.current} onChange={(current) => setValue({ ...value, current })} min={0} unit="만원" inputScale={10_000} />
      <NumberField label="목표자산" value={value.target} onChange={(target) => setValue({ ...value, target })} min={0} unit="만원" inputScale={10_000} />
      {value.mode !== "return" && <NumberField label="예상 연평균 수익률" value={value.annualReturn} onChange={(annualReturn) => setValue({ ...value, annualReturn })} min={-20} max={30} unit="%" slider />}
      {value.mode !== "period" && <NumberField label="투자 기간" value={value.years} onChange={(years) => setValue({ ...value, years })} min={1} max={50} unit="년" slider />}
      {value.mode !== "monthly" && <NumberField label="월 투자금" value={value.monthly} onChange={(monthly) => setValue({ ...value, monthly })} min={0} unit="만원" inputScale={10_000} />}
    </InputCard>
    <AdvancedSettings title="납입·물가·시나리오 설정" description="기본값은 월말 납입, 명목 목표금액 기준입니다.">
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-2"><Button variant={value.paymentTiming === "end" ? "default" : "secondary"} onClick={() => setValue({ ...value, paymentTiming: "end" })}>매월 말 납입</Button><Button variant={value.paymentTiming === "begin" ? "default" : "secondary"} onClick={() => setValue({ ...value, paymentTiming: "begin" })}>매월 초 납입</Button></div>
        <label className="flex min-h-11 items-center gap-3 rounded-xl border px-3"><input type="checkbox" checked={value.targetIsPresentValue} onChange={(event) => setValue({ ...value, targetIsPresentValue: event.target.checked })} /><span className="text-sm font-semibold">목표금액을 현재가치로 입력</span></label>
        {value.targetIsPresentValue && <NumberField label="물가상승률" value={value.inflationRate} onChange={(inflationRate) => setValue({ ...value, inflationRate })} min={-5} max={15} unit="%" />}
        <NumberField label="시나리오 수익률 차이" value={value.scenarioGap} onChange={(scenarioGap) => setValue({ ...value, scenarioGap })} min={0} max={10} unit="%p" />
      </div>
    </AdvancedSettings>
  </>;

  const unrealistic = value.mode === "return" && result.requiredAnnualReturn !== null && result.requiredAnnualReturn > 0.15;
  const resultNode = <>
    <div className="rounded-2xl border border-blue-200 bg-white p-6"><p className="text-sm font-bold text-slate-500">{mainLabel}</p><p className="mt-2 text-4xl font-black text-brand">{mainValue}</p><p className="mt-2 text-sm text-slate-500">예상 목표 달성 시점: {predictedDate}</p></div>
    <div className="grid gap-3 sm:grid-cols-3"><MetricCard label="물가 반영 목표금액" value={formatWon(result.adjustedTarget)} /><MetricCard label="총 납입원금" value={formatWon(result.totalPrincipal)} /><MetricCard label="투자수익 기여" value={formatWon(result.gain)} tone={result.gain >= 0 ? "positive" : "negative"} /></div>
    <ResultMessage conclusion={`현재 조건에서는 ${mainLabel}이(가) ${mainValue}입니다.`} reason={`현재 자산 ${formatWon(value.current)}과 적립식 투자금의 월 복리 성장을 합산해 목표금액 ${formatWon(result.adjustedTarget)}에 도달하는 조건을 역산했습니다.`} warning={unrealistic ? "필요 수익률이 연 15%를 넘습니다. 장기간 유지하기 어려운 수준일 수 있으므로 목표기간 연장이나 월 투자금 증액도 함께 검토하세요." : value.annualReturn > 12 ? "기대수익률이 높은 편입니다. 6~8% 수준의 보수적인 시나리오도 함께 확인하세요." : undefined} />
    <ChartCard title="납입원금과 투자수익의 성장"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={result.rows}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tickFormatter={(number) => `${Math.round(number / 12)}년`} /><YAxis tickFormatter={(number) => `${Math.round(number / 100000000)}억`} /><Tooltip formatter={(number) => formatWon(Number(number), false)} /><Legend /><Area type="monotone" dataKey="principal" name="납입원금" stackId="1" stroke="#64748b" fill="#cbd5e1" /><Area type="monotone" dataKey="gain" name="투자수익" stackId="1" stroke="#2563eb" fill="#93c5fd" /><Line dataKey="target" name="목표금액" stroke="#d97706" dot={false} /></ComposedChart></ResponsiveContainer></ChartCard>
    <SecondaryResults><div className="grid gap-3 sm:grid-cols-3"><MetricCard label="예상 최종자산" value={formatWon(result.finalValue)} tone={result.finalValue >= result.adjustedTarget ? "positive" : "caution"} /><MetricCard label="현재자산 성장분" value={formatWon(futureValue(value.current, 0, appliedReturn, months, value.paymentTiming) - value.current)} /><MetricCard label="목표 달성률" value={formatPercent(result.finalValue / result.adjustedTarget)} tone={result.finalValue >= result.adjustedTarget ? "positive" : "caution"} /></div></SecondaryResults>
    <AdvancedSettings title="시나리오 비교와 기간별 표" description="보수적·기준·낙관적 결과를 자세히 비교합니다.">
      <div className="space-y-4"><ChartCard title="보수적·기준·낙관적 시나리오"><ResponsiveContainer width="100%" height="100%"><LineChart data={scenarioData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" unit="년" /><YAxis tickFormatter={(number) => `${Math.round(number / 100000000)}억`} /><Tooltip formatter={(number) => formatWon(Number(number), false)} /><Legend /><Line dataKey="보수적" stroke="#64748b" dot={false} /><Line dataKey="기준" stroke="#2563eb" dot={false} /><Line dataKey="낙관적" stroke="#15803d" dot={false} /></LineChart></ResponsiveContainer></ChartCard><DataTable title="기간별 자산 증가" rows={result.rows} maxRows={50} columns={[{ key: "month", label: "경과 기간", format: (number) => formatDuration(Number(number)) }, { key: "principal", label: "납입원금", format: (number) => formatWon(Number(number), false), align: "right" }, { key: "gain", label: "투자수익", format: (number) => formatWon(Number(number), false), align: "right" }, { key: "value", label: "예상 자산", format: (number) => formatWon(Number(number), false), align: "right" }, { key: "target", label: "목표금액", format: (number) => formatWon(Number(number), false), align: "right" }]} /></div>
    </AdvancedSettings>
  </>;

  return <CalculatorShell title="목표 자산 역산 계산기" description="목표자산을 만들기 위해 필요한 월 투자금, 연평균 수익률 또는 투자 기간을 월 복리 기준으로 역산합니다." headline="목표금액만 정하지 말고, 목표를 달성하기 위해 매월 무엇을 해야 하는지 확인해보세요." actions={<CalculatorActions value={value} reset={() => setValue(initialState)} example={() => setValue(initialState)} csvRows={csvRows} csvName="목표자산-역산.csv" />} input={input} result={resultNode} education={[{ title: "목표를 행동으로 변환", body: "목표금액을 월 투자금·수익률·기간 중 하나로 바꾸면 현재 실행해야 할 행동을 구체적으로 확인할 수 있습니다." }, { title: "현재가치와 미래가치", body: "현재가치 목표를 선택하면 물가상승률만큼 미래의 명목 목표금액을 높여 계산합니다." }, { title: "가장 많이 하는 오해", body: "기대수익률을 높게 입력하면 계획상 월 투자금은 줄지만 실제 목표 달성 가능성이 높아지는 것은 아닙니다." }]} assumptions={["연평균 수익률은 월 복리 수익률로 환산합니다.", value.paymentTiming === "begin" ? "월 투자금은 매월 초에 납입합니다." : "월 투자금은 매월 말에 납입합니다.", value.targetIsPresentValue ? "목표금액은 현재가치이며 물가상승률을 반영합니다." : "목표금액은 미래 명목금액입니다."]} />;
}
