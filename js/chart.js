import { groupByCategory } from "./utils.js";

const canvas = document.getElementById("chart");
let chart = null;

const COLORS = {
  Food: "#f59e0b",
  Transport: "#3b82f6",
  Bills: "#ef4444",
  Shopping: "#8b5cf6",
  Entertainment: "#10b981",
  Other: "#6b7280",
};

export function renderChart(expenses) {
  // Chart.js comes from the CDN script tag as a global
  if (typeof Chart === "undefined") {
    console.error("Chart.js did not load.");
    return;
  }

  // Destroy the old chart before drawing a new one to avoid glitches
  if (chart) {
    chart.destroy();
    chart = null;
  }

  const totals = groupByCategory(expenses);
  const labels = Object.keys(totals);

  // Nothing to draw: leave the canvas empty
  if (!labels.length) return;

  chart = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data: labels.map((label) => totals[label]),
          backgroundColor: labels.map((label) => COLORS[label] || "#9ca3af"),
        },
      ],
    },
        options: {
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: getComputedStyle(document.documentElement)
              .getPropertyValue("--text")
              .trim(),
          },
        },
      },
    },
  });
}