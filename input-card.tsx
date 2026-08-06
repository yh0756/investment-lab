import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InputCard({ title = "핵심 입력", description, children }: { title?: string; description?: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>}
      </CardHeader>
      <CardContent className="space-y-5">{children}</CardContent>
    </Card>
  );
}
