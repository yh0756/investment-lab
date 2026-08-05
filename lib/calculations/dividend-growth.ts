export interface DividendPlan {
  name: string;
  price: number;
  yieldRate: number;
  dividendGrowth: number;
  priceGrowth: number;
  fee: number;
  growthYears?: number;
  laterDividendGrowth?: number;
}
export interface DividendInput {
  initial: number;
  years: number;
  taxRate: number;
  reinvest: boolean;
  paymentsPerYear?: 1 | 12;
  fractionalShares?: boolean;
  plans: [DividendPlan, DividendPlan];
}
export interface DividendRow { year: number; aDividend: number; bDividend: number; aCumulative: number; bCumulative: number; aAsset: number; bAsset: number; }
export interface DividendResult { rows: DividendRow[]; annualCrossover: number | null; cumulativeCrossover: number | null; assetCrossover: number | null; firstDividend: [number, number]; finalDividend: [number, number]; cumulative: [number, number]; finalAsset: [number, number]; }

interface PlanState { shares: number; price: number; dividendPerShare: number; cumulative: number; asset: number; cash: number; }
export function calculateDividendGrowth(input: DividendInput): DividendResult {
  const payments = input.paymentsPerYear ?? 1;
  const fractional = input.fractionalShares ?? true;
  const states: [PlanState, PlanState] = input.plans.map((p) => ({ shares: input.initial / p.price, price: p.price, dividendPerShare: p.price * p.yieldRate, cumulative: 0, asset: input.initial, cash: 0 })) as [PlanState, PlanState];
  const rows: DividendRow[] = [];
  let annualCrossover: number | null = null;
  let cumulativeCrossover: number | null = null;
  let assetCrossover: number | null = null;
  let previousAnnualDiff: number | null = null;
  let previousCumulativeDiff: number | null = null;
  let previousAssetDiff: number | null = null;
  for (let year = 1; year <= input.years; year += 1) {
    const annual: [number, number] = [0, 0];
    states.forEach((s, i) => {
      const p = input.plans[i];
      const annualPriceFactor = Math.max(0, 1 + p.priceGrowth - p.fee);
      const periodPriceFactor = Math.pow(annualPriceFactor, 1 / payments);
      for (let period = 0; period < payments; period += 1) {
        s.price *= periodPriceFactor;
        const payout = s.shares * (s.dividendPerShare / payments) * (1 - input.taxRate);
        annual[i] += payout;
        s.cumulative += payout;
        if (input.reinvest && s.price > 0) {
          const available = s.cash + payout;
          const purchased = fractional ? available / s.price : Math.floor(available / s.price);
          s.shares += purchased;
          s.cash = available - purchased * s.price;
        }
      }
      s.asset = s.shares * s.price + (input.reinvest ? s.cash : s.cumulative);
      const growthYears = p.growthYears ?? input.years;
      const growth = year <= growthYears ? p.dividendGrowth : (p.laterDividendGrowth ?? p.dividendGrowth);
      s.dividendPerShare *= Math.max(0, 1 + growth);
    });
    const annualDiff = annual[1] - annual[0];
    const cumulativeDiff = states[1].cumulative - states[0].cumulative;
    const assetDiff = states[1].asset - states[0].asset;
    if (annualCrossover === null && annualDiff > 0 && (previousAnnualDiff === null || previousAnnualDiff <= 0)) annualCrossover = year;
    if (cumulativeCrossover === null && cumulativeDiff > 0 && (previousCumulativeDiff === null || previousCumulativeDiff <= 0)) cumulativeCrossover = year;
    if (assetCrossover === null && assetDiff > 0 && (previousAssetDiff === null || previousAssetDiff <= 0)) assetCrossover = year;
    previousAnnualDiff = annualDiff; previousCumulativeDiff = cumulativeDiff; previousAssetDiff = assetDiff;
    rows.push({ year, aDividend: annual[0], bDividend: annual[1], aCumulative: states[0].cumulative, bCumulative: states[1].cumulative, aAsset: states[0].asset, bAsset: states[1].asset });
  }
  const first = rows[0] ?? { aDividend: 0, bDividend: 0 };
  const last = rows.at(-1) ?? { aDividend: 0, bDividend: 0, aCumulative: 0, bCumulative: 0, aAsset: 0, bAsset: 0 };
  return { rows, annualCrossover, cumulativeCrossover, assetCrossover, firstDividend: [first.aDividend, first.bDividend], finalDividend: [last.aDividend, last.bDividend], cumulative: [last.aCumulative, last.bCumulative], finalAsset: [last.aAsset, last.bAsset] };
}
