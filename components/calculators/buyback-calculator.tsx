"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalculatorShell } from "@/components/calculator-shell";
import { NumberField } from "@/components/number-field";
import { MetricCard } from "@/components/metric-card";
import { ChartCard } from "@/components/chart-card";
import { ResultMessage } from "@/components/result-message";
import { AdvancedSettings } from "@/components/advanced-settings";
import { InputCard } from "@/components/input-card";
import { useScenarioState } from "@/lib/hooks/use-scenario-state";
import { calculateBuyback } from "@/lib/calculations/buyback";
import { formatNumber, formatPercent, formatWon } from "@/lib/format";

interface State {
  netIncome: number;
  shares: number;
  price: number;
  buybackAmount: number;
  averagePrice: number;
  incomeGrowth: number;
  addedShares: number;
}

const initialState: State = {
  netIncome: 1_000_000_000_000,
  shares: 100_000_000,
  price: 100_000,
  buybackAmount: 500_000_000_000,
  averagePrice: 100_000,
  incomeGrowth: 0,
  addedShares: 0,
};

function formatShares(value: number): string {
  if (!Number.isFinite(value)) return "-";
  const rounded = Math.max(0, Math.round(value));
  if (rounded >= 100_000_000) {
    const eok = rounded / 100_000_000;
    return `${formatNumber(eok, 2)}억 주`;
  }
  if (rounded >= 10_000) return `${formatNumber(rounded / 10_000, 1)}만 주`;
  return `${formatNumber(rounded, 0)}주`;
}

