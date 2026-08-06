"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Plus, Trash2 } from "lucide-react";
import { CalculatorShell } from "@/components/calculator-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NumberField } from "@/components/number-field";
import { MetricCard } from "@/components/metric-card";
import { ChartCard } from "@/components/chart-card";
import { AdvancedSettings } from "@/components/advanced-settings";
import { SecondaryResults } from "@/components/secondary-results";
import { useScenarioState } from "@/lib/hooks/use-scenario-state";
import { calculateRebalancing } from "@/lib/calculations/rebalancing";
import { formatPercent, formatWon } from "@/lib/format";

interface Asset { id: string; name: string; type: string; value: number; target: number; }
interface State { assets: Asset[]; newMoney: number; feeRate: number; minTradeUnit: number; tolerance: number; }
const exampleAssets: Asset[] = [
  { id: "a", name: "미국 성장주", type: "미국 주식", value: 50_000_000, target: 40 },
  { id: "b", name: "배당 ETF", type: "배당 ETF", value: 25_000_000, target: 30 },
  { id: "c", name: "채권", type: "채권", value: 15_000_000, target: 20 },
  { id: "d", name: "금", type: "금", value: 10_000_000, target: 10 },
];
const initialState: State = { assets: exampleAssets, newMoney: 5_000_000, feeRate: 0, minTradeUnit: 10_000, tolerance: 1 };
const COLORS = ["#2563eb", "#0f766e", "#d97706", "#7c3aed", "#db2777", "#64748b", "#16a34a", "#dc2626"];
const ASSET_TYPES = ["국내 주식", "미국 주식", "배당 ETF", "성장 ETF", "채권", "금", "현금", "암호화폐", "기타"];

