"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Plus, Trash2 } from "lucide-react";
import { CalculatorActions } from "@/components/calculator-actions";
import { CalculatorShell } from "@/components/calculator-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NumberField } from "@/components/number-field";
import { MetricCard } from "@/components/metric-card";
import { ChartCard } from "@/components/chart-card";
import { ResultMessage } from "@/components/result-message";
import { AdvancedSettings } from "@/components/advanced-settings";
import { SecondaryResults } from "@/components/secondary-results";
import { useScenarioState } from "@/lib/hooks/use-scenario-state";
import { calculateRebalancing, type RebalanceMode } from "@/lib/calculations/rebalancing";
import { formatPercent, formatWon } from "@/lib/format";

interface Asset { id: string; name: string; type: string; value: number; target: number; }
interface State { assets: Asset[]; newMoney: number; mode: RebalanceMode; feeRate: number; minTradeUnit: number; tolerance: number; }
const exampleAssets: Asset[] = [
  { id: "a", name: "미국 성장주", type: "미국 주식", value: 50_000_000, target: 40 },
  { id: "b", name: "배당 ETF", type: "배당 ETF", value: 25_000_000, target: 30 },
  { id: "c", name: "채권", type: "채권", value: 15_000_000, target: 20 },
  { id: "d", name: "금", type: "금", value: 10_000_000, target: 10 },
];
const initialState: State = { assets: exampleAssets, newMoney: 5_000_000, mode: "buy-only", feeRate: 0, minTradeUnit: 10_000, tolerance: 1 };
const COLORS = ["#2563eb", "#0f766e", "#d97706", "#7c3aed", "#db2777", "#64748b", "#16a34a", "#dc2626"];
const ASSET_TYPES = ["국내 주식", "미국 주식", "배당 ETF", "성장 ETF", "채권", "금", "현금", "암호화폐", "기타"];

