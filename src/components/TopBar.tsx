import type { DataSource, ThemeMode, UserRole } from "../types/finance";

interface TopBarProps {
  dataSource: DataSource;
  isLoading: boolean;
  role: UserRole;
  theme: ThemeMode;
  transactionCount: number;
  onRoleChange: (role: UserRole) => void;
  onAddTransaction: () => void;
  onThemeToggle: () => void;
}

export function TopBar({
  dataSource,
  isLoading,
  role,
  theme,
  transactionCount,
  onRoleChange,
  onAddTransaction,
  onThemeToggle,
}: TopBarProps) {
  return (
    <header className="hero-card">
      <div className="hero-card__copy">
        <p className="section-kicker">Finance cockpit</p>
        <h1>Finance Dashboard UI</h1>
        <p className="hero-card__lede">
          Track your current cash position, inspect every transaction, and
          switch roles to demonstrate read-only versus editable workflows.
        </p>
        <div className="hero-card__highlights">
          <span>{transactionCount} transactions available</span>
          <span>Local persistence enabled</span>
          <span>
            {isLoading
              ? "Syncing from mock API"
              : dataSource === "mock-api"
                ? "Bootstrapped from mock API"
                : "Loaded from local cache"}
          </span>
        </div>
      </div>

      <div className="hero-card__actions">
        <button
          type="button"
          className="button button--ghost"
          onClick={onThemeToggle}
        >
          {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        </button>

        <label className="field field--compact" htmlFor="role-switcher">
          <span className="field__label">Demo role</span>
          <select
            id="role-switcher"
            className="field__control"
            value={role}
            onChange={(event) => onRoleChange(event.target.value as UserRole)}
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <div className="role-note">
          <p className="role-note__title">
            {role === "admin" ? "Admin access" : "Viewer access"}
          </p>
          <p className="role-note__description">
            {role === "admin"
              ? "Can add, edit, reset, and clear transactions from the UI."
              : "Can inspect balances, charts, and transactions without editing data."}
          </p>
        </div>

        <button
          type="button"
          className="button button--primary"
          onClick={onAddTransaction}
          disabled={role !== "admin" || isLoading}
        >
          Add transaction
        </button>
      </div>
    </header>
  );
}
