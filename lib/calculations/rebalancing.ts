export interface AssetInput { id: string; name: string; type?: string; value: number; target: number; }
export type RebalanceMode = "trade" | "buy-only";
export interface RebalanceInput { assets: AssetInput[]; newMoney: number; mode: RebalanceMode; feeRate: number; minTradeUnit?: number; tolerance?: number; }
export interface RebalanceRow extends AssetInput { currentWeight: number; targetValue: number; difference: number; buy: number; sell: number; finalValue: number; finalWeight: number; }
export interface RebalanceResult { valid: boolean; totalTarget: number; currentTotal: number; finalTotal: number; rows: RebalanceRow[]; buyTotal: number; sellTotal: number; averageGap: number; exactPossible: boolean; }

export function calculateRebalancing(input: RebalanceInput): RebalanceResult {
  const totalTarget = input.assets.reduce((sum, asset) => sum + asset.target, 0);
  const currentTotal = input.assets.reduce((sum, asset) => sum + asset.value, 0);
  const plannedFinalTotal = currentTotal + input.newMoney;

  if (input.assets.length < 2 || Math.abs(totalTarget - 1) > 0.0001 || plannedFinalTotal < 0) {
    return {
      valid: false,
      totalTarget,
      currentTotal,
      finalTotal: plannedFinalTotal,
      rows: [],
      buyTotal: 0,
      sellTotal: 0,
      averageGap: 0,
      exactPossible: false,
    };
  }

  const raw = input.assets.map((asset) => ({
    ...asset,
    currentWeight: currentTotal > 0 ? asset.value / currentTotal : 0,
    targetValue: plannedFinalTotal * asset.target,
  }));

  const unit = Math.max(0, input.minTradeUnit ?? 0);
  const roundTrade = (amount: number, buyOnly = false) => {
    if (unit <= 0) return amount;
    return (buyOnly ? Math.floor(amount / unit) : Math.round(amount / unit)) * unit;
  };

  let allocations: number[];

  if (input.mode === "trade") {
    allocations = raw.map((asset) => roundTrade(asset.targetValue - asset.value));
  } else {
    const deficits = raw.map((asset) => Math.max(0, asset.targetValue - asset.value));
    const deficitTotal = deficits.reduce((sum, deficit) => sum + deficit, 0);
    allocations = deficitTotal > 0
      ? deficits.map((deficit) => roundTrade(input.newMoney * deficit / deficitTotal, true))
      : deficits;
  }

  const preliminary = raw.map((asset, index) => {
    const adjustment = allocations[index];
    const buy = Math.max(0, adjustment);
    const sell = Math.max(0, -adjustment);
    const transactionCost = (buy + sell) * input.feeRate;
    const finalValue = Math.max(0, asset.value + buy - sell - transactionCost);

    return {
      ...asset,
      difference: asset.target - asset.currentWeight,
      buy,
      sell,
      finalValue,
    };
  });

  const actualFinalTotal = preliminary.reduce((sum, row) => sum + row.finalValue, 0);
  const rows = preliminary.map((row) => ({
    ...row,
    finalWeight: actualFinalTotal > 0 ? row.finalValue / actualFinalTotal : 0,
  }));
  const finalGaps = rows.map((row) => Math.abs(row.finalWeight - row.target));
  const averageGap = finalGaps.length > 0
    ? finalGaps.reduce((sum, gap) => sum + gap, 0) / finalGaps.length
    : 0;
  const exactPossible = finalGaps.every((gap) => gap <= 0.0001);

  return {
    valid: true,
    totalTarget,
    currentTotal,
    finalTotal: actualFinalTotal,
    rows,
    buyTotal: rows.reduce((sum, row) => sum + row.buy, 0),
    sellTotal: rows.reduce((sum, row) => sum + row.sell, 0),
    averageGap,
    exactPossible,
  };
}
