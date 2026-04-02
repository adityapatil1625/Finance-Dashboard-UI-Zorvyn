import { seededTransactions } from "../data/mockTransactions";
import type { Transaction } from "../types/finance";

const MOCK_API_DELAY_MS = 650;

export async function fetchMockTransactions(): Promise<Transaction[]> {
  await new Promise((resolve) => {
    window.setTimeout(resolve, MOCK_API_DELAY_MS);
  });

  return seededTransactions.map((transaction) => ({ ...transaction }));
}
