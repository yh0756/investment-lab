export interface AssetInput { id: string; name: string; type: string; value: number; target: number; }
export type RebalanceMode = "trade" | "buy-only";
export interface RebalanceInput { assets: AssetInput[]; newMoney: number; mode: RebalanceMode; feeRate: number; minTradeUnit?: number; tolerance?: number; }
export interface RebalanceRow extends AssetInput { currentWeight: number; targetValue: number; difference: number; buy: number; sell: number; finalValue: number; finalWeight: number; }
export interface RebalanceResult { valid: boolean; totalTarget: number; currentTotal: number; finalTotal: number; rows: RebalanceRow[]; buyTotal: number; sellTotal: number; averageGap: number; exactPossible: boolean; }

export function calculateRebalancing(input: RebalanceInput): RebalanceResult {
  const totalTarget = input.assets.reduce((s, a) => s + a.target, 0);
  const currentTotal = input.assets.reduce((s, a) => s + a.value, 0);
  const finalTotal = currentTotal + input.newMoney;
  if (input.assets.length < 2 || Math.abs(totalTarget - 1) > 0.0001 || finalTotal < 0) return { valid: false, totalTarget, currentTotal, finalTotal, rows: [], buyTotal: 0, sellTotal: 0, averageGap: 0, exactPossible: false };
  const raw = input.assets.map((a) => ({ ...a, currentWeight: currentTotal > 0 ? a.value / currentTotal : 0, targetValue: finalTotal * a.target }));
  let allocations = raw.map(() => 0);
  let exactPossible = true;
  const tolerance = Math.max(0, input.tolerance ?? 0);
  const unit = Math.max(0, input.minTradeUnit ?? 0);
  const roundTrade = (amount: number, buyOnly = false) => {
    if (unit <= 0) return amount;
    return (buyOnly ? Math.floor(amount / unit) : Math.round(amount / unit)) * unit;
  };
  if (input.mode === "trade") allocations = raw.map((a) => Math.abs(a.target - a.currentWeight) <= tolerance ? 0 : roundTrade(a.targetValue - a.value));
  else {
    const deficits = raw.map((a) => Math.abs(a.target - a.currentWeight) <= tolerance ? 0 : Math.max(0, a.targetValue - a.value));
    const deficitTotal = deficits.reduce((s, v) => s + v, 0);
    allocations = deficitTotal > 0 ? deficits.map((d) => roundTrade(input.newMoney * d / deficitTotal, true)) : deficits;
    exactPossible = raw.every((a, i) => a.value + allocations[i] <= a.targetValue + 1) && deficits.reduce((s, v) => s + v, 0) <= input.newMoney + 1;
  }
  const preliminary = raw.map((a, i) => {
    const diff = allocations[i];
    const buy = Math.max(0, diff);
    const sell = Math.max(0, -diff);
    const finalValue = Math.max(0, a.value + buy - sell - (buy + sell) * input.feeRate);
    return { ...a, difference: a.target - a.currentWeight, buy, sell, finalValue };
  });
  const actualFinalTotal = preliminary.reduce((sum, row) => sum + row.finalValue, 0);
  const rows = preliminary.map((row) => ({ ...row, finalWeight: actualFinalTotal > 0 ? row.finalValue / actualFinalTotal : 0 }));
  return { valid: true, totalTarget, currentTotal, finalTotal: actualFinalTotal, rows, buyTotal: rows.reduce((s, r) => s + r.buy, 0), sellTotal: rows.reduce((s, r) => s + r.sell, 0), averageGap: rows.reduce((s, r) => s + Math.abs(r.difference), 0) / rows.length, exactPossible };
}
