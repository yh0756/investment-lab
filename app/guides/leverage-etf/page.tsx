import { CalculatorGuidePage } from "@/components/calculator-guide-page";
import { calculatorGuides } from "@/lib/calculator-guides";

const guide = calculatorGuides["leverage-etf"];

export const metadata = {
  title: guide.seoTitle,
  description: guide.seoDescription,
};

export default function Page() {
  return <CalculatorGuidePage guide={guide} />;
}
