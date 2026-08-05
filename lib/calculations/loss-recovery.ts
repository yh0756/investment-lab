export type RecoveryTarget = "initial" | "total";
export interface RecoveryInput { initial: number; lossRate: number; additional: number; annualReturn: number; monthlyContribution: number; target: RecoveryTarget; }
export interface RecoveryRow { month: number; value: number; target: number; contributions: number; }
export interface RecoveryResult { current: number; lossAmount: number; afterAdditional: number; requiredWithoutAdditional: number; requiredAfterAdditional: number; targetAmount: number; months: number | null; rows: RecoveryRow[]; }

export function requiredRecoveryRate(lossRate: number): number { return lossRate >= 1 ? Infinity : lossRate / (1 - lossRate); }
export function calculateLossRecovery(input: RecoveryInput): RecoveryResult {
  const current = input.initial * (1 - input.lossRate);
  const afterAdditional = current + input.additional;
  const targetAmount = input.target === "initial" ? input.initial : input.initial + input.additional;
  const requiredAfterAdditional = afterAdditional <= 0 ? Infinity : Math.max(0, targetAmount / afterAdditional - 1);
  const monthlyRate = Math.pow(1 + input.annualReturn, 1 / 12) - 1;
  const rows: RecoveryRow[] = [{ month: 0, value: afterAdditional, target: targetAmount, contributions: input.initial + input.additional }];
  let value = afterAdditional;
  let contributions = input.initial + input.additional;
  let months: number | null = value >= targetAmount ? 0 : null;
  for (let month = 1; month <= 1200 && months === null; month += 1) {
    value = value * (1 + monthlyRate) + input.monthlyContribution;
    contributions += input.monthlyContribution;
    const target = input.target === "total" ? contributions : targetAmount;
    rows.push({ month, value, target, contributions });
    if (value >= target) months = month;
  }
  return { current, lossAmount: input.initial - current, afterAdditional, requiredWithoutAdditional: requiredRecoveryRate(input.lossRate), requiredAfterAdditional, targetAmount, months, rows };
}
