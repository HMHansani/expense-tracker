import "./theme.js";
import { getExpenses, saveExpenses } from "./storage.js";
import { generateId, validateExpense, getFilteredExpenses, toCSV } from "./utils.js";
import { renderExpenses, renderTotal, showError, clearForm, downloadFile } from "./ui.js";
import { renderChart } from "./chart.js";
let expenses = getExpenses();

const form = document.getElementById("expense-form");
const list = document.getElementById("expense-list");
const categoryFilter = document.getElementById("filter-category");
const monthFilter = document.getElementById("filter-month");
const clearFiltersBtn = document.getElementById("clear-filters");

function render() {
  const filtered = getFilteredExpenses(expenses, {
    category: categoryFilter.value,
    month: monthFilter.value,
  });

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

  expenses.unshift({
    id: generateId(),
    ...newExpense,
    title: newExpense.title.trim(),
  });

  saveExpenses(expenses);
  clearForm();
  render();
});

list.addEventListener("click", (event) => {
  if (!event.target.classList.contains("delete-btn")) return;

  const id = event.target.closest("li").dataset.id;
  expenses = expenses.filter((expense) => expense.id !== id);

  saveExpenses(expenses);
  render();
});

categoryFilter.addEventListener("change", render);
monthFilter.addEventListener("change", render);

clearFiltersBtn.addEventListener("click", () => {
  categoryFilter.value = "all";
  monthFilter.value = "";
  render();
});

render();
const exportBtn = document.getElementById("export-csv");

exportBtn.addEventListener("click", () => {
  const filtered = getFilteredExpenses(expenses, {
    category: categoryFilter.value,
    month: monthFilter.value,
  });
  if (!filtered.length) return;
  downloadFile("expenses.csv", toCSV(filtered));
});

// Redraw the chart so its text color matches the theme
document.addEventListener("themechange", render);