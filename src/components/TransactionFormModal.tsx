import { useEffect, useState } from "react";
import type { Transaction, TransactionType } from "../types/finance";

interface TransactionFormModalProps {
  mode: "add" | "edit";
  initialTransaction?: Transaction;
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, "id"> | Transaction) => void;
}

interface TransactionDraft {
  date: string;
  title: string;
  amount: string;
  category: string;
  type: TransactionType;
  note: string;
}

const categoryOptions = [
  "Salary",
  "Freelance",
  "Housing",
  "Groceries",
  "Food",
  "Transport",
  "Travel",
  "Utilities",
  "Shopping",
  "Entertainment",
  "Health",
  "Investments",
] as const;

function createInitialDraft(
  mode: "add" | "edit",
  transaction?: Transaction,
): TransactionDraft {
  if (mode === "edit" && transaction) {
    return {
      date: transaction.date,
      title: transaction.title,
      amount: String(transaction.amount),
      category: transaction.category,
      type: transaction.type,
      note: transaction.note ?? "",
    };
  }

  return {
    date: new Date().toISOString().slice(0, 10),
    title: "",
    amount: "",
    category: "Groceries",
    type: "expense",
    note: "",
  };
}

export function TransactionFormModal({
  mode,
  initialTransaction,
  onClose,
  onSubmit,
}: TransactionFormModalProps) {
  const [draft, setDraft] = useState<TransactionDraft>(
    createInitialDraft(mode, initialTransaction),
  );

  useEffect(() => {
    setDraft(createInitialDraft(mode, initialTransaction));
  }, [initialTransaction, mode]);

  function updateDraft<K extends keyof TransactionDraft>(
    key: K,
    value: TransactionDraft[K],
  ) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amount = Number(draft.amount);

    if (!draft.title.trim() || !draft.date || Number.isNaN(amount) || amount <= 0) {
      return;
    }

    const payload = {
      date: draft.date,
      title: draft.title.trim(),
      amount,
      category: draft.category,
      type: draft.type,
      note: draft.note.trim() || undefined,
    };

    if (mode === "edit" && initialTransaction) {
      onSubmit({
        ...initialTransaction,
        ...payload,
      });
      return;
    }

    onSubmit(payload);
  }

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        aria-labelledby="transaction-modal-title"
        aria-modal="true"
        className="modal-card"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-card__header">
          <div>
            <p className="section-kicker">Admin workflow</p>
            <h2 id="transaction-modal-title">
              {mode === "edit" ? "Edit transaction" : "Add transaction"}
            </h2>
          </div>
          <button
            type="button"
            className="button button--ghost"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-form__grid">
            <label className="field" htmlFor="transaction-title">
              <span className="field__label">Title</span>
              <input
                id="transaction-title"
                className="field__control"
                value={draft.title}
                onChange={(event) => updateDraft("title", event.target.value)}
                placeholder="Ex: Salary credit or grocery run"
                required
                type="text"
              />
            </label>

            <label className="field" htmlFor="transaction-date">
              <span className="field__label">Date</span>
              <input
                id="transaction-date"
                className="field__control"
                value={draft.date}
                onChange={(event) => updateDraft("date", event.target.value)}
                required
                type="date"
              />
            </label>

            <label className="field" htmlFor="transaction-amount">
              <span className="field__label">Amount</span>
              <input
                id="transaction-amount"
                className="field__control"
                value={draft.amount}
                onChange={(event) => updateDraft("amount", event.target.value)}
                min="1"
                placeholder="0"
                required
                type="number"
              />
            </label>

            <label className="field" htmlFor="transaction-category">
              <span className="field__label">Category</span>
              <select
                id="transaction-category"
                className="field__control"
                value={draft.category}
                onChange={(event) => updateDraft("category", event.target.value)}
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="field" htmlFor="transaction-type">
              <span className="field__label">Type</span>
              <select
                id="transaction-type"
                className="field__control"
                value={draft.type}
                onChange={(event) =>
                  updateDraft("type", event.target.value as TransactionType)
                }
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>

            <label className="field field--wide" htmlFor="transaction-note">
              <span className="field__label">Note</span>
              <textarea
                id="transaction-note"
                className="field__control field__control--textarea"
                value={draft.note}
                onChange={(event) => updateDraft("note", event.target.value)}
                placeholder="Optional context for the transaction"
                rows={4}
              />
            </label>
          </div>

          <div className="modal-form__actions">
            <button type="button" className="button button--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button button--primary">
              {mode === "edit" ? "Save changes" : "Create transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
