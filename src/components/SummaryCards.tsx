import type { DashboardMetrics } from "../types/finance";
import { formatCurrency, formatPercentage } from "../utils/format";

interface SummaryCardsProps {
  metrics: DashboardMetrics;
}

const metricCards = [
  {
    key: "balance",
    label: "Total Balance",
    accent: "emerald",
    formatter: formatCurrency,
  },
  {
    key: "income",
    label: "Income",
    accent: "sand",
    formatter: formatCurrency,
  },
  {
    key: "expenses",
    label: "Expenses",
    accent: "coral",
    formatter: formatCurrency,
  },
  {
    key: "savingsRate",
    label: "Savings Rate",
    accent: "sky",
    formatter: formatPercentage,
  },
] as const;

export function SummaryCards({ metrics }: SummaryCardsProps) {
  return (
    <section className="summary-grid" aria-label="Financial summary">
      {metricCards.map((card) => (
        <article
          key={card.key}
          className={`panel metric-card metric-card--${card.accent}`}
        >
          <p className="metric-card__label">{card.label}</p>
          <h2 className="metric-card__value">
            {card.formatter(metrics[card.key])}
          </h2>
          <p className="metric-card__caption">Calculated from the current view</p>
        </article>
      ))}
    </section>
  );
}
