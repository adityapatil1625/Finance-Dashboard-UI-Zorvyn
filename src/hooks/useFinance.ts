import { useContext } from "react";
import {
  FinanceContext,
  type FinanceContextValue,
} from "../context/finance-store";

export function useFinance(): FinanceContextValue {
  const context = useContext(FinanceContext);

  if (!context) {
    throw new Error("useFinance must be used within FinanceProvider");
  }

  return context;
}