export function RebalancingCalculator() {
  const { value, setValue } = useScenarioState<State>("investment-lab-rebalance", initialState);
  const result = useMemo(() => calculateRebalancing({ assets: value.assets.map((asset) => ({ ...asset, target: asset.target / 100 })), newMoney: value.newMoney, mode: value.mode, feeRate: value.feeRate / 100, minTradeUnit: value.minTradeUnit, tolerance: value.tolerance / 100 }), [value]);
  const targetSum = value.assets.reduce((sum, asset) => sum + asset.target, 0);
  const updateAsset = (id: string, patch: Partial<Asset>) => setValue({ ...value, assets: value.assets.map((asset) => asset.id === id ? { ...asset, ...patch } : asset) });
  const remove = (id: string) => setValue({ ...value, assets: value.assets.filter((asset) => asset.id !== id) });
  const add = () => setValue({ ...value, assets: [...value.assets, { id: crypto.randomUUID(), name: "새 자산", type: "기타", value: 0, target: 0 }] });
  const equalize = () => { const count = value.assets.length; if (!count) return; const base = Math.floor(10000 / count) / 100; setValue({ ...value, assets: value.assets.map((asset, index) => ({ ...asset, target: index === count - 1 ? 100 - base * (count - 1) : base })) }); };
  const copyCurrent = () => { const total = value.assets.reduce((sum, asset) => sum + asset.value, 0); if (total <= 0) return; setValue({ ...value, assets: value.assets.map((asset) => ({ ...asset, target: asset.value / total * 100 })) }); };
  const applyPreset = (preset: "6040" | "growth" | "dividend" | "retirement") => {
    const sets: Record<typeof preset, Asset[]> = {
      "6040": [{ id: "p1", name: "주식", type: "미국 주식", value: 60_000_000, target: 60 }, { id: "p2", name: "채권", type: "채권", value: 40_000_000, target: 40 }],
      growth: [{ id: "p1", name: "성장 ETF", type: "성장 ETF", value: 55_000_000, target: 60 }, { id: "p2", name: "배당 ETF", type: "배당 ETF", value: 20_000_000, target: 20 }, { id: "p3", name: "채권", type: "채권", value: 15_000_000, target: 10 }, { id: "p4", name: "금", type: "금", value: 10_000_000, target: 10 }],
      dividend: [{ id: "p1", name: "배당 ETF", type: "배당 ETF", value: 45_000_000, target: 50 }, { id: "p2", name: "미국 주식", type: "미국 주식", value: 25_000_000, target: 20 }, { id: "p3", name: "채권", type: "채권", value: 20_000_000, target: 20 }, { id: "p4", name: "금", type: "금", value: 10_000_000, target: 10 }],
      retirement: [{ id: "p1", name: "배당 ETF", type: "배당 ETF", value: 30_000_000, target: 30 }, { id: "p2", name: "채권", type: "채권", value: 35_000_000, target: 40 }, { id: "p3", name: "주식", type: "국내 주식", value: 25_000_000, target: 20 }, { id: "p4", name: "현금", type: "현금", value: 10_000_000, target: 10 }],
    };
    setValue({ ...value, assets: sets[preset] });
  };
  const csvRows = result.rows.map((row) => ({ 자산: row.name, 현재금액: Math.round(row.value), 현재비중: row.currentWeight, 목표비중: row.target, 목표금액: Math.round(row.targetValue), 매수금액: Math.round(row.buy), 매도금액: Math.round(row.sell), 예상최종비중: row.finalWeight }));
  const chartData = result.rows.map((row) => ({ name: row.name, current: row.currentWeight * 100, target: row.target * 100, final: row.finalWeight * 100 }));
  const mostUnder = result.rows.length ? [...result.rows].sort((a, b) => b.difference - a.difference)[0] : null;
  const riskyTypes = new Set(["국내 주식", "미국 주식", "배당 ETF", "성장 ETF", "암호화폐"]);
  const riskWeight = result.currentTotal > 0 ? value.assets.filter((asset) => riskyTypes.has(asset.type)).reduce((sum, asset) => sum + asset.value, 0) / result.currentTotal : 0;

  const input = <>
    <Card>
      <CardHeader><div className="flex items-center justify-between"><div><CardTitle>포트폴리오 핵심 입력</CardTitle><p className="mt-1 text-xs text-slate-500">자산명·현재 금액·목표 비중만 입력합니다.</p></div><Button size="sm" variant="secondary" onClick={add}><Plus className="h-4 w-4" />자산 추가</Button></div></CardHeader>
      <CardContent className="space-y-3">
        {value.assets.map((asset) => <div key={asset.id} className="grid gap-2 rounded-xl border border-slate-200 p-3 sm:grid-cols-[1.2fr_1fr_0.8fr_auto]">
          <input aria-label="자산명" className="h-10 rounded-lg border px-2 text-sm" value={asset.name} onChange={(event) => updateAsset(asset.id, { name: event.target.value })} />
          <input aria-label={`${asset.name} 현재 평가금액`} inputMode="numeric" className="h-10 rounded-lg border px-2 text-sm" value={asset.value} onChange={(event) => updateAsset(asset.id, { value: Math.max(0, Number(event.target.value) || 0) })} />
          <div className="relative"><input aria-label={`${asset.name} 목표 비중`} inputMode="decimal" className="h-10 w-full rounded-lg border px-2 pr-7 text-sm" value={asset.target} onChange={(event) => updateAsset(asset.id, { target: Math.max(0, Number(event.target.value) || 0) })} /><span className="absolute right-2 top-2.5 text-xs text-slate-400">%</span></div>
          <Button aria-label={`${asset.name} 삭제`} variant="ghost" size="sm" onClick={() => remove(asset.id)}><Trash2 className="h-4 w-4 text-negative" /></Button>
        </div>)}
        <div className="flex flex-wrap gap-2"><Button size="sm" variant="secondary" onClick={equalize}>균등 비중</Button><Button size="sm" variant="secondary" onClick={copyCurrent}>현재 비중 복사</Button></div>
        <div className={`rounded-xl p-3 text-sm font-bold ${Math.abs(targetSum - 100) < 0.01 ? "bg-green-50 text-positive" : "bg-red-50 text-negative"}`}>목표 비중 합계: {targetSum.toFixed(2)}%</div>
      </CardContent>
    </Card>
    <Card><CardHeader><CardTitle>리밸런싱 방식</CardTitle></CardHeader><CardContent className="space-y-5"><NumberField label="신규 투자 가능 금액" value={value.newMoney} onChange={(newMoney) => setValue({ ...value, newMoney })} min={0} unit="원" /><div className="grid grid-cols-2 gap-2"><Button variant={value.mode === "trade" ? "default" : "secondary"} onClick={() => setValue({ ...value, mode: "trade" })}>매수·매도 허용</Button><Button variant={value.mode === "buy-only" ? "default" : "secondary"} onClick={() => setValue({ ...value, mode: "buy-only" })}>신규자금만 활용</Button></div></CardContent></Card>
    <AdvancedSettings title="프리셋·자산 분류·거래 조건" description="계산에 필수적이지 않은 분류와 거래 세부값입니다.">
      <div className="space-y-5">
        <div><p className="mb-2 text-sm font-semibold text-slate-700">포트폴리오 예시</p><div className="grid grid-cols-2 gap-2"><Button size="sm" variant="secondary" onClick={() => applyPreset("6040")}>60/40</Button><Button size="sm" variant="secondary" onClick={() => applyPreset("growth")}>성장형</Button><Button size="sm" variant="secondary" onClick={() => applyPreset("dividend")}>배당형</Button><Button size="sm" variant="secondary" onClick={() => applyPreset("retirement")}>은퇴형</Button></div></div>
        <div className="space-y-2"><p className="text-sm font-semibold text-slate-700">자산 유형</p>{value.assets.map((asset) => <label key={asset.id} className="grid grid-cols-[1fr_1fr] items-center gap-3 text-sm"><span className="truncate font-semibold text-slate-600">{asset.name}</span><select aria-label={`${asset.name} 자산 유형`} className="h-10 rounded-lg border px-2" value={asset.type} onChange={(event) => updateAsset(asset.id, { type: event.target.value })}>{ASSET_TYPES.map((type) => <option key={type}>{type}</option>)}</select></label>)}</div>
        <NumberField label="거래비용" value={value.feeRate} onChange={(feeRate) => setValue({ ...value, feeRate })} min={0} max={5} unit="%" />
        <NumberField label="최소 거래단위" value={value.minTradeUnit} onChange={(minTradeUnit) => setValue({ ...value, minTradeUnit })} min={0} unit="원" />
        <NumberField label="허용 오차 범위" value={value.tolerance} onChange={(tolerance) => setValue({ ...value, tolerance })} min={0} max={20} unit="%p" />
      </div>
    </AdvancedSettings>
  </>;

  const resultNode = !result.valid ? <Card><CardContent className="p-6"><p className="font-bold text-negative">목표 비중 합계를 100%로 맞추고 자산을 2개 이상 입력해 주세요.</p></CardContent></Card> : <>
    <div className="grid gap-3 sm:grid-cols-3"><MetricCard label="현재 총자산" value={formatWon(result.currentTotal)} /><MetricCard label="매수 필요 총액" value={formatWon(result.buyTotal)} tone="positive" /><MetricCard label="매도 필요 총액" value={formatWon(result.sellTotal)} tone="negative" /></div>
    <ResultMessage conclusion={value.mode === "buy-only" ? `${formatWon(value.newMoney)}의 신규자금을 목표보다 부족한 자산에 우선 배분합니다.` : `목표 비중에 맞추기 위해 매수 ${formatWon(result.buyTotal)}, 매도 ${formatWon(result.sellTotal)}가 필요합니다.`} reason={mostUnder ? `${mostUnder.name}의 현재 비중은 ${formatPercent(mostUnder.currentWeight)}이며 목표 비중 ${formatPercent(mostUnder.target)}보다 ${formatPercent(mostUnder.difference)} 부족합니다.` : "자산별 현재 비중과 목표 비중을 비교했습니다."} warning={!result.exactPossible && value.mode === "buy-only" ? "현재 일부 자산 비중이 목표보다 높아 신규 투자만으로는 목표 비중을 정확히 맞출 수 없습니다." : undefined} />
    <ChartCard title="현재 비중과 목표 비중"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis unit="%" /><Tooltip formatter={(number) => `${Number(number).toFixed(1)}%`} /><Legend /><Bar dataKey="current" name="현재 비중" fill="#64748b" /><Bar dataKey="target" name="목표 비중" fill="#2563eb" /></BarChart></ResponsiveContainer></ChartCard>
    <SecondaryResults><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"><MetricCard label="신규 투자 후 총자산" value={formatWon(result.finalTotal)} /><MetricCard label="평균 비중 차이" value={formatPercent(result.averageGap)} tone="caution" /><MetricCard label="가장 부족한 자산" value={mostUnder?.name ?? "-"} /><MetricCard label="위험자산 비중" value={formatPercent(riskWeight)} tone={riskWeight > 0.8 ? "caution" : "default"} /><MetricCard label="안전자산 비중" value={formatPercent(1 - riskWeight)} /></div></SecondaryResults>
    <AdvancedSettings title="구성 차트와 자산별 조정표" description="리밸런싱 전후 구성과 매수·매도 금액을 자세히 확인합니다.">
      <div className="space-y-4"><div className="grid gap-4 md:grid-cols-2"><ChartCard title="현재 포트폴리오"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={chartData} dataKey="current" nameKey="name" outerRadius={90} label>{chartData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip formatter={(number) => `${Number(number).toFixed(1)}%`} /></PieChart></ResponsiveContainer></ChartCard><ChartCard title="리밸런싱 후 포트폴리오"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={chartData} dataKey="final" nameKey="name" outerRadius={90} label>{chartData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip formatter={(number) => `${Number(number).toFixed(1)}%`} /></PieChart></ResponsiveContainer></ChartCard></div><Card><CardHeader><CardTitle>자산별 조정 결과</CardTitle></CardHeader><CardContent><div className="overflow-x-auto"><table className="min-w-[850px] w-full text-sm"><thead><tr className="border-b text-left"><th className="py-2">자산</th><th>현재 비중</th><th>목표 비중</th><th>목표 금액</th><th>매수</th><th>매도</th><th>예상 비중</th></tr></thead><tbody>{result.rows.map((row) => <tr key={row.id} className="border-b border-slate-100"><td className="py-3 font-bold">{row.name}</td><td>{formatPercent(row.currentWeight)}</td><td>{formatPercent(row.target)}</td><td>{formatWon(row.targetValue)}</td><td className="text-positive">{formatWon(row.buy)}</td><td className="text-negative">{formatWon(row.sell)}</td><td>{formatPercent(row.finalWeight)}</td></tr>)}</tbody></table></div></CardContent></Card></div>
    </AdvancedSettings>
  </>;

  return <CalculatorShell title="포트폴리오 리밸런싱 계산기" description="현재 자산과 목표 비중을 비교해 매수·매도 금액 또는 신규 투자금의 우선 배분안을 계산합니다." headline="어떤 자산을 더 살지 고민하기 전에 현재 비중과 목표 비중의 차이를 확인해보세요." actions={<CalculatorActions value={value} reset={() => setValue(initialState)} example={() => setValue(initialState)} csvRows={csvRows} csvName="포트폴리오-리밸런싱.csv" />} input={input} result={resultNode} education={[{ title: "리밸런싱", body: "목표 자산배분에서 벗어난 비중을 다시 조정하는 과정입니다. 수익이 난 자산 일부를 줄이고 부족한 자산을 채울 수 있습니다." }, { title: "신규자금 방식", body: "매도를 피하고 새 투자금만으로 부족 자산을 채웁니다. 이미 과대 비중인 자산이 있으면 목표를 정확히 맞추기 어렵습니다." }, { title: "가장 많이 하는 오해", body: "최근 수익률이 좋은 자산을 계속 더 사는 방식은 위험 집중을 키울 수 있습니다." }]} assumptions={["자산 유형은 분류용이며 계산에는 직접 영향을 주지 않습니다.", "매수·매도 허용 방식은 신규 투자 후 총자산을 기준으로 목표금액을 계산합니다.", `거래금액은 ${formatWon(value.minTradeUnit)} 단위로 반올림하고 목표 비중 오차 ${value.tolerance}%p 이내는 조정하지 않습니다.`]} />;
}