export function BuybackCalculator() {
  const { value, setValue } = useScenarioState<State>("investment-lab-buyback-v2", initialState);

  const result = useMemo(
    () =>
      calculateBuyback({
        netIncome: value.netIncome,
        shares: value.shares,
        price: value.price,
        buybackAmount: value.buybackAmount,
        averagePrice: value.averagePrice,
        incomeGrowth: value.incomeGrowth / 100,
        newShares: value.addedShares,
        dilutedShares: 0,
        interestCost: 0,
        taxRate: 0.24,
        analysisYears: 1,
        timing: "begin",
      }),
    [value],
  );

  const epsData = [
    { stage: "현재", eps: result.currentEps },
    { stage: "순이익 변화 후", eps: result.growthOnlyEps },
    { stage: "자사주매입 후", eps: result.finalEps },
  ];

  const priceData = Array.from({ length: 9 }, (_, index) => {
    const price = value.price * (0.6 + index * 0.1);
    const scenario = calculateBuyback({
      netIncome: value.netIncome,
      shares: value.shares,
      price: value.price,
      buybackAmount: value.buybackAmount,
      averagePrice: price,
      incomeGrowth: value.incomeGrowth / 100,
      newShares: value.addedShares,
      dilutedShares: 0,
      interestCost: 0,
      taxRate: 0.24,
      analysisYears: 1,
      timing: "begin",
    });
    return {
      price,
      epsGrowth: scenario.totalEpsGrowth * 100,
      shareReduction: scenario.netReduction * 100,
    };
  });

  const input = (
    <>
      <InputCard
        title="현재 기업 정보와 매입 계획"
        description="다섯 가지 숫자만 입력하면 주식 수 감소와 EPS 변화를 바로 확인할 수 있습니다."
      >
        <div className="space-y-5">
          <div>
            <p className="mb-3 text-sm font-black text-slate-800">현재 기업 정보</p>
            <div className="space-y-5">
              <NumberField
                label="현재 순이익"
                value={value.netIncome}
                onChange={(netIncome) => setValue({ ...value, netIncome })}
                min={0}
                unit="만원"
                inputScale={10_000}
              />
              <NumberField
                label="현재 발행주식 수"
                value={value.shares}
                onChange={(shares) => setValue({ ...value, shares })}
                min={1}
                unit="주"
              />
              <NumberField
                label="현재 주가"
                value={value.price}
                onChange={(price) => setValue({ ...value, price })}
                min={1}
                unit="만원"
                inputScale={10_000}
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <p className="mb-3 text-sm font-black text-slate-800">자사주매입 계획</p>
            <div className="space-y-5">
              <NumberField
                label="자사주매입 금액"
                value={value.buybackAmount}
                onChange={(buybackAmount) => setValue({ ...value, buybackAmount })}
                min={0}
                unit="만원"
                inputScale={10_000}
              />
              <NumberField
                label="예상 평균 매입가격"
                value={value.averagePrice}
                onChange={(averagePrice) => setValue({ ...value, averagePrice })}
                min={1}
                unit="만원"
                inputScale={10_000}
              />
            </div>
          </div>
        </div>
      </InputCard>

      <AdvancedSettings
        title="추가 반영 항목"
        description="순이익 변화나 주식보상이 예상될 때만 입력합니다."
      >
        <div className="space-y-5">
          <NumberField
            label="예상 순이익 변화율"
            value={value.incomeGrowth}
            onChange={(incomeGrowth) => setValue({ ...value, incomeGrowth })}
            min={-100}
            max={100}
            unit="%"
            slider
          />
          <NumberField
            label="주식보상·신규 발행 주식 수"
            value={value.addedShares}
            onChange={(addedShares) => setValue({ ...value, addedShares })}
            min={0}
            unit="주"
          />
        </div>
      </AdvancedSettings>
    </>
  );

  const buybackOnlyGrowth = result.shareEffect;
  const premiumWarning = result.premium > 0.2;
  const noNetReduction = result.netReduction <= 0 && value.buybackAmount > 0;
  const oversized = value.buybackAmount >= result.marketCap && result.marketCap > 0;

  const resultNode = (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard
          label="예상 매입 주식 수"
          value={formatShares(result.purchasedShares)}
          note={`${formatWon(value.buybackAmount)} ÷ ${formatWon(value.averagePrice, false)}`}
        />
        <MetricCard
          label="순주식 수 감소율"
          value={formatPercent(result.netReduction, 2)}
          note={`${formatShares(value.shares)} → ${formatShares(result.finalShares)}`}
          tone={result.netReduction > 0 ? "positive" : "caution"}
        />
        <MetricCard
          label="예상 EPS 증가율"
          value={formatPercent(result.totalEpsGrowth, 2)}
          note={`${formatNumber(result.currentEps, 0)}원 → ${formatNumber(result.finalEps, 0)}원`}
          tone={result.totalEpsGrowth >= 0 ? "positive" : "negative"}
        />
      </div>

      <ResultMessage
        conclusion={`자사주매입 후 발행주식 수는 ${formatShares(result.finalShares)}로 줄고, EPS는 ${formatPercent(result.totalEpsGrowth, 2)} 변합니다.`}
        reason={`약 ${formatShares(result.purchasedShares)}를 매입합니다. EPS 변화 중 순이익 효과는 ${formatPercent(result.businessEffect, 2)}, 자사주매입 효과는 ${formatPercent(buybackOnlyGrowth, 2)}입니다.`}
        warning={
          oversized
            ? "자사주매입 금액이 현재 시가총액과 같거나 더 큽니다. 실제로 집행하기 어려운 가정일 수 있습니다."
            : noNetReduction
              ? "주식보상·신규 발행 주식 수가 매입 주식 수와 같거나 더 많아 전체 주식 수가 줄지 않습니다."
              : premiumWarning
                ? `예상 평균 매입가격이 현재 주가보다 ${formatPercent(result.premium, 1)} 높습니다. 같은 금액으로 살 수 있는 주식 수가 줄어듭니다.`
                : undefined
        }
      />

      <ChartCard title="EPS가 어떻게 달라지는지">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={epsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip formatter={(number) => `${formatNumber(Number(number), 0)}원`} />
            <Bar dataKey="eps" name="EPS" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <AdvancedSettings
        title="매입가격에 따른 차이"
        description="같은 금액이라도 비싸게 매입할수록 주식 수 감소 효과가 작아집니다."
      >
        <ChartCard title="평균 매입가격별 효과">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="price" tickFormatter={(number) => `${formatNumber(number / 10_000, 0)}만`} />
              <YAxis unit="%" />
              <Tooltip
                formatter={(number) => `${Number(number).toFixed(2)}%`}
                labelFormatter={(number) => `평균 매입가격 ${formatWon(Number(number), false)}`}
              />
              <Line dataKey="epsGrowth" name="EPS 증가율" stroke="#2563eb" dot={false} />
              <Line dataKey="shareReduction" name="주식 수 감소율" stroke="#15803d" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </AdvancedSettings>
    </>
  );

  return (
    <CalculatorShell
      title="자사주매입 효과 계산기"
      description="자사주매입으로 주식 수와 EPS가 얼마나 달라지는지 쉽게 확인합니다."
      headline="자사주매입의 핵심은 발표 금액보다 실제 주식 수가 얼마나 줄어드는지입니다."
      guideHref="/guides/share-buyback"
      input={input}
      result={resultNode}
      education={[
        {
          title: "먼저 볼 숫자",
          body: "자사주매입 금액보다 순주식 수 감소율을 먼저 확인하세요. 주식보상과 신규 발행이 많으면 매입 효과가 상쇄될 수 있습니다.",
        },
        {
          title: "EPS가 늘어나는 이유",
          body: "같은 이익을 더 적은 주식 수로 나누면 주당순이익인 EPS가 증가합니다. 순이익 증가 효과와 자사주매입 효과는 구분해서 보는 것이 좋습니다.",
        },
        {
          title: "매입가격도 중요",
          body: "같은 금액을 사용해도 주가가 높을 때 매입하면 살 수 있는 주식 수가 줄어 자본배분 효율이 낮아질 수 있습니다.",
        },
      ]}
      assumptions={[
        "자사주매입이 완료된 뒤의 발행주식 수를 기준으로 EPS를 비교합니다.",
        "입력한 평균 매입가격으로 자사주를 매입한다고 가정합니다.",
        "주식보상·신규 발행 주식은 매입 효과를 상쇄하는 것으로 반영합니다.",
      ]}
    />
  );
}
