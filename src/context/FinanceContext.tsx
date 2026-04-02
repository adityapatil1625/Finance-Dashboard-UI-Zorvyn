import { type ReactNode, useEffect, useReducer } from "react";
import { FinanceContext, type FinanceContextValue } from "./finance-store";
import { fetchMockTransactions } from "../services/mockApi";
import type {
  DataSource,
  ThemeMode,
  Transaction,
  TransactionFilters,
  UserRole,
} from "../types/finance";

interface FinanceState {
  dataSource: DataSource;
  isLoading: boolean;
  transactions: Transaction[];
  filters: TransactionFilters;
  role: UserRole;
  theme: ThemeMode;
}

type FinanceAction =
  | {
      type: "hydrate-transactions";
      payload: { transactions: Transaction[]; dataSource: DataSource };
    }
  | { type: "set-loading"; payload: boolean }
  | { type: "set-theme"; payload: ThemeMode }
  | { type: "set-role"; payload: UserRole }
  | { type: "set-filters"; payload: Partial<TransactionFilters> }
  | { type: "reset-filters" }
  | { type: "add-transaction"; payload: Transaction }
  | { type: "update-transaction"; payload: Transaction }
  | { type: "clear-transactions" };

const TRANSACTIONS_STORAGE_KEY = "finance-dashboard-transactions";
const ROLE_STORAGE_KEY = "finance-dashboard-role";
const THEME_STORAGE_KEY = "finance-dashboard-theme";

const defaultFilters: TransactionFilters = {
  search: "",
  category: "all",
  type: "all",
  sort: "newest",
  fromDate: "",
  toDate: "",
  groupBy: "none",
};

function loadInitialState(): FinanceState {
  if (typeof window === "undefined") {
    return {
      dataSource: "mock-api",
      isLoading: true,
      transactions: [],
      filters: defaultFilters,
      role: "viewer",
      theme: "light",
    };
  }

  const rawStoredTransactions = window.localStorage.getItem(
    TRANSACTIONS_STORAGE_KEY,
  );
  const storedTransactions = rawStoredTransactions
    ? (JSON.parse(rawStoredTransactions) as Transaction[])
    : null;
  const storedRole = window.localStorage.getItem(ROLE_STORAGE_KEY) as
    | UserRole
    | null;
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY) as
    | ThemeMode
    | null;
  const preferredDarkMode = window.matchMedia("(prefers-color-scheme: dark)")
    .matches;

  return {
    dataSource: storedTransactions ? "local-cache" : "mock-api",
    isLoading: !storedTransactions,
    transactions: storedTransactions ?? [],
    filters: defaultFilters,
    role:
      storedRole === "admin" || storedRole === "viewer"
        ? storedRole
        : "viewer",
    theme:
      storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : preferredDarkMode
          ? "dark"
          : "light",
  };
}

function financeReducer(
  state: FinanceState,
  action: FinanceAction,
): FinanceState {
  switch (action.type) {
    case "hydrate-transactions":
      return {
        ...state,
        dataSource: action.payload.dataSource,
        isLoading: false,
        transactions: action.payload.transactions,
      };
    case "set-loading":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "set-theme":
      return {
        ...state,
        theme: action.payload,
      };
    case "set-role":
      return {
        ...state,
        role: action.payload,
      };
    case "set-filters":
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    case "reset-filters":
      return {
        ...state,
        filters: defaultFilters,
      };
    case "add-transaction":
      return {
        ...state,
        dataSource: "local-cache",
        transactions: [action.payload, ...state.transactions],
      };
    case "update-transaction":
      return {
        ...state,
        dataSource: "local-cache",
        transactions: state.transactions.map((transaction) =>
          transaction.id === action.payload.id ? action.payload : transaction,
        ),
      };
    case "clear-transactions":
      return {
        ...state,
        dataSource: "local-cache",
        transactions: [],
      };
    default:
      return state;
  }
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(financeReducer, undefined, loadInitialState);

  useEffect(() => {
    if (!state.isLoading) {
      return undefined;
    }

    let cancelled = false;

    fetchMockTransactions().then((transactions) => {
      if (!cancelled) {
        dispatch({
          type: "hydrate-transactions",
          payload: { transactions, dataSource: "mock-api" },
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [state.isLoading]);

  useEffect(() => {
    if (!state.isLoading) {
      window.localStorage.setItem(
        TRANSACTIONS_STORAGE_KEY,
        JSON.stringify(state.transactions),
      );
    }
  }, [state.isLoading, state.transactions]);

  useEffect(() => {
    window.localStorage.setItem(ROLE_STORAGE_KEY, state.role);
  }, [state.role]);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, state.theme);
    window.document.body.dataset.theme = state.theme;
  }, [state.theme]);

  const value: FinanceContextValue = {
    ...state,
    setTheme: (theme) => dispatch({ type: "set-theme", payload: theme }),
    setRole: (role) => dispatch({ type: "set-role", payload: role }),
    setFilters: (filters) => dispatch({ type: "set-filters", payload: filters }),
    resetFilters: () => dispatch({ type: "reset-filters" }),
    addTransaction: (transaction) =>
      dispatch({ type: "add-transaction", payload: transaction }),
    updateTransaction: (transaction) =>
      dispatch({ type: "update-transaction", payload: transaction }),
    resetTransactions: () => {
      dispatch({ type: "set-loading", payload: true });
    },
    clearTransactions: () => dispatch({ type: "clear-transactions" }),
  };

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}
