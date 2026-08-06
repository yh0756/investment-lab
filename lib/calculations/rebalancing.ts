export interface AssetInput { id: string; name: string; type?: string; value: number; target: number; }
export type RebalanceMode = "trade" | "buy-only";
export interface RebalanceInput { assets: AssetInput[]; newMoney: number; mode: RebalanceMode; feeRate: number; minTradeUnit?: number; tolerance?: number; }
export interface RebalanceRow extends AssetInput { currentWeight: number; targetValue: number; difference: number; buy: number; sell: number; finalValue: number; finalWeight: number; }
export interface RebalanceResult {
  valid: boolean;
  totalTarget: number;
  currentTotal: number;
  finalTotal: number;
  rows: RebalanceRow[];
  buyTotal: number;
  sellTotal: number;
  transactionCostTotal: number;
  unallocatedCash: number;
  averageGap: number;
  exactPossible: boolean;
}

export function calculateRebalancing(input: RebalanceInput): RebalanceResult {
  const totalTarget = input.assets.reduce((sum, asset) => sum + asset.target, 0);
  const currentTotal = input.assets.reduce((sum, asset) => sum + asset.value, 0);
  const newMoney = Math.max(0, Number.isFinite(input.newMoney) ? input.newMoney : 0);
  const plannedFinalTotal = currentTotal + newMoney;

  if (input.assets.length < 2 || Math.abs(totalTarget - 1) > 0.0001 || plannedFinalTotal < 0) {
    return {
      valid: false,
      totalTarget,
      currentTotal,
      finalTotal: plannedFinalTotal,
      rows: [],
      buyTotal: 0,
      sellTotal: 0,
      transactionCostTotal: 0,
      unallocatedCash: 0,
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
      ? deficits.map((deficit) => roundTrade(newMoney * deficit / deficitTotal, true))
      : deficits;
  }

  if (input.mode === "trade" && unit > 0) {
    let netAllocation = allocations.reduce((sum, adjustment) => sum + adjustment, 0);
    while (netAllocation > newMoney + 0.0001) {
      const buyIndex = allocations.reduce(
        (largestIndex, adjustment, index, values) => adjustment > values[largestIndex] ? index : largestIndex,
        0,
      );
      if (allocations[buyIndex] <= 0) break;
      const reduction = Math.min(unit, allocations[buyIndex]);
      allocations[buyIndex] -= reduction;
      netAllocation -= reduction;
    }
  }

  const buyTotal = allocations.reduce((sum, adjustment) => sum + Math.max(0, adjustment), 0);
  const sellTotal = allocations.reduce((sum, adjustment) => sum + Math.max(0, -adjustment), 0);
  const transactionCostTotal = (buyTotal + sellTotal) * input.feeRate;
  const unallocatedCash = Math.max(0, newMoney + sellTotal - buyTotal);

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

  const investedAssetTotal = preliminary.reduce((sum, row) => sum + row.finalValue, 0);
  const finalTotal = investedAssetTotal + unallocatedCash;
  const rows = preliminary.map((row) => ({
    ...row,
    finalWeight: finalTotal > 0 ? row.finalValue / finalTotal : 0,
  }));
  const finalGaps = rows.map((row) => Math.abs(row.finalWeight - row.target));
  const averageGap = finalGaps.length > 0
    ? finalGaps.reduce((sum, gap) => sum + gap, 0) / finalGaps.length
    : 0;
  const exactPossible = finalGaps.every((gap) => gap <= 0.0001) && unallocatedCash <= 0.01;

  return {
    valid: true,
    totalTarget,
    currentTotal,
    finalTotal,
    rows,
    buyTotal,
    sellTotal,
    transactionCostTotal,
    unallocatedCash,
    averageGap,
    exactPossible,
  };
}
