import "./theme.js";
import { getExpenses, saveExpenses } from "./storage.js";
import { generateId, validateExpense, getFilteredExpenses, toCSV } from "./utils.js";
import {
  renderExpenses, renderTotal, showError, clearForm,
  downloadFile, fillForm, setEditMode,
} from "./ui.js";
import { renderChart } from "./chart.js";

let expenses = getExpenses();
let editingId = null;

const form = document.getElementById("expense-form");
const list = document.getElementById("expense-list");
const categoryFilter = document.getElementById("filter-category");
const monthFilter = document.getElementById("filter-month");
const clearFiltersBtn = document.getElementById("clear-filters");
const exportBtn = document.getElementById("export-csv");
const cancelEditBtn = document.getElementById("cancel-edit");

function getFiltered() {
  return getFilteredExpenses(expenses, {
    category: categoryFilter.value,
    month: monthFilter.value,
  });
}

function render() {
  const filtered = getFiltered();
  const emptyText =
    expenses.length && !filtered.length
      ? "No expenses match your filters."
      : "No expenses yet.";

  renderExpenses(filtered, emptyText);
  renderTotal(filtered);
  renderChart(filtered);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const newExpense = {
    title: document.getElementById("title").value,
    amount: parseFloat(document.getElementById("amount").value),
    category: document.getElementById("category").value,
    date: document.getElementById("date").value,
  };

  const error = validateExpense(newExpense);
  if (error) {
    showError(error);
    return;
  }

  const cleaned = { ...newExpense, title: newExpense.title.trim() };

  if (editingId) {
    expenses = expenses.map((e) =>
      e.id === editingId ? { ...e, ...cleaned } : e
    );
    editingId = null;
  } else {
    expenses.unshift({ id: generateId(), ...cleaned });
  }

  saveExpenses(expenses);
  clearForm();
  render();
});

list.addEventListener("click", (event) => {
  const id = event.target.closest("li")?.dataset.id;
  if (!id) return;

  if (event.target.classList.contains("edit-btn")) {
    const expense = expenses.find((e) => e.id === id);
    if (!expense) return;
    editingId = id;
    fillForm(expense);
    setEditMode(true);
    showError("");
    form.scrollIntoView({ behavior: "smooth" });
    return;
  }

  if (event.target.classList.contains("delete-btn")) {
    expenses = expenses.filter((e) => e.id !== id);
    if (editingId === id) {
      editingId = null;
      clearForm();
    }
    saveExpenses(expenses);
    render();
  }
});

cancelEditBtn.addEventListener("click", () => {
  editingId = null;
  clearForm();
});

categoryFilter.addEventListener("change", render);
monthFilter.addEventListener("change", render);

clearFiltersBtn.addEventListener("click", () => {
  categoryFilter.value = "all";
  monthFilter.value = "";
  render();
});

exportBtn.addEventListener("click", () => {
  const filtered = getFiltered();
  if (!filtered.length) return;
  downloadFile("expenses.csv", toCSV(filtered));
});

document.addEventListener("themechange", render);

render();