import type { Transaction } from "../types/finance";

function triggerDownload(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();

  URL.revokeObjectURL(url);
}

function getExportFileName(extension: "csv" | "json") {
  const dateStamp = new Date().toISOString().slice(0, 10);
  return `finance-dashboard-transactions-${dateStamp}.${extension}`;
}

export function exportTransactionsAsJson(transactions: Transaction[]) {
  triggerDownload(
    JSON.stringify(transactions, null, 2),
    getExportFileName("json"),
    "application/json",
  );
}

export function exportTransactionsAsCsv(transactions: Transaction[]) {
  const header = ["Date", "Title", "Category", "Type", "Amount", "Note"];
  const rows = transactions.map((transaction) =>
    [
      transaction.date,
      transaction.title,
      transaction.category,
      transaction.type,
      transaction.amount.toString(),
      transaction.note ?? "",
    ]
      .map((value) => `"${value.replace(/"/g, '""')}"`)
      .join(","),
  );

  triggerDownload(
    [header.join(","), ...rows].join("\n"),
    getExportFileName("csv"),
    "text/csv;charset=utf-8",
  );
}
