export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "LKR",
  }).format(amount);
}

export function formatDate(dateString) {
  // "2026-10-24" -> "Oct 24, 2026"
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function validateExpense({ title, amount, category, date }) {
  if (!title || !title.trim()) return "Please enter a title.";
  if (!(amount > 0)) return "Amount must be greater than 0.";
  if (!category) return "Please choose a category.";
  if (!date) return "Please pick a date.";
  return null; // null means valid
}

export function groupByCategory(expenses) {
  return expenses.reduce((totals, expense) => {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    return totals;
  }, {});
}

export function getTotal(expenses) {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

export function getFilteredExpenses(expenses, { category, month }) {
  return expenses.filter((expense) => {
    const matchesCategory = category === "all" || expense.category === category;
    const matchesMonth = !month || expense.date.slice(0, 7) === month;
    return matchesCategory && matchesMonth;
  });
}

export function toCSV(expenses) {
  const escape = (value) => `"${String(value).replace(/"/g, '""')}"`;
  const header = ["Title", "Amount", "Category", "Date"].join(",");
  const rows = expenses.map((e) =>
    [e.title, e.amount, e.category, e.date].map(escape).join(",")
  );
  return [header, ...rows].join("\n");
}