export function RebalancingCalculator() {
  const { value, setValue } = useScenarioState<State>("investment-lab-rebalance", initialState);
  const normalizedAssets = useMemo(() => value.assets.map((asset) => ({ ...asset, target: asset.target / 100 })), [value.assets]);
  const tradePlan = useMemo(() => calculateRebalancing({ assets: normalizedAssets, newMoney: value.newMoney, mode: "trade", feeRate: value.feeRate / 100, minTradeUnit: value.minTradeUnit, tolerance: value.tolerance / 100 }), [normalizedAssets, value.newMoney, value.feeRate, value.minTradeUnit, value.tolerance]);
  const buyOnlyPlan = useMemo(() => calculateRebalancing({ assets: normalizedAssets, newMoney: value.newMoney, mode: "buy-only", feeRate: value.feeRate / 100, minTradeUnit: value.minTradeUnit, tolerance: value.tolerance / 100 }), [normalizedAssets, value.newMoney, value.feeRate, value.minTradeUnit, value.tolerance]);
  const result = buyOnlyPlan;
  const targetSum = value.assets.reduce((sum, asset) => sum + asset.target, 0);
  const inputCurrentTotal = value.assets.reduce((sum, asset) => sum + asset.value, 0);
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
  const chartData = result.rows.map((row) => ({ name: row.name, current: row.currentWeight * 100, target: row.target * 100, final: row.finalWeight * 100 }));
  const riskyTypes = new Set(["국내 주식", "미국 주식", "배당 ETF", "성장 ETF", "암호화폐"]);
  const riskWeight = result.currentTotal > 0 ? value.assets.filter((asset) => riskyTypes.has(asset.type)).reduce((sum, asset) => sum + asset.value, 0) / result.currentTotal : 0;
  const toleranceRate = value.tolerance / 100;
  const formatPoint = (rate: number) => `${(Math.abs(rate) * 100).toFixed(2)}%p`;
  const summarizePlan = (plan: typeof result) => {
    const adjustmentRows = plan.rows.filter((row) => row.buy > 0.5 || row.sell > 0.5);
    const gapRows = plan.rows.map((row) => ({ ...row, finalGap: row.finalWeight - row.target }));
    const maxGapRow = gapRows.length
      ? [...gapRows].sort((a, b) => Math.abs(b.finalGap) - Math.abs(a.finalGap))[0]
      : null;
    const maxGap = maxGapRow ? Math.abs(maxGapRow.finalGap) : 0;
    return {
      adjustmentRows,
      maxGapRow,
      maxGap,
      withinTolerance: maxGap <= toleranceRate,
      excess: Math.max(0, maxGap - toleranceRate),
      structure: adjustmentRows.length
        ? adjustmentRows.map((row) => `${row.name} ${row.buy > 0 ? `${formatWon(row.buy)} 매수` : `${formatWon(row.sell)} 매도`}`).join(" · ")
        : "조정 없음",
    };
  };
  const tradeSummary = summarizePlan(tradePlan);
  const buyOnlySummary = summarizePlan(buyOnlyPlan);


  const input = <>
    <Card>
      <CardHeader><div className="flex items-center justify-between"><div><CardTitle>포트폴리오 핵심 입력</CardTitle><p className="mt-1 text-xs text-slate-500">자산명·현재 금액·목표 비중만 입력합니다.</p></div><Button size="sm" variant="secondary" onClick={add}><Plus className="h-4 w-4" />자산 추가</Button></div></CardHeader>
      <CardContent className="space-y-3">
        {value.assets.map((asset, index) => {
          const currentWeight = inputCurrentTotal > 0 ? asset.value / inputCurrentTotal * 100 : 0;
          return <div key={asset.id} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-400">자산 {index + 1}</p>
                <p className="mt-0.5 truncate text-sm font-bold text-slate-700">{asset.name || "이름 없는 자산"}</p>
              </div>
              <Button aria-label={`${asset.name} 삭제`} variant="ghost" size="sm" className="shrink-0" onClick={() => remove(asset.id)}><Trash2 className="h-4 w-4 text-negative" /></Button>
            </div>
            <div className="min-w-0 space-y-3">
              <label className="block min-w-0">
                <span className="mb-1.5 block text-xs font-bold text-slate-600">자산명</span>
                <input aria-label="자산명" className="h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" value={asset.name} onChange={(event) => updateAsset(asset.id, { name: event.target.value })} />
              </label>
              <div className="grid min-w-0 grid-cols-[minmax(0,1.65fr)_minmax(96px,0.75fr)] gap-3">
                <div className="min-w-0">
                  <NumberField
                    label="현재 평가금액"
                    value={asset.value}
                    onChange={(assetValue) => updateAsset(asset.id, { value: assetValue })}
                    min={0}
                    unit="만원"
                    inputScale={10_000}
                  />
                  <span className="mt-1 block truncate text-xs text-slate-400">{formatWon(asset.value)} · 현재 {currentWeight.toFixed(1)}%</span>
                </div>
                <label className="min-w-0">
                  <span className="mb-1.5 block text-xs font-bold text-slate-600">목표 비중</span>
                  <div className="relative min-w-0">
                    <input aria-label={`${asset.name} 목표 비중`} inputMode="decimal" className="h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 pr-8 text-sm font-bold outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" value={asset.target} onChange={(event) => updateAsset(asset.id, { target: Math.max(0, Number(event.target.value) || 0) })} />
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-bold text-slate-500">%</span>
                  </div>
                  <span className="mt-1 block truncate text-xs text-slate-400">원하는 최종 비중</span>
                </label>
              </div>
            </div>
          </div>;
        })}
        <div className="flex flex-wrap gap-2"><Button size="sm" variant="secondary" onClick={equalize}>균등 비중</Button><Button size="sm" variant="secondary" onClick={copyCurrent}>현재 비중 복사</Button></div>
        <div className={`rounded-2xl border p-4 ${Math.abs(targetSum - 100) < 0.01 ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className={`text-sm font-bold ${Math.abs(targetSum - 100) < 0.01 ? "text-positive" : "text-orange-700"}`}>목표 비중 합계</p>
              <p className="mt-1 text-xs text-slate-500">모든 자산의 목표 비중 합계가 100%여야 계산됩니다.</p>
            </div>
            <strong className={`shrink-0 text-lg ${Math.abs(targetSum - 100) < 0.01 ? "text-positive" : "text-orange-700"}`}>{targetSum.toFixed(2)}%</strong>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/80">
            <div className={`h-full rounded-full transition-all ${Math.abs(targetSum - 100) < 0.01 ? "bg-green-500" : "bg-orange-500"}`} style={{ width: `${Math.min(Math.max(targetSum, 0), 100)}%` }} />
          </div>
          {Math.abs(targetSum - 100) >= 0.01 && <p className="mt-2 text-xs font-semibold text-orange-700">{targetSum < 100 ? `${(100 - targetSum).toFixed(2)}%p를 더 배분해 주세요.` : `${(targetSum - 100).toFixed(2)}%p를 줄여 주세요.`}</p>}
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>리밸런싱 조건</CardTitle>
        <p className="mt-1 text-xs text-slate-500">신규 투자금과 실제 거래 조건을 입력합니다.</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <NumberField label="신규 투자 가능 금액" value={value.newMoney} onChange={(newMoney) => setValue({ ...value, newMoney })} min={0} unit="만원" inputScale={10_000} />
        <NumberField label="최소 거래단위" value={value.minTradeUnit} onChange={(minTradeUnit) => setValue({ ...value, minTradeUnit })} min={0} unit="만원" inputScale={10_000} />
        <NumberField label="거래비용" value={value.feeRate} onChange={(feeRate) => setValue({ ...value, feeRate })} min={0} max={5} unit="%" />
        <NumberField label="허용 오차 범위" value={value.tolerance} onChange={(tolerance) => setValue({ ...value, tolerance })} min={0} max={20} unit="%p" />
      </CardContent>
    </Card>
    <AdvancedSettings title="프리셋·자산 분류" description="예시 포트폴리오와 자산 유형만 필요할 때 설정합니다.">
      <div className="space-y-5">
        <div><p className="mb-2 text-sm font-semibold text-slate-700">포트폴리오 예시</p><div className="grid grid-cols-2 gap-2"><Button size="sm" variant="secondary" onClick={() => applyPreset("6040")}>60/40</Button><Button size="sm" variant="secondary" onClick={() => applyPreset("growth")}>성장형</Button><Button size="sm" variant="secondary" onClick={() => applyPreset("dividend")}>배당형</Button><Button size="sm" variant="secondary" onClick={() => applyPreset("retirement")}>은퇴형</Button></div></div>
        <div className="space-y-2"><p className="text-sm font-semibold text-slate-700">자산 유형</p>{value.assets.map((asset) => <label key={asset.id} className="grid grid-cols-[1fr_1fr] items-center gap-3 text-sm"><span className="truncate font-semibold text-slate-600">{asset.name}</span><select aria-label={`${asset.name} 자산 유형`} className="h-10 rounded-lg border px-2" value={asset.type} onChange={(event) => updateAsset(asset.id, { type: event.target.value })}>{ASSET_TYPES.map((type) => <option key={type}>{type}</option>)}</select></label>)}</div>
      </div>
    </AdvancedSettings>
  </>;

  const resultNode = !result.valid ? <Card><CardContent className="p-6"><p className="font-bold text-negative">목표 비중 합계를 100%로 맞추고 자산을 2개 이상 입력해 주세요.</p></CardContent></Card> : <>
    <Card>
      <CardHeader>
        <div>
          <CardTitle>허용 오차 기준 리밸런싱 비교</CardTitle>
          <p className="mt-1 text-xs leading-5 text-slate-500">같은 신규 투자금과 거래 조건으로 두 방식의 조정 구조를 비교합니다.</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-black text-slate-900">매수·매도 허용</p>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-black ${tradeSummary.withinTolerance ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                {tradeSummary.withinTolerance ? "허용 범위 내" : `초과 ${formatPoint(tradeSummary.excess)}`}
              </span>
            </div>
            <p className="mt-3 text-sm font-bold text-slate-800">매수 {formatWon(tradePlan.buyTotal)} · 매도 {formatWon(tradePlan.sellTotal)}</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">{tradeSummary.structure}</p>
            <p className="mt-2 text-xs font-semibold text-slate-500">최대 오차 {formatPoint(tradeSummary.maxGap)}{tradeSummary.maxGapRow ? ` · ${tradeSummary.maxGapRow.name}` : ""}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-black text-slate-900">신규자금만 활용</p>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-black ${buyOnlySummary.withinTolerance ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                {buyOnlySummary.withinTolerance ? "허용 범위 내" : `초과 ${formatPoint(buyOnlySummary.excess)}`}
              </span>
            </div>
            <p className="mt-3 text-sm font-bold text-slate-800">신규자금 {formatWon(value.newMoney)} · 배분 {formatWon(buyOnlyPlan.buyTotal)}</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">{buyOnlySummary.structure}</p>
            <p className="mt-2 text-xs font-semibold text-slate-500">최대 오차 {formatPoint(buyOnlySummary.maxGap)}{buyOnlySummary.maxGapRow ? ` · ${buyOnlySummary.maxGapRow.name}` : ""}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <ChartCard title="현재 비중과 목표 비중"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis unit="%" /><Tooltip formatter={(number) => `${Number(number).toFixed(1)}%`} /><Legend /><Bar dataKey="current" name="현재 비중" fill="#64748b" /><Bar dataKey="target" name="목표 비중" fill="#2563eb" /></BarChart></ResponsiveContainer></ChartCard>
    <SecondaryResults><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"><MetricCard label="조정 후 총자산" value={formatWon(result.finalTotal)} /><MetricCard label="평균 목표 비중 오차" value={formatPoint(result.averageGap)} tone="caution" /><MetricCard label="최대 목표 비중 오차" value={formatPoint(buyOnlySummary.maxGap)} tone={buyOnlySummary.maxGap > toleranceRate ? "caution" : "positive"} /><MetricCard label="위험자산 비중" value={formatPercent(riskWeight)} tone={riskWeight > 0.8 ? "caution" : "default"} /><MetricCard label="안전자산 비중" value={formatPercent(1 - riskWeight)} /></div></SecondaryResults>
    <AdvancedSettings title="구성 차트와 자산별 조정표" description="신규자금만 활용 기준의 구성과 자산별 배분 결과를 자세히 확인합니다.">
      <div className="space-y-4"><div className="grid gap-4 md:grid-cols-2"><ChartCard title="현재 포트폴리오"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={chartData} dataKey="current" nameKey="name" outerRadius={90} label={({ value }) => `${Number(value).toFixed(2)}%`}>{chartData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip formatter={(number) => `${Number(number).toFixed(2)}%`} /></PieChart></ResponsiveContainer></ChartCard><ChartCard title="리밸런싱 후 포트폴리오"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={chartData} dataKey="final" nameKey="name" outerRadius={90} label={({ value }) => `${Number(value).toFixed(2)}%`}>{chartData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip formatter={(number) => `${Number(number).toFixed(2)}%`} /></PieChart></ResponsiveContainer></ChartCard></div><Card><CardHeader><CardTitle>신규자금만 활용 기준 자산별 조정 결과</CardTitle></CardHeader><CardContent><div className="overflow-x-auto"><table className="min-w-[950px] w-full text-sm"><thead><tr className="border-b text-left"><th className="py-2">자산</th><th>현재 비중</th><th>목표 비중</th><th>목표 금액</th><th>매수</th><th>매도</th><th>예상 비중</th><th>목표 오차</th></tr></thead><tbody>{result.rows.map((row) => <tr key={row.id} className="border-b border-slate-100"><td className="py-3 font-bold">{row.name}</td><td>{formatPercent(row.currentWeight)}</td><td>{formatPercent(row.target)}</td><td>{formatWon(row.targetValue)}</td><td className="text-positive">{formatWon(row.buy)}</td><td className="text-negative">{formatWon(row.sell)}</td><td>{formatPercent(row.finalWeight)}</td><td className={Math.abs(row.finalWeight - row.target) > toleranceRate ? "font-bold text-caution" : "text-positive"}>{`${((row.finalWeight - row.target) * 100).toFixed(2)}%p`}</td></tr>)}</tbody></table></div></CardContent></Card></div>
    </AdvancedSettings>
  </>;

  return <CalculatorShell title="포트폴리오 리밸런싱 계산기" description="현재 자산과 목표 비중을 비교해 매수·매도 금액 또는 신규 투자금의 우선 배분안을 계산합니다." headline="어떤 자산을 더 살지 고민하기 전에 현재 비중과 목표 비중의 차이를 확인해보세요." guideHref="/guides/portfolio-rebalancing" input={input} result={resultNode} education={[{ title: "리밸런싱", body: "목표 자산배분에서 벗어난 비중을 다시 조정하는 과정입니다. 수익이 난 자산 일부를 줄이고 부족한 자산을 채울 수 있습니다." }, { title: "신규자금 방식", body: "매도를 피하고 새 투자금만으로 부족 자산을 채웁니다. 이미 과대 비중인 자산이 있으면 목표를 정확히 맞추기 어렵습니다." }, { title: "가장 많이 하는 오해", body: "최근 수익률이 좋은 자산을 계속 더 사는 방식은 위험 집중을 키울 수 있습니다." }]} assumptions={["자산 유형은 분류용이며 계산에는 직접 영향을 주지 않습니다.", "결과에서는 매수·매도 허용 방식과 신규자금만 활용 방식을 같은 조건으로 비교합니다.", `거래금액은 ${formatWon(value.minTradeUnit)} 단위로 반올림합니다. 허용 오차 ${value.tolerance}%p는 조정을 막는 기준이 아니라 최종 목표 비중과의 차이를 비교하는 기준으로 사용합니다.`]} />;
}
