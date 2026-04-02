import { useState } from "react";
import "./App.css";
import { CategoryChartCard } from "./components/CategoryChartCard";
import { InsightsRail } from "./components/InsightsRail";
import { LoadingPanel } from "./components/LoadingPanel";
import { SummaryCards } from "./components/SummaryCards";
import { TopBar } from "./components/TopBar";
import { TransactionFormModal } from "./components/TransactionFormModal";
import { TransactionsSection } from "./components/TransactionsSection";
import { TrendChartCard } from "./components/TrendChartCard";
import { FinanceProvider } from "./context/FinanceContext";
import { useFinance } from "./hooks/useFinance";
import type { Transaction } from "./types/finance";
import {
  getAvailableCategories,
  getCategoryBreakdown,
  getDashboardMetrics,
  getFilteredTransactions,
  getGroupedSummary,
  getInsights,
  getMonthlyTrend,
} from "./utils/analytics";
import {
  exportTransactionsAsCsv,
  exportTransactionsAsJson,
} from "./utils/export";

function DashboardApp() {
  const {
    dataSource,
    isLoading,
    transactions,
    filters,
    role,
    theme,
    setTheme,
    setRole,
    setFilters,
    resetFilters,
    addTransaction,
    updateTransaction,
    resetTransactions,
    clearTransactions,
  } = useFinance();
  const [modalState, setModalState] = useState<{
    mode: "add" | "edit";
    transaction?: Transaction;
  } | null>(null);

  const filteredTransactions = getFilteredTransactions(transactions, filters);
  const metrics = getDashboardMetrics(filteredTransactions);
  const monthlyTrend = getMonthlyTrend(filteredTransactions);
  const categoryBreakdown = getCategoryBreakdown(filteredTransactions);
  const insights = getInsights(filteredTransactions);
  const groupedSummary = getGroupedSummary(
    filteredTransactions,
    filters.groupBy,
  );
  const categories = getAvailableCategories(transactions);

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  function openAddTransaction() {
    if (role !== "admin") {
      return;
    }

    setModalState({ mode: "add" });
  }

  function openEditTransaction(transaction: Transaction) {
    if (role !== "admin") {
      return;
    }

    setModalState({ mode: "edit", transaction });
  }

  function closeModal() {
    setModalState(null);
  }

  function handleTransactionSubmit(
    payload: Omit<Transaction, "id"> | Transaction,
  ) {
    if (role !== "admin") {
      return;
    }

    if ("id" in payload) {
      updateTransaction(payload);
    } else {
      addTransaction({
        ...payload,
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `txn-${Date.now()}`,
      });
    }

    closeModal();
  }

  function handleClearData() {
    if (role !== "admin") {
      return;
    }

    const shouldClear = window.confirm(
      "Clear every transaction from local storage? You can restore the demo data afterward.",
    );

    if (shouldClear) {
      clearTransactions();
    }
  }

  function handleResetData() {
    resetTransactions();
  }

  function handleExportCsv() {
    exportTransactionsAsCsv(filteredTransactions);
  }

  function handleExportJson() {
    exportTransactionsAsJson(filteredTransactions);
  }

  if (isLoading) {
    return (
      <main className="dashboard-shell" data-theme={theme}>
        <div className="dashboard-backdrop" />

        <div className="dashboard-content">
          <TopBar
            dataSource={dataSource}
            isLoading={isLoading}
            role={role}
            theme={theme}
            transactionCount={transactions.length}
            onRoleChange={setRole}
            onAddTransaction={openAddTransaction}
            onThemeToggle={toggleTheme}
          />

          <LoadingPanel
            title="Loading demo transactions"
            description="The dashboard is simulating a mock API bootstrap before rendering the finance views."
          />
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-shell" data-theme={theme}>
      <div className="dashboard-backdrop" />

      <div className="dashboard-content">
        <TopBar
          dataSource={dataSource}
          isLoading={isLoading}
          role={role}
          theme={theme}
          transactionCount={transactions.length}
          onRoleChange={setRole}
          onAddTransaction={openAddTransaction}
          onThemeToggle={toggleTheme}
        />

        <SummaryCards metrics={metrics} />

        <section className="content-grid">
          <div className="content-grid__main">
            <div className="chart-grid">
              <TrendChartCard
                data={monthlyTrend}
                hasTransactions={transactions.length > 0}
                onResetData={handleResetData}
              />
              <CategoryChartCard data={categoryBreakdown} />
            </div>

            <InsightsRail
              insights={insights}
              metrics={metrics}
              role={role}
              transactionCount={filteredTransactions.length}
            />

            <TransactionsSection
              allTransactionsCount={transactions.length}
              categories={categories}
              filters={filters}
              groupedSummary={groupedSummary}
              isLoading={isLoading}
              onAddTransaction={openAddTransaction}
              onClearData={handleClearData}
              onEditTransaction={openEditTransaction}
              onExportCsv={handleExportCsv}
              onExportJson={handleExportJson}
              onFiltersChange={setFilters}
              onResetData={handleResetData}
              onResetFilters={resetFilters}
              role={role}
              transactions={filteredTransactions}
            />
          </div>
        </section>
      </div>

      {modalState ? (
        <TransactionFormModal
          initialTransaction={modalState.transaction}
          mode={modalState.mode}
          onClose={closeModal}
          onSubmit={handleTransactionSubmit}
        />
      ) : null}
    </main>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <DashboardApp />
    </FinanceProvider>
  );
}
