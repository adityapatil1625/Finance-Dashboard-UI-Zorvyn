import type { DashboardMetrics, InsightCard, UserRole } from "../types/finance";
import { formatCurrency } from "../utils/format";

interface InsightsRailProps {
  insights: InsightCard[];
  metrics: DashboardMetrics;
  role: UserRole;
  transactionCount: number;
}

export function InsightsRail({
  insights,
  metrics,
  role,
  transactionCount,
}: InsightsRailProps) {
  return (
    <section className="insights-rail" aria-label="Insights">
      {insights.map((insight) => (
        <article
          key={insight.id}
          className={`panel insight-card insight-card--${insight.tone}`}
        >
          <p className="insight-card__label">{insight.label}</p>
          <h3>{insight.value}</h3>
          <p>{insight.description}</p>
        </article>
      ))}

      <article className="panel stack-card">
        <p className="stack-card__label">Current role</p>
        <h3>{role === "admin" ? "Admin" : "Viewer"}</h3>
        <p>
          {role === "admin"
            ? "Editing controls are enabled for add, edit, reset, and clear actions."
            : "The UI is in read-only mode while still exposing all dashboards and filters."}
        </p>
      </article>

      <article className="panel stack-card">
        <p className="stack-card__label">Current view snapshot</p>
        <h3>{transactionCount} items</h3>
        <p>
          Net balance in this filtered view is {formatCurrency(metrics.balance)}.
        </p>
      </article>
    </section>
  );
}
