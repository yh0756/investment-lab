export interface LeverageInput {
  initial: number;
  leverage: number;
  annualFee: number;
  periodsPerYear: number;
  returns: number[];
}
export interface LeverageRow { period: number; marketReturn: number; marketValue: number; etfValue: number; simpleValue: number; leveragedPeriodReturn: number; }
export interface LeverageResult { rows: LeverageRow[]; marketReturn: number; etfReturn: number; simpleReturn: number; pathEffect: number; finalMarket: number; finalEtf: number; feeImpact: number; }

export function calculateLeverage(input: LeverageInput): LeverageResult {
  const initial = Math.max(0, Number.isFinite(input.initial) ? input.initial : 0);
  const feePerPeriod = input.annualFee / Math.max(1, input.periodsPerYear);
  let market = initial;
  let etf = initial;
  let etfWithoutFee = initial;
  const rows: LeverageRow[] = [{ period: 0, marketReturn: 0, marketValue: market, etfValue: etf, simpleValue: initial, leveragedPeriodReturn: 0 }];

  input.returns.forEach((r, index) => {
    market *= Math.max(0, 1 + r);
    const leveraged = input.leverage * r - feePerPeriod;
    etf *= Math.max(0, 1 + leveraged);
    etfWithoutFee *= Math.max(0, 1 + input.leverage * r);
    const cumulativeMarket = initial > 0 ? market / initial - 1 : 0;
    const simpleValue = Math.max(0, initial * (1 + cumulativeMarket * input.leverage));
    rows.push({ period: index + 1, marketReturn: r, marketValue: market, etfValue: etf, simpleValue, leveragedPeriodReturn: leveraged });
  });

  const marketReturn = initial > 0 ? market / initial - 1 : 0;
  const etfReturn = initial > 0 ? etf / initial - 1 : 0;
  const simpleReturn = Math.max(-1, marketReturn * input.leverage);

  return {
    rows,
    marketReturn,
    etfReturn,
    simpleReturn,
    pathEffect: etfReturn - simpleReturn,
    finalMarket: market,
    finalEtf: etf,
    feeImpact: Math.max(0, etfWithoutFee - etf),
  };
}

export function alternatingReturns(up: number, down: number, repeats: number): number[] {
  return Array.from({ length: Math.max(0, repeats) * 2 }, (_, index) => index % 2 === 0 ? up : down);
}
