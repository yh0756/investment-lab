"use client";

import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalculatorActions } from "@/components/calculator-actions";
import { CalculatorShell } from "@/components/calculator-shell";
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
import { calculateLossRecovery, requiredRecoveryRate, type RecoveryTarget } from "@/lib/calculations/loss-recovery";
import { formatDuration, formatPercent, formatWon } from "@/lib/format";

interface State { initial: number; lossRate: number; additional: number; annualReturn: number; monthlyContribution: number; target: RecoveryTarget; }
const initialState: State = { initial: 10_000_000, lossRate: 40, additional: 2_000_000, annualReturn: 7, monthlyContribution: 300_000, target: "total" };

export function LossRecoveryCalculator() {
  const { value, setValue } = useScenarioState<State>("investment-lab-loss", initialState);
  const result = useMemo(() => calculateLossRecovery({ ...value, lossRate: value.lossRate / 100, annualReturn: value.annualReturn / 100 }), [value]);
  const comparison = [10,20,30,40,50,60,70,80,90].map((loss) => ({ 손실률: `-${loss}%`, 필요상승률: `${(requiredRecoveryRate(loss / 100) * 100).toFixed(1)}%` }));
  const csvRows = result.rows.map((row) => ({ 개월: row.month, 평가금액: Math.round(row.value), 목표금액: Math.round(row.target), 총납입금: Math.round(row.contributions) }));

  const input = <>
    <InputCard title="핵심 입력" description="현재 손실과 추가 투자 여부만 먼저 입력해 필요한 회복률을 확인하세요.">
      <NumberField label="초기 투자금" value={value.initial} onChange={(initial) => setValue({ ...value, initial })} min={0} unit="만원" inputScale={10_000} />
      <NumberField label="현재 손실률" value={value.lossRate} onChange={(lossRate) => setValue({ ...value, lossRate })} min={0} max={99} unit="%" slider />
      <NumberField label="즉시 추가 투자금" value={value.additional} onChange={(additional) => setValue({ ...value, additional })} min={0} unit="만원" inputScale={10_000} />
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700">회복 목표</p>
        <div className="grid grid-cols-2 gap-2"><Button variant={value.target === "initial" ? "default" : "secondary"} onClick={() => setValue({ ...value, target: "initial" })}>초기 원금</Button><Button variant={value.target === "total" ? "default" : "secondary"} onClick={() => setValue({ ...value, target: "total" })}>총 납입 원금</Button></div>
        <p className="mt-2 text-xs leading-5 text-slate-500">총 납입 원금은 추가 투자와 월 적립금까지 포함합니다.</p>
      </div>
    </InputCard>
    <AdvancedSettings title="회복 기간 추정" description="예상수익률과 월 적립금을 반영해 회복 시점을 계산합니다.">
      <div className="space-y-5"><NumberField label="향후 예상 연평균 수익률" value={value.annualReturn} onChange={(annualReturn) => setValue({ ...value, annualReturn })} min={-20} max={30} unit="%" slider /><NumberField label="월 추가 투자금" value={value.monthlyContribution} onChange={(monthlyContribution) => setValue({ ...value, monthlyContribution })} min={0} unit="만원" inputScale={10_000} /></div>
    </AdvancedSettings>
  </>;

  const resultNode = <>
    <div className="grid gap-3 sm:grid-cols-3"><MetricCard label="현재 평가금액" value={formatWon(result.current)} tone="negative" /><MetricCard label="추가 투자 후 필요 상승률" value={formatPercent(result.requiredAfterAdditional)} tone="caution" /><MetricCard label="예상 회복 기간" value={formatDuration(result.months)} tone="positive" /></div>
    <ResultMessage conclusion={`${value.lossRate}% 손실은 추가 투자 없이 원금 회복을 위해 ${formatPercent(result.requiredWithoutAdditional)} 상승이 필요합니다.`} reason={`즉시 ${formatWon(value.additional)}을 추가하면 목표 기준 회복에 필요한 상승률은 ${formatPercent(result.requiredAfterAdditional)}로 바뀝니다. 월 ${formatWon(value.monthlyContribution)}과 연 ${value.annualReturn}% 수익률 가정에서는 ${formatDuration(result.months)}이 예상됩니다.`} warning="추가 매수는 표시상 손익률을 낮출 수 있지만 기존 손실금액을 없애지는 않습니다. 자산의 펀더멘털과 장기 전망을 별도로 확인하세요." />
    <ChartCard title="자산 회복 예상 경로"><ResponsiveContainer width="100%" height="100%"><LineChart data={result.rows}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tickFormatter={(number) => `${Math.round(number / 12)}년`} /><YAxis tickFormatter={(number) => `${Math.round(number / 10000)}만`} /><Tooltip formatter={(number) => formatWon(Number(number), false)} labelFormatter={(number) => `${number}개월`} /><Line dataKey="value" name="평가금액" stroke="#2563eb" dot={false} /><Line dataKey="target" name="회복 목표" stroke="#d97706" strokeDasharray="5 5" dot={false} /><ReferenceLine y={result.targetAmount} stroke="#94a3b8" strokeDasharray="4 4" /></LineChart></ResponsiveContainer></ChartCard>
    <SecondaryResults><div className="grid gap-3 sm:grid-cols-3"><MetricCard label="현재 손실금액" value={formatWon(result.lossAmount)} tone="negative" /><MetricCard label="추가 투자 후 평가금액" value={formatWon(result.afterAdditional)} /><MetricCard label="추가 투자 없이 필요 상승률" value={formatPercent(result.requiredWithoutAdditional)} tone="caution" /></div></SecondaryResults>
    <AdvancedSettings title="손실률 참고표와 월별 결과" description="손실률별 회복률과 계산 경로를 자세히 확인합니다.">
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-bold text-slate-900">빠른 손실률 비교</h3><div className="mt-3 overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b"><th className="py-2 text-left">손실률</th><th className="py-2 text-right">원금 회복 필요 상승률</th></tr></thead><tbody>{comparison.map((row) => <tr key={row.손실률} className="border-b border-slate-100"><td className="py-2 text-negative">{row.손실률}</td><td className="py-2 text-right font-bold">{row.필요상승률}</td></tr>)}</tbody></table></div></div>
        <DataTable title="월별 회복 경로" rows={result.rows} maxRows={50} columns={[{ key: "month", label: "경과 기간", format: (number) => formatDuration(Number(number)) }, { key: "value", label: "평가금액", format: (number) => formatWon(Number(number), false), align: "right" }, { key: "target", label: "회복 목표", format: (number) => formatWon(Number(number), false), align: "right" }, { key: "contributions", label: "총 납입금", format: (number) => formatWon(Number(number), false), align: "right" }]} />
      </div>
    </AdvancedSettings>
  </>;

  return <CalculatorShell title="투자 손실 회복 계산기" description="현재 손실을 회복하는 데 필요한 상승률과 추가 투자·월 적립식 투자를 반영한 예상 회복 기간을 계산합니다." headline="손실률이 커질수록 원금을 회복하기 위해 필요한 상승률은 더 빠르게 증가합니다." actions={<CalculatorActions value={value} reset={() => setValue(initialState)} example={() => setValue(initialState)} csvRows={csvRows} csvName="투자-손실-회복.csv" />} input={input} result={resultNode} education={[{ title: "50% 손실의 의미", body: "100에서 50으로 떨어진 뒤 다시 100이 되려면 50%가 아니라 100% 상승해야 합니다." }, { title: "추가 투자 효과", body: "추가 투자금은 평균매입단가와 필요 상승률을 낮출 수 있지만 투자 위험과 총 노출금액도 함께 늘립니다." }, { title: "목표 기준 구분", body: "초기 원금 회복과 총 납입 원금 회복은 서로 다른 목표입니다. 월 납입금까지 포함하면 목표금액도 계속 증가합니다." }]} assumptions={["월 수익률은 연평균 수익률을 월 복리로 환산합니다.", "매월 기존 평가금액에 수익률을 적용한 뒤 월 투자금을 더합니다.", "최대 1,200개월까지만 탐색합니다."]} />;
}
