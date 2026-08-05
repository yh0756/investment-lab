export type BuybackTiming = "begin" | "average" | "end";
export interface BuybackInput {
  netIncome: number;
  shares: number;
  price: number;
  buybackAmount: number;
  averagePrice: number;
  incomeGrowth: number;
  newShares: number;
  dilutedShares: number;
  interestCost: number;
  taxRate: number;
  analysisYears?: number;
  timing?: BuybackTiming;
}
export interface BuybackResult { marketCap: number; purchasedShares: number; finalShares: number; weightedShares: number; expectedIncome: number; currentEps: number; growthOnlyEps: number; finalEps: number; businessEffect: number; shareEffect: number; totalEpsGrowth: number; buybackYield: number; grossReduction: number; netReduction: number; premium: number; }
export function calculateBuyback(input: BuybackInput): BuybackResult {
  const years = Math.max(0, input.analysisYears ?? 1);
  const timingWeight = input.timing === "begin" ? 1 : input.timing === "end" ? 0 : 0.5;
  const marketCap = input.price * input.shares;
  const purchasedShares = input.averagePrice > 0 ? Math.min(input.shares, input.buybackAmount / input.averagePrice) : 0;
  const finalShares = Math.max(1, input.shares - purchasedShares + input.newShares + input.dilutedShares);
  const weightedShares = Math.max(1, input.shares - purchasedShares * timingWeight + input.newShares + input.dilutedShares);
  const afterTaxInterest = input.interestCost * (1 - input.taxRate) * years;
  const expectedIncome = Math.max(0, input.netIncome * Math.pow(Math.max(0, 1 + input.incomeGrowth), years) - afterTaxInterest);
  const currentEps = input.shares > 0 ? input.netIncome / input.shares : 0;
  const growthOnlyEps = input.shares > 0 ? expectedIncome / input.shares : 0;
  const finalEps = expectedIncome / weightedShares;
  return {
    marketCap, purchasedShares, finalShares, weightedShares, expectedIncome, currentEps, growthOnlyEps, finalEps,
    businessEffect: currentEps > 0 ? growthOnlyEps / currentEps - 1 : 0,
    shareEffect: growthOnlyEps > 0 ? finalEps / growthOnlyEps - 1 : 0,
    totalEpsGrowth: currentEps > 0 ? finalEps / currentEps - 1 : 0,
    buybackYield: marketCap > 0 ? input.buybackAmount / marketCap : 0,
    grossReduction: input.shares > 0 ? purchasedShares / input.shares : 0,
    netReduction: input.shares > 0 ? (input.shares - finalShares) / input.shares : 0,
    premium: input.price > 0 ? input.averagePrice / input.price - 1 : 0,
  };
}
