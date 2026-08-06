"use client";

import { useMemo } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { BarChart, Bar, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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
import { alternatingReturns, calculateLeverage } from "@/lib/calculations/leverage";
import { formatPercent, formatWon } from "@/lib/format";

interface State { mode: "repeat" | "custom" | "preset"; initial: number; leverage: number; annualFee: number; periodsPerYear: number; up: number; down: number; repeats: number; customReturns: number[]; preset: string; }
const initialState: State = { mode: "repeat", initial: 10_000_000, leverage: 3, annualFee: 0.95, periodsPerYear: 252, up: 10, down: -9.09, repeats: 5, customReturns: [5, -4, 3, -6, 4, -3], preset: "횡보 반복장" };
const presets: Record<string, number[]> = {
  "완만한 상승장": [1.2, 0.8, 1.1, 0.7, 1.3, 0.9, 1.0, 0.6],
  "급등 후 급락": [15, 8, -18, -9, 3, 2],
  "횡보 반복장": [10, -9.09, 10, -9.09, 10, -9.09],
  "급락 후 회복": [-20, -10, 12, 15, 8, 6],
  "높은 변동성 상승장": [12, -8, 15, -10, 14, -7, 11],
  "낮은 변동성 상승장": [1.5, 1.1, 1.3, 0.9, 1.4, 1.2, 1.0]
};

export function LeverageCalculator() {
  const { value, setValue } = useScenarioState<State>("investment-lab-leverage-v2", initialState);
  const returns = useMemo(() => {
    if (value.mode === "repeat") return alternatingReturns(value.up / 100, value.down / 100, value.repeats);
    if (value.mode === "preset") return (presets[value.preset] ?? presets["횡보 반복장"]).map((v) => v / 100);
    return (value.customReturns ?? []).map((number) => number / 100).filter(Number.isFinite);
  }, [value]);
  const result = useMemo(() => calculateLeverage({ initial: value.initial, leverage: value.leverage, annualFee: value.annualFee / 100, periodsPerYear: value.periodsPerYear, returns }), [value, returns]);
  const totalLoss = result.finalEtf <= 0 || result.etfReturn <= -0.999999;
  const pathTone = totalLoss || result.pathEffect < -0.001 ? "negative" : result.pathEffect > 0.001 ? "positive" : "default";
  const conclusion = totalLoss
    ? "레버리지 ETF 평가금액이 0원에 도달한 전액 손실 시나리오입니다."
    : result.pathEffect < -0.001
      ? `단순 ${value.leverage}배 예상보다 ${formatPercent(Math.abs(result.pathEffect))} 낮은 결과입니다.`
      : result.pathEffect > 0.001
        ? `복리 경로가 단순 배수보다 ${formatPercent(result.pathEffect)} 높게 나타났습니다.`
        : "단순 배수 결과와 실제 누적 결과의 차이가 크지 않습니다.";
  const input = <>
    <Card><CardHeader><CardTitle>시나리오 선택</CardTitle></CardHeader><CardContent className="grid grid-cols-3 gap-2">{(["repeat","custom","preset"] as const).map((m)=><Button key={m} variant={value.mode===m?"default":"secondary"} size="sm" onClick={()=>setValue({...value,mode:m})}>{m==="repeat"?"간단 반복":m==="custom"?"직접 경로":"프리셋"}</Button>)}</CardContent></Card>
    <InputCard title="핵심 조건" description="투자금과 배수, 시장 움직임만 입력하면 바로 비교할 수 있습니다.">
      <NumberField label="초기 투자금" value={value.initial} onChange={(initial)=>setValue({...value,initial})} min={10_000} unit="만원" inputScale={10_000}/>
      <NumberField label="레버리지 배수" value={value.leverage} onChange={(leverage)=>setValue({...value,leverage})} min={1} max={5} step={0.1} unit="배" slider/>
      <div className="grid grid-cols-3 gap-2">{[1,2,3].map((leverage)=><Button key={leverage} size="sm" variant={value.leverage===leverage?"default":"secondary"} onClick={()=>setValue({...value,leverage})}>{leverage}배</Button>)}</div>
      {value.mode==="repeat"&&<div className="space-y-5 rounded-2xl bg-slate-50 p-4"><NumberField label="상승 구간 수익률" value={value.up} onChange={(up)=>setValue({...value,up})} min={-99} max={100} step={0.1} unit="%" slider/><NumberField label="하락 구간 수익률" value={value.down} onChange={(down)=>setValue({...value,down})} min={-99} max={100} step={0.1} unit="%" slider/><NumberField label="반복 횟수" value={value.repeats} onChange={(repeats)=>setValue({...value,repeats:Math.round(repeats)})} min={1} max={50} unit="회" slider/></div>}
      {value.mode==="preset"&&<div className="grid gap-2 sm:grid-cols-2">{Object.keys(presets).map((p)=><Button key={p} size="sm" variant={value.preset===p?"default":"secondary"} onClick={()=>setValue({...value,preset:p})}>{p}</Button>)}</div>}
    </InputCard>
    {value.mode==="custom"&&<Card><CardHeader><div className="flex items-center justify-between"><CardTitle>사용자 경로</CardTitle><Button size="sm" variant="secondary" onClick={()=>setValue({...value,customReturns:[...(value.customReturns??[]),0]})}><Plus className="h-4 w-4"/>행 추가</Button></div></CardHeader><CardContent className="space-y-2">{(value.customReturns??[]).map((number,index)=><div key={index} className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-2"><span className="text-xs font-bold text-slate-500">{index+1}기</span><div className="relative"><input aria-label={`${index+1}기 수익률`} inputMode="decimal" className="h-10 w-full rounded-lg border border-slate-300 px-3 pr-8" value={number} onChange={(event)=>{const next=[...(value.customReturns??[])];next[index]=Number(event.target.value)||0;setValue({...value,customReturns:next})}}/><span className="absolute right-3 top-2.5 text-xs text-slate-400">%</span></div><Button size="sm" variant="ghost" disabled={index===0} onClick={()=>{const next=[...(value.customReturns??[])];[next[index-1],next[index]]=[next[index],next[index-1]];setValue({...value,customReturns:next})}} aria-label="위로 이동"><ArrowUp className="h-4 w-4"/></Button><Button size="sm" variant="ghost" disabled={index===(value.customReturns??[]).length-1} onClick={()=>{const next=[...(value.customReturns??[])];[next[index+1],next[index]]=[next[index],next[index+1]];setValue({...value,customReturns:next})}} aria-label="아래로 이동"><ArrowDown className="h-4 w-4"/></Button><Button size="sm" variant="ghost" onClick={()=>setValue({...value,customReturns:(value.customReturns??[]).filter((_,i)=>i!==index)})} aria-label="행 삭제"><Trash2 className="h-4 w-4 text-negative"/></Button></div>)}{(value.customReturns??[]).length===0&&<p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">행 추가 버튼으로 수익률 경로를 입력하세요.</p>}</CardContent></Card>}
    <AdvancedSettings title="비용 및 재설정 주기" description="운용보수와 일간·월간 재설정 가정을 조정합니다.">
      <div className="space-y-5"><NumberField label="연간 운용보수" value={value.annualFee} onChange={(annualFee)=>setValue({...value,annualFee})} min={0} max={5} step={0.05} unit="%"/><div><p className="mb-2 text-sm font-semibold text-slate-700">계산 주기</p><div className="grid grid-cols-2 gap-2"><Button variant={value.periodsPerYear===252?"default":"secondary"} onClick={()=>setValue({...value,periodsPerYear:252})}>일간 재설정</Button><Button variant={value.periodsPerYear===12?"default":"secondary"} onClick={()=>setValue({...value,periodsPerYear:12})}>월간 재설정</Button></div></div><NumberField label="연간 계산 주기 수" value={value.periodsPerYear} onChange={(periodsPerYear)=>setValue({...value,periodsPerYear})} min={1} max={365} unit="회" hint="직접 조정 가능"/></div>
    </AdvancedSettings>
  </>;
  const resultNode = <>
    <div className="grid gap-3 sm:grid-cols-3"><MetricCard label="레버리지 ETF 수익률" value={formatPercent(result.etfReturn)} tone={result.etfReturn>=0?"positive":"negative"}/><MetricCard label="최종 투자금" value={formatWon(result.finalEtf)} tone={result.finalEtf>=value.initial?"positive":"negative"}/><MetricCard label="경로 효과" value={formatPercent(result.pathEffect)} tone={pathTone}/></div>
    <ResultMessage conclusion={conclusion} reason={`기초지수는 ${formatPercent(result.marketReturn)} 움직였고 실제 레버리지 ETF는 기간별 수익률을 매번 ${value.leverage}배 적용해 복리로 누적했습니다.`} warning={totalLoss ? "단일 기간 급락으로 계산상 전액 손실이 발생했습니다. 이후 시장이 회복해도 평가금액은 다시 증가하지 않는 것으로 계산합니다." : value.leverage>=3||returns.some((r)=>1+value.leverage*r<=0)?"고배율 또는 단일 기간 급락에서는 평가금액이 0에 가까워질 수 있습니다. 실제 상품에는 추적오차와 거래비용도 추가됩니다.":undefined}/>
    <ChartCard title="자산 가치 변화"><ResponsiveContainer width="100%" height="100%"><LineChart data={result.rows}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="period"/><YAxis tickFormatter={(v)=>`${Math.round(v/10000)}만`}/><Tooltip formatter={(v)=>formatWon(Number(v),false)}/><Legend/><Line type="monotone" dataKey="marketValue" name="기초지수 1배" stroke="#64748b" dot={false}/><Line type="monotone" dataKey="etfValue" name="레버리지 ETF 실제" stroke="#2563eb" dot={false}/><Line type="monotone" dataKey="simpleValue" name="단순 배수" stroke="#d97706" dot={false} strokeDasharray="5 5"/></LineChart></ResponsiveContainer></ChartCard>
    <SecondaryResults><div className="grid gap-3 sm:grid-cols-3"><MetricCard label="기초지수 누적수익률" value={formatPercent(result.marketReturn)} tone={result.marketReturn>=0?"positive":"negative"}/><MetricCard label="단순 배수 예상수익률" value={formatPercent(result.simpleReturn)}/><MetricCard label="운용보수 누적 영향" value={formatWon(result.feeImpact)} tone="caution"/></div></SecondaryResults>
    <AdvancedSettings title="상세 차트와 기간별 표" description="기간별 수익률과 계산 과정을 확인합니다.">
      <div className="space-y-4"><ChartCard title="기간별 수익률"><ResponsiveContainer width="100%" height="100%"><BarChart data={result.rows.slice(1)}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="period"/><YAxis tickFormatter={(v)=>`${Math.round(v*100)}%`}/><Tooltip formatter={(v)=>formatPercent(Number(v))}/><Legend/><Bar dataKey="marketReturn" name="기초지수" fill="#64748b"/><Bar dataKey="leveragedPeriodReturn" name="레버리지 적용" fill="#2563eb"/></BarChart></ResponsiveContainer></ChartCard><DataTable title="기간별 상세 결과" rows={result.rows} columns={[{key:"period",label:"기간"},{key:"marketReturn",label:"기초지수 수익률",format:(v)=>formatPercent(Number(v)),align:"right"},{key:"marketValue",label:"기초지수 가치",format:(v)=>formatWon(Number(v),false),align:"right"},{key:"etfValue",label:"레버리지 ETF 가치",format:(v)=>formatWon(Number(v),false),align:"right"},{key:"simpleValue",label:"단순 배수 가치",format:(v)=>formatWon(Number(v),false),align:"right"}]} /></div>
    </AdvancedSettings>
  </>;
  return <CalculatorShell title="레버리지 ETF 변동성 손실 계산기" description="기간별 수익률을 직접 입력해 레버리지 ETF의 일간·기간별 재설정 구조와 경로 효과를 비교합니다." headline="레버리지 ETF는 최종 지수 수익률보다 지수가 움직인 경로에 더 큰 영향을 받습니다." guideHref="/guides/leverage-etf" input={input} result={resultNode} education={[{title:"일간 재설정",body:"대부분의 레버리지 ETF는 하루 단위 목표 수익률을 추종합니다. 장기 누적 수익률은 지수 누적 수익률의 단순 배수가 아닙니다."},{title:"가장 많이 하는 오해",body:"지수가 장기적으로 10% 상승하면 3배 ETF가 반드시 30% 상승하는 것은 아닙니다."},{title:"결과 해석",body:"실제 누적 결과와 기초지수 누적수익률의 단순 배수 차이를 경로 효과로 표시합니다."}]} assumptions={["레버리지 수익률은 각 입력 기간마다 다시 설정됩니다.","운용보수는 연간 수치를 기간별로 나누어 적용합니다.","계산상 가치가 0원 아래로 내려가면 0원으로 제한합니다."]}/>;
}
