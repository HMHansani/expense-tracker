const STORAGE_KEY = "expenses";

export function getExpenses() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Could not read expenses:", error);
    return [];
  }
}

export function saveExpenses(expenses) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.error("Could not save expenses:", error);
  }
}

export function clearExpenses() {
  localStorage.removeItem(STORAGE_KEY);
}