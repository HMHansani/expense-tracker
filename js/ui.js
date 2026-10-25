import { formatCurrency, formatDate, getTotal } from "./utils.js";

const list = document.getElementById("expense-list");
const emptyMessage = document.getElementById("empty-message");
const totalEl = document.getElementById("total");
const errorEl = document.getElementById("error");
const form = document.getElementById("expense-form");
const submitBtn = form.querySelector('button[type="submit"]');
const cancelBtn = document.getElementById("cancel-edit");
const formHeading = document.getElementById("form-heading");

export function renderExpenses(expenses, emptyText = "No expenses yet.") {
  list.innerHTML = "";
  emptyMessage.textContent = emptyText;
  emptyMessage.style.display = expenses.length ? "none" : "block";

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

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    editBtn.setAttribute("aria-label", `Edit ${expense.title}`);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✕";
    deleteBtn.setAttribute("aria-label", `Delete ${expense.title}`);

    li.append(info, amount, editBtn, deleteBtn);
    list.appendChild(li);
  });
}

export function renderTotal(expenses) {
  totalEl.textContent = formatCurrency(getTotal(expenses));
}

export function showError(message) {
  errorEl.textContent = message;
}

export function setEditMode(isEditing) {
  submitBtn.textContent = isEditing ? "Save changes" : "Add";
  formHeading.textContent = isEditing ? "Edit expense" : "Add expense";
  cancelBtn.hidden = !isEditing;
}

export function fillForm(expense) {
  document.getElementById("title").value = expense.title;
  document.getElementById("amount").value = expense.amount;
  document.getElementById("category").value = expense.category;
  document.getElementById("date").value = expense.date;
}

export function clearForm() {
  form.reset();
  errorEl.textContent = "";
  setEditMode(false);
}

export function downloadFile(filename, content) {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}