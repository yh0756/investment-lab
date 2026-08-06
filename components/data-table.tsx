import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface DataColumn<T> {
  key: keyof T;
  label: string;
  format?: (value: T[keyof T], row: T) => string;
  align?: "left" | "right";
}

export function DataTable<T extends object>({ title, rows, columns, maxRows = 60 }: { title: string; rows: T[]; columns: DataColumn<T>[]; maxRows?: number }) {
  const visible = rows.length <= maxRows ? rows : rows.filter((_, index) => index % Math.ceil(rows.length / maxRows) === 0 || index === rows.length - 1);
  return <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent><div className="overflow-x-auto"><table className="min-w-[700px] w-full text-sm"><thead><tr className="border-b border-slate-200">{columns.map((column)=><th key={String(column.key)} className={`whitespace-nowrap py-2 pr-4 font-bold text-slate-600 ${column.align === "right" ? "text-right" : "text-left"}`}>{column.label}</th>)}</tr></thead><tbody>{visible.map((row,index)=><tr key={index} className="border-b border-slate-100">{columns.map((column)=>{const raw=row[column.key];return <td key={String(column.key)} className={`whitespace-nowrap py-3 pr-4 ${column.align === "right" ? "text-right" : "text-left"}`}>{column.format ? column.format(raw,row) : String(raw)}</td>})}</tr>)}</tbody></table></div>{rows.length>visible.length&&<p className="mt-3 text-xs text-slate-500">표가 길어 일부 구간을 간격별로 표시했습니다.</p>}</CardContent></Card>;
}
