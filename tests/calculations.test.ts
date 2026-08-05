import { describe, expect, it } from "vitest";
import { alternatingReturns, calculateLeverage } from "@/lib/calculations/leverage";
import { calculateDividendGrowth } from "@/lib/calculations/dividend-growth";
import { calculateLossRecovery, requiredRecoveryRate } from "@/lib/calculations/loss-recovery";
import { calculateRebalancing } from "@/lib/calculations/rebalancing";
import { futureValue, requiredMonthlyPayment } from "@/lib/calculations/goal-asset";
import { calculateBuyback } from "@/lib/calculations/buyback";

describe("레버리지 ETF 계산", () => {
  it("+10% 후 -9.09%이면 기초지수가 거의 원점으로 돌아온다", () => {
    const result = calculateLeverage({ initial: 100, leverage: 2, annualFee: 0, periodsPerYear: 252, returns: [0.1, -0.0909090909] });
    expect(result.finalMarket).toBeCloseTo(100, 6);
    expect(result.finalEtf).toBeLessThan(100);
  });
  it("ETF 가치가 0 아래로 내려가지 않는다", () => {
    const result = calculateLeverage({ initial: 100, leverage: 3, annualFee: 0, periodsPerYear: 252, returns: [-0.5, 0.2] });
    expect(result.finalEtf).toBe(0);
  });
  it("반복 수익률 배열을 만든다", () => expect(alternatingReturns(0.1, -0.05, 2)).toEqual([0.1, -0.05, 0.1, -0.05]));
});

describe("배당성장 계산", () => {
  const base: Parameters<typeof calculateDividendGrowth>[0] = { initial: 1000, years: 3, taxRate: 0, reinvest: false, plans: [
    { name: "A", price: 100, yieldRate: 0.05, dividendGrowth: 0, priceGrowth: 0, fee: 0 },
    { name: "B", price: 100, yieldRate: 0.03, dividendGrowth: 0.1, priceGrowth: 0, fee: 0 }
  ] };
  it("배당성장률 0%이면 연간 배당금이 일정하다", () => {
    const r = calculateDividendGrowth(base);
    expect(r.rows[0].aDividend).toBeCloseTo(r.rows[2].aDividend);
  });
  it("재투자 시 보유자산이 더 커진다", () => {
    const no = calculateDividendGrowth(base);
    const yes = calculateDividendGrowth({ ...base, reinvest: true });
    expect(yes.finalAsset[0]).toBeGreaterThan(no.finalAsset[0] - no.cumulative[0]);
  });
  it("역전되지 않으면 null을 반환한다", () => {
    const r = calculateDividendGrowth({ ...base, years: 1 });
    expect(r.annualCrossover).toBeNull();
  });
});

describe("손실 회복 계산", () => {
  it("50% 손실의 회복률은 100%", () => expect(requiredRecoveryRate(0.5)).toBeCloseTo(1));
  it("20% 손실의 회복률은 25%", () => expect(requiredRecoveryRate(0.2)).toBeCloseTo(0.25));
  it("추가 투자 후 회복률을 계산한다", () => {
    const r = calculateLossRecovery({ initial: 1000, lossRate: 0.4, additional: 200, annualReturn: 0.07, monthlyContribution: 0, target: "total" });
    expect(r.requiredAfterAdditional).toBeCloseTo(0.5);
  });
});

describe("리밸런싱 계산", () => {
  const assets = [{ id: "a", name: "A", type: "주식", value: 600, target: 0.5 }, { id: "b", name: "B", type: "채권", value: 400, target: 0.5 }];
  it("목표 비중 합계가 100%가 아니면 계산하지 않는다", () => {
    const r = calculateRebalancing({ assets: assets.map((a, i) => ({ ...a, target: i === 0 ? 0.4 : 0.5 })), newMoney: 100, mode: "trade", feeRate: 0 });
    expect(r.valid).toBe(false);
  });
  it("매수·매도 조정금액 합계는 신규 투자금과 일치한다", () => {
    const r = calculateRebalancing({ assets, newMoney: 100, mode: "trade", feeRate: 0 });
    const net = r.rows.reduce((s, row) => s + row.buy - row.sell, 0);
    expect(net).toBeCloseTo(100);
  });
  it("매도 없는 방식에서 음수 매수금액이 발생하지 않는다", () => {
    const r = calculateRebalancing({ assets, newMoney: 100, mode: "buy-only", feeRate: 0 });
    expect(r.rows.every((row) => row.buy >= 0 && row.sell === 0)).toBe(true);
  });
});

describe("목표 자산 계산", () => {
  it("수익률 0%이면 단순 합산", () => expect(futureValue(100, 10, 0, 12, "end")).toBeCloseTo(220));
  it("월초 납입 결과가 월말 납입보다 크다", () => expect(futureValue(0, 10, 0.12, 12, "begin")).toBeGreaterThan(futureValue(0, 10, 0.12, 12, "end")));
  it("목표금액이 현재자산 미래가치보다 낮으면 월 투자금 0", () => expect(requiredMonthlyPayment(1000, 900, 0.05, 12, "end")).toBe(0));
});

describe("자사주매입 계산", () => {
  const base = { netIncome: 100, shares: 100, price: 10, buybackAmount: 0, averagePrice: 10, incomeGrowth: 0, newShares: 0, dilutedShares: 0, interestCost: 0, taxRate: 0.2 };
  it("자사주매입이 없으면 주식 수 감소 효과가 0%", () => expect(calculateBuyback(base).shareEffect).toBeCloseTo(0));
  it("신규 발행주식 수가 매입주식 수와 같으면 순감소율 0%", () => {
    const r = calculateBuyback({ ...base, buybackAmount: 100, newShares: 10 });
    expect(r.netReduction).toBeCloseTo(0);
  });
  it("평균 매입가격이 높을수록 매입 가능 주식 수가 감소", () => {
    const low = calculateBuyback({ ...base, buybackAmount: 100, averagePrice: 10 });
    const high = calculateBuyback({ ...base, buybackAmount: 100, averagePrice: 20 });
    expect(high.purchasedShares).toBeLessThan(low.purchasedShares);
  });
});
