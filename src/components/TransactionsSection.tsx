import type {
  GroupSummaryItem,
  SortOption,
  Transaction,
  TransactionFilters,
  TransactionType,
  UserRole,
} from "../types/finance";
import { formatCurrency, formatDisplayDate } from "../utils/format";
import { EmptyState } from "./EmptyState";
import { GroupedSummary } from "./GroupedSummary";

interface TransactionsSectionProps {
  groupedSummary: GroupSummaryItem[];
  isLoading: boolean;
  role: UserRole;
  transactions: Transaction[];
  allTransactionsCount: number;
  filters: TransactionFilters;
  categories: string[];
  onFiltersChange: (filters: Partial<TransactionFilters>) => void;
  onResetFilters: () => void;
  onAddTransaction: () => void;
  onEditTransaction: (transaction: Transaction) => void;
  onResetData: () => void;
  onClearData: () => void;
  onExportCsv: () => void;
  onExportJson: () => void;
}

const sortLabels: Record<SortOption, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  highest: "Highest amount",
  lowest: "Lowest amount",
};

const typeLabels: Record<TransactionType, string> = {
  income: "Income",
  expense: "Expense",
};

export function TransactionsSection({
  groupedSummary,
  isLoading,
  role,
  transactions,
  allTransactionsCount,
  filters,
  categories,
  onFiltersChange,
  onResetFilters,
  onAddTransaction,
  onEditTransaction,
  onResetData,
  onClearData,
  onExportCsv,
  onExportJson,
}: TransactionsSectionProps) {
  const hasActiveFilters =
    filters.search.trim().length > 0 ||
    filters.category !== "all" ||
    filters.type !== "all" ||
    filters.sort !== "newest" ||
    filters.fromDate.length > 0 ||
    filters.toDate.length > 0 ||
    filters.groupBy !== "none";

  return (
    <section className="panel transactions-panel">
      <div className="panel__header panel__header--stack">
        <div>
          <p className="section-kicker">Transactions</p>
          <h2>Explore activity</h2>
        </div>
        <p className="panel__meta">
          Search, filter, and sort every entry without leaving the dashboard.
        </p>
      </div>

      <div className="toolbar">
        <div className="toolbar__filters">
          <label className="field" htmlFor="transaction-search">
            <span className="field__label">Search</span>
            <input
              id="transaction-search"
              className="field__control"
              placeholder="Merchant, note, or category"
              type="search"
              value={filters.search}
              onChange={(event) =>
                onFiltersChange({ search: event.target.value })
              }
            />
          </label>

          <label className="field" htmlFor="category-filter">
            <span className="field__label">Category</span>
            <select
              id="category-filter"
              className="field__control"
              value={filters.category}
              onChange={(event) =>
                onFiltersChange({ category: event.target.value })
              }
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="field" htmlFor="type-filter">
            <span className="field__label">Type</span>
            <select
              id="type-filter"
              className="field__control"
              value={filters.type}
              onChange={(event) =>
                onFiltersChange({
                  type: event.target.value as TransactionFilters["type"],
                })
              }
            >
              <option value="all">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>

          <label className="field" htmlFor="sort-filter">
            <span className="field__label">Sort</span>
            <select
              id="sort-filter"
              className="field__control"
              value={filters.sort}
              onChange={(event) =>
                onFiltersChange({
                  sort: event.target.value as SortOption,
                })
              }
            >
              {Object.entries(sortLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="field" htmlFor="from-date-filter">
            <span className="field__label">From date</span>
            <input
              id="from-date-filter"
              className="field__control"
              type="date"
              value={filters.fromDate}
              onChange={(event) =>
                onFiltersChange({ fromDate: event.target.value })
              }
            />
          </label>

          <label className="field" htmlFor="to-date-filter">
            <span className="field__label">To date</span>
            <input
              id="to-date-filter"
              className="field__control"
              type="date"
              value={filters.toDate}
              onChange={(event) =>
                onFiltersChange({ toDate: event.target.value })
              }
            />
          </label>

          <label className="field" htmlFor="group-by-filter">
            <span className="field__label">Group by</span>
            <select
              id="group-by-filter"
              className="field__control"
              value={filters.groupBy}
              onChange={(event) =>
                onFiltersChange({
                  groupBy: event.target.value as TransactionFilters["groupBy"],
                })
              }
            >
              <option value="none">No grouping</option>
              <option value="category">Category</option>
              <option value="month">Month</option>
              <option value="type">Type</option>
            </select>
          </label>
        </div>

        <div className="toolbar__actions">
          <button
            type="button"
            className="button button--ghost"
            onClick={onResetFilters}
            disabled={!hasActiveFilters}
          >
            Clear filters
          </button>

          <button
            type="button"
            className="button button--ghost"
            onClick={onExportCsv}
            disabled={transactions.length === 0 || isLoading}
          >
            Export CSV
          </button>

          <button
            type="button"
            className="button button--ghost"
            onClick={onExportJson}
            disabled={transactions.length === 0 || isLoading}
          >
            Export JSON
          </button>

          <button
            type="button"
            className="button button--secondary"
            onClick={onAddTransaction}
            disabled={role !== "admin" || isLoading}
          >
            Add
          </button>

          <button
            type="button"
            className="button button--ghost"
            onClick={onResetData}
            disabled={role !== "admin" || isLoading}
          >
            Reset demo
          </button>

          <button
            type="button"
            className="button button--danger"
            onClick={onClearData}
            disabled={role !== "admin" || allTransactionsCount === 0 || isLoading}
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="transactions-summary">
        <p>
          Showing <strong>{transactions.length}</strong> of{" "}
          <strong>{allTransactionsCount}</strong> transactions.
        </p>
        <p>{role === "admin" ? "Edit controls are visible." : "Read-only mode."}</p>
      </div>

      <GroupedSummary groupBy={filters.groupBy} items={groupedSummary} />

      {allTransactionsCount === 0 ? (
        <EmptyState
          title="Your transaction list is empty"
          description="The entire dataset has been cleared. Restore the seeded demo transactions or add a new one as Admin."
          primaryActionLabel={role === "admin" ? "Restore demo data" : undefined}
          onPrimaryAction={role === "admin" ? onResetData : undefined}
          secondaryActionLabel={role === "admin" ? "Add transaction" : undefined}
          onSecondaryAction={role === "admin" ? onAddTransaction : undefined}
        />
      ) : transactions.length === 0 ? (
        <EmptyState
          title="No transactions match these filters"
          description="Try clearing the search term or broadening the category and type filters."
          primaryActionLabel="Clear filters"
          onPrimaryAction={onResetFilters}
        />
      ) : (
        <div className="table-wrapper">
          <table className="transaction-table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Title</th>
                <th scope="col">Category</th>
                <th scope="col">Type</th>
                <th scope="col">Amount</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td data-label="Date">{formatDisplayDate(transaction.date)}</td>
                  <td data-label="Title">
                    <div className="transaction-table__title">
                      <strong>{transaction.title}</strong>
                      {transaction.note ? <span>{transaction.note}</span> : null}
                    </div>
                  </td>
                  <td data-label="Category">{transaction.category}</td>
                  <td data-label="Type">
                    <span
                      className={`type-badge type-badge--${transaction.type}`}
                    >
                      {typeLabels[transaction.type]}
                    </span>
                  </td>
                  <td
                    data-label="Amount"
                    className={
                      transaction.type === "income"
                        ? "amount amount--income"
                        : "amount amount--expense"
                    }
                  >
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td data-label="Action">
                    <button
                      type="button"
                      className="table-link"
                      onClick={() => onEditTransaction(transaction)}
                      disabled={role !== "admin"}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
