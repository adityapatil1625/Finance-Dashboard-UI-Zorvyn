import type {
  CategoryBreakdownItem,
  DashboardMetrics,
  GroupByOption,
  GroupSummaryItem,
  InsightCard,
  MonthlyTrendPoint,
  Transaction,
  TransactionFilters,
} from "../types/finance";
import { formatCurrency, formatMonthLabel } from "./format";

const CHART_COLORS = [
  "#0f9d7a",
  "#ff7a59",
  "#f0b429",
  "#3e8ed0",
  "#6f5ef9",
  "#3aaf85",
  "#d94f70",
  "#5c7cfa",
];

export function getAvailableCategories(transactions: Transaction[]): string[] {
  return [...new Set(transactions.map((transaction) => transaction.category))].sort(
    (left, right) => left.localeCompare(right),
  );
}

export function getFilteredTransactions(
  transactions: Transaction[],
  filters: TransactionFilters,
): Transaction[] {
  const normalizedSearch = filters.search.trim().toLowerCase();

  const filtered = transactions.filter((transaction) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      transaction.title.toLowerCase().includes(normalizedSearch) ||
      transaction.category.toLowerCase().includes(normalizedSearch) ||
      transaction.note?.toLowerCase().includes(normalizedSearch) === true;

    const matchesCategory =
      filters.category === "all" || transaction.category === filters.category;

    const matchesType =
      filters.type === "all" || transaction.type === filters.type;

    const matchesFromDate =
      filters.fromDate.length === 0 || transaction.date >= filters.fromDate;

    const matchesToDate =
      filters.toDate.length === 0 || transaction.date <= filters.toDate;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesType &&
      matchesFromDate &&
      matchesToDate
    );
  });

  return filtered.sort((left, right) => {
    if (filters.sort === "newest") {
      return right.date.localeCompare(left.date);
    }

    if (filters.sort === "oldest") {
      return left.date.localeCompare(right.date);
    }

    if (filters.sort === "highest") {
      return right.amount - left.amount;
    }

    return left.amount - right.amount;
  });
}

export function getDashboardMetrics(
  transactions: Transaction[],
): DashboardMetrics {
  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = income - expenses;
  const savingsRate = income > 0 ? (balance / income) * 100 : 0;

  return {
    balance,
    income,
    expenses,
    savingsRate,
  };
}

export function getMonthlyTrend(
  transactions: Transaction[],
): MonthlyTrendPoint[] {
  const monthlyMap = new Map<string, { income: number; expenses: number }>();

  transactions.forEach((transaction) => {
    const monthKey = transaction.date.slice(0, 7);
    const current = monthlyMap.get(monthKey) ?? { income: 0, expenses: 0 };

    if (transaction.type === "income") {
      current.income += transaction.amount;
    } else {
      current.expenses += transaction.amount;
    }

    monthlyMap.set(monthKey, current);
  });

  let runningBalance = 0;

  return [...monthlyMap.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([monthKey, totals]) => {
      const net = totals.income - totals.expenses;
      runningBalance += net;

      return {
        monthKey,
        monthLabel: formatMonthLabel(monthKey),
        income: totals.income,
        expenses: totals.expenses,
        net,
        balance: runningBalance,
      };
    });
}

export function getCategoryBreakdown(
  transactions: Transaction[],
): CategoryBreakdownItem[] {
  const expenseTotals = new Map<string, number>();

  transactions
    .filter((transaction) => transaction.type === "expense")
    .forEach((transaction) => {
      expenseTotals.set(
        transaction.category,
        (expenseTotals.get(transaction.category) ?? 0) + transaction.amount,
      );
    });

  return [...expenseTotals.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([name, value], index) => ({
      name,
      value,
      color: CHART_COLORS[index % CHART_COLORS.length] ?? "#0f9d7a",
    }));
}

