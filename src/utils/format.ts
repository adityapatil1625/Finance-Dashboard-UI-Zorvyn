const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat("en-IN", {
  style: "percent",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat("en-IN", {
  month: "short",
  year: "numeric",
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatPercentage(value: number): string {
  return percentFormatter.format(value / 100);
}

export function formatDisplayDate(value: string): string {
  return dateFormatter.format(new Date(`${value}T00:00:00`));
}

export function formatMonthLabel(monthKey: string): string {
  return monthFormatter.format(new Date(`${monthKey}-01T00:00:00`));
}
