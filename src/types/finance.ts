export type TransactionType = "income" | "expense";

export type UserRole = "viewer" | "admin";

export type SortOption = "newest" | "oldest" | "highest" | "lowest";

export type GroupByOption = "none" | "category" | "month" | "type";

export type ThemeMode = "light" | "dark";

export type DataSource = "mock-api" | "local-cache";

export interface Transaction {
  id: string;
  date: string;
  title: string;
  amount: number;
  category: string;
  type: TransactionType;
  note?: string;
}

export interface TransactionFilters {
  search: string;
  category: string;
  type: TransactionType | "all";
  sort: SortOption;
  fromDate: string;
  toDate: string;
  groupBy: GroupByOption;
}

export interface DashboardMetrics {
  balance: number;
  income: number;
  expenses: number;
  savingsRate: number;
}

export interface MonthlyTrendPoint {
  monthKey: string;
  monthLabel: string;
  income: number;
  expenses: number;
  net: number;
  balance: number;
}

export interface CategoryBreakdownItem {
  name: string;
  value: number;
  color: string;
}

export interface InsightCard {
  id: string;
  label: string;
  value: string;
  tone: "neutral" | "positive" | "warning";
  description: string;
}

export interface GroupSummaryItem {
  label: string;
  count: number;
  income: number;
  expenses: number;
  net: number;
}
