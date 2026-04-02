import type { GroupByOption, GroupSummaryItem } from "../types/finance";
import { formatCurrency } from "../utils/format";

interface GroupedSummaryProps {
  groupBy: GroupByOption;
  items: GroupSummaryItem[];
}

const groupTitles: Record<Exclude<GroupByOption, "none">, string> = {
  category: "Grouped by category",
  month: "Grouped by month",
  type: "Grouped by type",
};

export function GroupedSummary({ groupBy, items }: GroupedSummaryProps) {
  if (groupBy === "none" || items.length === 0) {
    return null;
  }

  return (
    <div className="group-summary" aria-label="Grouped transaction summary">
      <div className="group-summary__header">
        <div>
          <p className="section-kicker">Advanced grouping</p>
          <h3>{groupTitles[groupBy]}</h3>
        </div>
        <p className="panel__meta">Net flow and transaction count for the current filtered set</p>
      </div>

      <div className="group-summary__grid">
        {items.slice(0, 6).map((item) => (
          <article key={item.label} className="group-summary__card">
            <p className="group-summary__label">{item.label}</p>
            <h4
              className={
                item.net >= 0
                  ? "group-summary__amount group-summary__amount--positive"
                  : "group-summary__amount group-summary__amount--negative"
              }
            >
              {formatCurrency(item.net)}
            </h4>
            <p className="group-summary__meta">
              {item.count} transactions · In {formatCurrency(item.income)} · Out{" "}
              {formatCurrency(item.expenses)}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
