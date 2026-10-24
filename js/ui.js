import { formatCurrency, formatDate, getTotal } from "./utils.js";

const list = document.getElementById("expense-list");
const emptyMessage = document.getElementById("empty-message");
const totalEl = document.getElementById("total");
const errorEl = document.getElementById("error");
const form = document.getElementById("expense-form");

export function renderExpenses(expenses, emptyText = "No expenses yet.") {
  list.innerHTML = "";
  emptyMessage.textContent = emptyText;
  emptyMessage.style.display = expenses.length ? "none" : "block";

  // ...the rest of the function stays exactly the same

  expenses.forEach((expense) => {
    const li = document.createElement("li");
    li.className = "expense-item";
    li.dataset.id = expense.id;

    const info = document.createElement("div");
    info.className = "expense-info";

    const title = document.createElement("strong");
    title.textContent = expense.title;

    const meta = document.createElement("span");
    meta.textContent = `${expense.category} · ${formatDate(expense.date)}`;

    info.append(title, meta);

    const amount = document.createElement("span");
    amount.className = "expense-amount";
    amount.textContent = formatCurrency(expense.amount);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✕";
    deleteBtn.setAttribute("aria-label", `Delete ${expense.title}`);

    li.append(info, amount, deleteBtn);
    list.appendChild(li);
  });
}

export function renderTotal(expenses) {
  totalEl.textContent = formatCurrency(getTotal(expenses));
}

export function showError(message) {
  errorEl.textContent = message;
}

export function clearForm() {
  form.reset();
  errorEl.textContent = "";
}