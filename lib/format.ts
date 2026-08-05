export function formatWon(value: number, compact = true): string {
  if (!Number.isFinite(value)) return "-";
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (!compact) return `${sign}${Math.round(abs).toLocaleString("ko-KR")}원`;
  if (abs >= 100_000_000) {
    const eok = abs / 100_000_000;
    const rounded = Number.isInteger(eok) ? eok.toFixed(0) : eok.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
    return `${sign}${rounded}억 원`;
  }
  if (abs >= 10_000) return `${sign}${Math.round(abs / 10_000).toLocaleString("ko-KR")}만 원`;
  return `${sign}${Math.round(abs).toLocaleString("ko-KR")}원`;
}

export function formatNumber(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "-";
  return value.toLocaleString("ko-KR", { maximumFractionDigits: digits });
}

export function formatPercent(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return "-";
  return `${(value * 100).toLocaleString("ko-KR", { maximumFractionDigits: digits })}%`;
}

export function formatDuration(months: number | null): string {
  if (months === null || !Number.isFinite(months)) return "목표 기간 내 미도달";
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return `${rest}개월`;
  if (rest === 0) return `${years}년`;
  return `${years}년 ${rest}개월`;
}
