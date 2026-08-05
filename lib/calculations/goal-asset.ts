export type GoalMode = "monthly" | "return" | "period";
export interface GoalInput { current: number; target: number; annualReturn: number; years: number; monthly: number; paymentTiming: "end" | "begin"; inflationRate: number; targetIsPresentValue: boolean; mode: GoalMode; }
export interface GoalRow { month: number; principal: number; value: number; gain: number; target: number; }
export interface GoalResult { adjustedTarget: number; requiredMonthly: number; requiredAnnualReturn: number | null; requiredMonths: number | null; finalValue: number; totalPrincipal: number; gain: number; rows: GoalRow[]; }

export function futureValue(current: number, monthly: number, annualReturn: number, months: number, timing: "end" | "begin"): number {
  const r = Math.pow(Math.max(0.000001, 1 + annualReturn), 1 / 12) - 1;
  if (Math.abs(r) < 1e-12) return current + monthly * months;
  const annuity = monthly * (Math.pow(1 + r, months) - 1) / r * (timing === "begin" ? (1 + r) : 1);
  return current * Math.pow(1 + r, months) + annuity;
}
export function requiredMonthlyPayment(current: number, target: number, annualReturn: number, months: number, timing: "end" | "begin"): number {
  const currentFuture = futureValue(current, 0, annualReturn, months, timing);
  if (currentFuture >= target || months <= 0) return 0;
  const factor = futureValue(0, 1, annualReturn, months, timing);
  return factor <= 0 ? Infinity : (target - currentFuture) / factor;
}
function solveReturn(current: number, monthly: number, target: number, months: number, timing: "end" | "begin"): number | null {
  let low = -0.99; let high = 5;
  if (futureValue(current, monthly, high, months, timing) < target) return null;
  for (let i = 0; i < 120; i += 1) { const mid = (low + high) / 2; if (futureValue(current, monthly, mid, months, timing) >= target) high = mid; else low = mid; }
  return high;
}
function targetAtMonth(input: GoalInput, month: number): number {
  return input.targetIsPresentValue ? input.target * Math.pow(1 + input.inflationRate, month / 12) : input.target;
}
function solveMonths(input: GoalInput): number | null {
  for (let month = 0; month <= 1200; month += 1) {
    if (futureValue(input.current, input.monthly, input.annualReturn, month, input.paymentTiming) >= targetAtMonth(input, month)) return month;
  }
  return null;
}
export function calculateGoalAsset(input: GoalInput): GoalResult {
  const baseMonths = Math.max(0, Math.round(input.years * 12));
  const fixedTarget = targetAtMonth(input, baseMonths);
  const requiredMonthly = requiredMonthlyPayment(input.current, fixedTarget, input.annualReturn, baseMonths, input.paymentTiming);
  const requiredAnnualReturn = solveReturn(input.current, input.monthly, fixedTarget, baseMonths, input.paymentTiming);
  const requiredMonths = solveMonths(input);
  const months = input.mode === "period" ? (requiredMonths ?? 1200) : baseMonths;
  const adjustedTarget = targetAtMonth(input, months);
  const monthly = input.mode === "monthly" ? requiredMonthly : input.monthly;
  const annualReturn = input.mode === "return" ? (requiredAnnualReturn ?? input.annualReturn) : input.annualReturn;
  const rows: GoalRow[] = [];
  const step = Math.max(1, Math.ceil(months / 240));
  for (let m = 0; m <= months; m += step) {
    const value = futureValue(input.current, monthly, annualReturn, m, input.paymentTiming);
    const principal = input.current + monthly * m;
    rows.push({ month: m, principal, value, gain: value - principal, target: input.mode === "period" ? targetAtMonth(input, m) : adjustedTarget });
  }
  if (rows.at(-1)?.month !== months) {
    const value = futureValue(input.current, monthly, annualReturn, months, input.paymentTiming);
    const principal = input.current + monthly * months;
    rows.push({ month: months, principal, value, gain: value - principal, target: adjustedTarget });
  }
  const finalValue = futureValue(input.current, monthly, annualReturn, months, input.paymentTiming);
  const totalPrincipal = input.current + monthly * months;
  return { adjustedTarget, requiredMonthly, requiredAnnualReturn, requiredMonths, finalValue, totalPrincipal, gain: finalValue - totalPrincipal, rows };
}