function getMonthOverMonthInsight(transactions: Transaction[]): InsightCard {
  const trend = getMonthlyTrend(transactions);
  const latestMonth = trend.at(-1);
  const previousMonth = trend.at(-2);

  if (!latestMonth || !previousMonth) {
    return {
      id: "month-comparison",
      label: "Monthly comparison",
      value: "Building baseline",
      tone: "neutral",
      description: "Add another month of transactions to unlock a month-over-month expense comparison.",
    };
  }

  const previousExpenses = previousMonth.expenses;
  const currentExpenses = latestMonth.expenses;
  const delta =
    previousExpenses === 0
      ? 100
      : ((currentExpenses - previousExpenses) / previousExpenses) * 100;

  const tone = delta > 10 ? "warning" : delta < 0 ? "positive" : "neutral";
  const direction =
    delta > 0 ? "higher" : delta < 0 ? "lower" : "steady";

  return {
    id: "month-comparison",
    label: "Monthly comparison",
    value: `${Math.abs(delta).toFixed(0)}% ${direction}`,
    tone,
    description: `${latestMonth.monthLabel} expenses are ${direction} than ${previousMonth.monthLabel}.`,
  };
}

function getTopCategoryInsight(transactions: Transaction[]): InsightCard {
  const breakdown = getCategoryBreakdown(transactions);
  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  if (breakdown.length === 0 || totalExpenses === 0) {
    return {
      id: "top-category",
      label: "Highest spending category",
      value: "No expense data",
      tone: "neutral",
      description: "Expense-only insights appear once there are outgoing transactions in the current view.",
    };
  }

  const leadingCategory = breakdown[0];

  if (!leadingCategory) {
    return {
      id: "top-category",
      label: "Highest spending category",
      value: "No expense data",
      tone: "neutral",
      description: "Expense-only insights appear once there are outgoing transactions in the current view.",
    };
  }

  const share = (leadingCategory.value / totalExpenses) * 100;

  return {
    id: "top-category",
    label: "Highest spending category",
    value: leadingCategory.name,
    tone: share > 35 ? "warning" : "neutral",
    description: `${leadingCategory.name} accounts for ${share.toFixed(0)}% of current expenses.`,
  };
}

function getObservationInsight(transactions: Transaction[]): InsightCard {
  const metrics = getDashboardMetrics(transactions);
  const tone =
    metrics.savingsRate >= 30
      ? "positive"
      : metrics.savingsRate >= 10
        ? "neutral"
        : "warning";

  const description =
    metrics.income === 0
      ? "There is no income in the current filtered view, so savings rate is anchored by expenses only."
      : metrics.savingsRate >= 30
        ? "The current view shows a strong cash cushion with enough room for planned spending."
        : metrics.savingsRate >= 10
          ? "Cash flow remains positive, but a few high-value expense categories are doing most of the work."
          : "Spending is compressing the available buffer; this is the best place to highlight a budgeting conversation.";

  return {
    id: "observation",
    label: "Useful observation",
    value: formatCurrency(metrics.balance),
    tone,
    description,
  };
}

export function getInsights(transactions: Transaction[]): InsightCard[] {
  return [
    getTopCategoryInsight(transactions),
    getMonthOverMonthInsight(transactions),
    getObservationInsight(transactions),
  ];
}

function getGroupingKey(transaction: Transaction, groupBy: GroupByOption): string {
  if (groupBy === "category") {
    return transaction.category;
  }

  if (groupBy === "month") {
    return formatMonthLabel(transaction.date.slice(0, 7));
  }

  if (groupBy === "type") {
    return transaction.type === "income" ? "Income" : "Expense";
  }

  return "Ungrouped";
}

export function getGroupedSummary(
  transactions: Transaction[],
  groupBy: GroupByOption,
): GroupSummaryItem[] {
  if (groupBy === "none") {
    return [];
  }

  const groups = new Map<
    string,
    { count: number; income: number; expenses: number }
  >();

  transactions.forEach((transaction) => {
    const key = getGroupingKey(transaction, groupBy);
    const current = groups.get(key) ?? { count: 0, income: 0, expenses: 0 };

    current.count += 1;

    if (transaction.type === "income") {
      current.income += transaction.amount;
    } else {
      current.expenses += transaction.amount;
    }

    groups.set(key, current);
  });

  return [...groups.entries()]
    .map(([label, group]) => ({
      label,
      count: group.count,
      income: group.income,
      expenses: group.expenses,
      net: group.income - group.expenses,
    }))
    .sort((left, right) => Math.abs(right.net) - Math.abs(left.net));
}
