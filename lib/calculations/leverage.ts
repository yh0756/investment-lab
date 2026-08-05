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
  const feePerPeriod = input.annualFee / Math.max(1, input.periodsPerYear);
  let market = input.initial;
  let etf = input.initial;
  let etfWithoutFee = input.initial;
  const rows: LeverageRow[] = [{ period: 0, marketReturn: 0, marketValue: market, etfValue: etf, simpleValue: input.initial, leveragedPeriodReturn: 0 }];
  input.returns.forEach((r, index) => {
    market *= Math.max(0, 1 + r);
    const leveraged = input.leverage * r - feePerPeriod;
    etf *= Math.max(0, 1 + leveraged);
    etfWithoutFee *= Math.max(0, 1 + input.leverage * r);
    const cumulativeMarket = market / input.initial - 1;
    const simpleValue = Math.max(0, input.initial * (1 + cumulativeMarket * input.leverage));
    rows.push({ period: index + 1, marketReturn: r, marketValue: market, etfValue: etf, simpleValue, leveragedPeriodReturn: leveraged });
  });
  const marketReturn = market / input.initial - 1;
  const etfReturn = etf / input.initial - 1;
  const simpleReturn = marketReturn * input.leverage;
  return { rows, marketReturn, etfReturn, simpleReturn, pathEffect: etfReturn - simpleReturn, finalMarket: market, finalEtf: etf, feeImpact: etfWithoutFee - etf };
}

export function alternatingReturns(up: number, down: number, repeats: number): number[] {
  return Array.from({ length: Math.max(0, repeats) * 2 }, (_, index) => index % 2 === 0 ? up : down);
}
