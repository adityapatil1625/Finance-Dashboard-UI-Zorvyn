import { createContext } from "react";
import type {
  DataSource,
  ThemeMode,
  Transaction,
  TransactionFilters,
  UserRole,
} from "../types/finance";

export interface FinanceContextValue {
  dataSource: DataSource;
  isLoading: boolean;
  transactions: Transaction[];
  filters: TransactionFilters;
  role: UserRole;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  setRole: (role: UserRole) => void;
  setFilters: (filters: Partial<TransactionFilters>) => void;
  resetFilters: () => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  resetTransactions: () => void;
  clearTransactions: () => void;
}

export const FinanceContext = createContext<FinanceContextValue | null>(null);
