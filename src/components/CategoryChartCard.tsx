import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CategoryBreakdownItem } from "../types/finance";
import { formatCurrency } from "../utils/format";
import { EmptyState } from "./EmptyState";

interface CategoryChartCardProps {
  data: CategoryBreakdownItem[];
}

function pieTooltipFormatter(value: unknown) {
  return formatCurrency(Number(value ?? 0));
}

export function CategoryChartCard({ data }: CategoryChartCardProps) {
  return (
    <article className="panel chart-card">
      <div className="panel__header panel__header--chart">
        <div>
          <p className="section-kicker">Category mix</p>
          <h2>Spending breakdown</h2>
        </div>
        <p className="panel__meta">Expense categories for the current selection</p>
      </div>

      {data.length === 0 ? (
        <EmptyState
          title="No expense categories yet"
          description="Expense-only categories appear here once the current view includes outgoing transactions."
        />
      ) : (
        <div className="breakdown-grid">
          <div className="chart-shell chart-shell--donut">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  data={data}
                  dataKey="value"
                  innerRadius={68}
                  outerRadius={92}
                  paddingAngle={3}
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={pieTooltipFormatter} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="legend-list" aria-label="Spending breakdown legend">
            {data.map((entry) => (
              <div key={entry.name} className="legend-list__item">
                <span
                  className="legend-list__swatch"
                  style={{ backgroundColor: entry.color }}
                />
                <div>
                  <p>{entry.name}</p>
                  <span>{formatCurrency(entry.value)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
