import { getExpenses, saveExpenses } from "./storage.js";
import { generateId, validateExpense } from "./utils.js";
import { renderExpenses, renderTotal, showError, clearForm } from "./ui.js";

let expenses = getExpenses();

const form = document.getElementById("expense-form");
const list = document.getElementById("expense-list");

function render() {
  renderExpenses(expenses);
  renderTotal(expenses);
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

render();