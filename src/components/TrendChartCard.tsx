import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyTrendPoint } from "../types/finance";
import { formatCurrency } from "../utils/format";
import { EmptyState } from "./EmptyState";

interface TrendChartCardProps {
  data: MonthlyTrendPoint[];
  hasTransactions: boolean;
  onResetData: () => void;
}

const chartMargin = { top: 8, right: 12, bottom: 4, left: 8 };

function tooltipFormatter(value: unknown) {
  return formatCurrency(Number(value ?? 0));
}

export function TrendChartCard({
  data,
  hasTransactions,
  onResetData,
}: TrendChartCardProps) {
  return (
    <article className="panel chart-card">
      <div className="panel__header panel__header--chart">
        <div>
          <p className="section-kicker">Monthly view</p>
          <h2>Balance trend</h2>
        </div>
        <p className="panel__meta">Monthly running balance after income and expenses</p>
      </div>

      {data.length === 0 ? (
        <EmptyState
          title="No monthly trend available"
          description="Add or restore transactions to populate the running balance view."
          primaryActionLabel={!hasTransactions ? "Restore demo data" : undefined}
          onPrimaryAction={!hasTransactions ? onResetData : undefined}
        />
      ) : (
        <div className="chart-shell">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={chartMargin}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0f9d7a" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#0f9d7a" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(118, 130, 111, 0.16)" vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="monthLabel"
                tickLine={false}
                tickMargin={12}
              />
              <YAxis
                axisLine={false}
                tickFormatter={tooltipFormatter}
                tickLine={false}
                width={112}
              />
              <Tooltip formatter={tooltipFormatter} />
              <Area
                dataKey="balance"
                fill="url(#balanceGradient)"
                stroke="#0f9d7a"
                strokeWidth={3}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </article>
  );
}
