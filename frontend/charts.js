/* ============================================================
   InvenTrack Pro — Charts Module (charts.js)
   ============================================================ */

'use strict';

const InvenCharts = (() => {

  const chartInstances = {};

  // ---- Color palette matching dark-blue theme ----
  const COLORS = {
    blue:   '#2563eb',
    cyan:   '#06b6d4',
    green:  '#10b981',
    red:    '#ef4444',
    amber:  '#f59e0b',
    purple: '#8b5cf6',
    navy:   '#1e4a9e',
    grid:   'rgba(30, 74, 158, 0.2)',
    text:   '#94a3b8',
  };

  const baseFont = { family: "'Exo 2', sans-serif", size: 11 };

  const baseScales = {
    x: {
      grid:  { color: COLORS.grid, drawBorder: false },
      ticks: { color: COLORS.text, font: baseFont },
    },
    y: {
      grid:  { color: COLORS.grid, drawBorder: false },
      ticks: { color: COLORS.text, font: baseFont },
    },
  };

  const baseLegend = {
    labels: { color: COLORS.text, font: baseFont, boxWidth: 12, padding: 16 }
  };

  function destroy(id) {
    if (chartInstances[id]) { chartInstances[id].destroy(); delete chartInstances[id]; }
  }

  // ---- Stock Trend Line Chart ----
  function renderStockTrend(period = 'week') {
    destroy('stockTrendChart');
    const ctx = document.getElementById('stockTrendChart');
    if (!ctx) return;

    const labels = {
      week:  ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      month: ['Wk1','Wk2','Wk3','Wk4'],
      year:  ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    }[period];

    const stockData   = labels.map(() => Math.floor(Math.random()*80+120));
    const damagedData = labels.map(() => Math.floor(Math.random()*10+2));
    const checkoutData= labels.map(() => Math.floor(Math.random()*15+5));

    chartInstances['stockTrendChart'] = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Stock Levels',
            data: stockData,
            borderColor: COLORS.cyan,
            backgroundColor: 'rgba(6,182,212,0.1)',
            fill: true,
            tension: 0.45,
            pointBackgroundColor: COLORS.cyan,
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 2.5,
          },
          {
            label: 'Damaged',
            data: damagedData,
            borderColor: COLORS.red,
            backgroundColor: 'rgba(239,68,68,0.08)',
            fill: false,
            tension: 0.45,
            pointBackgroundColor: COLORS.red,
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 2,
          },
          {
            label: 'Staff Checkouts',
            data: checkoutData,
            borderColor: COLORS.amber,
            backgroundColor: 'rgba(245,158,11,0.08)',
            fill: false,
            tension: 0.45,
            pointBackgroundColor: COLORS.amber,
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 2,
          },
        ]
      },
      options: {
        responsive: true,
        animation: { duration: 600, easing: 'easeInOutQuart' },
        plugins: { legend: baseLegend, tooltip: { backgroundColor: '#0e2048', titleFont: baseFont, bodyFont: baseFont, borderColor: COLORS.grid, borderWidth: 1 } },
        scales: baseScales,
      }
    });
  }

  // ---- Category Pie Chart ----
  function renderCategoryPie() {
    destroy('categoryPieChart');
    const ctx = document.getElementById('categoryPieChart');
    if (!ctx) return;
    const stats = InvenData.getStats();

    chartInstances['categoryPieChart'] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Perishable', 'Non-Perishable'],
        datasets: [{
          data: [stats.perishableCount, stats.nonPerishCount],
          backgroundColor: [COLORS.cyan, COLORS.blue],
          borderColor: '#0b1a3a',
          borderWidth: 3,
          hoverOffset: 6,
        }]
      },
      options: {
        responsive: true,
        cutout: '65%',
        animation: { duration: 700 },
        plugins: {
          legend: baseLegend,
          tooltip: { backgroundColor: '#0e2048', bodyFont: baseFont, borderColor: COLORS.grid, borderWidth: 1 }
        }
      }
    });
  }

  // ---- Damaged Bar Chart (Reports page) ----
  function renderDamagedBar() {
    destroy('damagedBarChart');
    const ctx = document.getElementById('damagedBarChart');
    if (!ctx) return;
    const damaged = InvenData.Damaged.getAll();
    const types = ['Broken','Expired','Water Damaged','Contaminated','Missing Parts','Other'];
    const counts = types.map(t => damaged.filter(d => d.damageType === t).length);
    const colors = [COLORS.red, COLORS.amber, COLORS.blue, COLORS.purple, COLORS.navy, COLORS.text];

    chartInstances['damagedBarChart'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: types,
        datasets: [{
          label: 'Count',
          data: counts,
          backgroundColor: colors.map(c => c + 'cc'),
          borderColor: colors,
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        animation: { duration: 600 },
        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0e2048', bodyFont: baseFont, borderColor: COLORS.grid, borderWidth: 1 } },
        scales: { ...baseScales, y: { ...baseScales.y, beginAtZero: true, ticks: { ...baseScales.y.ticks, stepSize: 1 } } }
      }
    });
  }

  // ---- Staff Checkout Trend ----
  function renderStaffTrend() {
    destroy('staffTrendChart');
    const ctx = document.getElementById('staffTrendChart');
    if (!ctx) return;
    const labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const data   = [3,5,2,7,4,1,6];

    chartInstances['staffTrendChart'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Checkouts',
          data,
          backgroundColor: 'rgba(6,182,212,0.25)',
          borderColor: COLORS.cyan,
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        animation: { duration: 600 },
        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0e2048', bodyFont: baseFont, borderColor: COLORS.grid, borderWidth: 1 } },
        scales: baseScales,
      }
    });
  }

  // ---- Stock Status Doughnut ----
  function renderStockStatus() {
    destroy('stockStatusChart');
    const ctx = document.getElementById('stockStatusChart');
    if (!ctx) return;
    const stats = InvenData.getStats();

    chartInstances['stockStatusChart'] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['In Stock','Low Stock','Out of Stock'],
        datasets: [{
          data: [stats.inStock, stats.lowStock, stats.outOfStock],
          backgroundColor: [COLORS.green, COLORS.amber, COLORS.red],
          borderColor: '#0b1a3a',
          borderWidth: 3,
          hoverOffset: 6,
        }]
      },
      options: {
        responsive: true,
        cutout: '60%',
        animation: { duration: 700 },
        plugins: {
          legend: baseLegend,
          tooltip: { backgroundColor: '#0e2048', bodyFont: baseFont, borderColor: COLORS.grid, borderWidth: 1 }
        }
      }
    });
  }

  // ---- Low Stock Bar Chart ----
  function renderLowStockBar() {
    destroy('lowStockBarChart');
    const ctx = document.getElementById('lowStockBarChart');
    if (!ctx) return;
    const items = InvenData.getStats().lowStockItems.slice(0, 5);

    chartInstances['lowStockBarChart'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: items.map(i => i.name),
        datasets: [{
          label: 'Current Qty',
          data: items.map(i => i.qty),
          backgroundColor: 'rgba(245,158,11,0.3)',
          borderColor: COLORS.amber,
          borderWidth: 2,
          borderRadius: 6,
        }, {
          label: 'Min Level',
          data: items.map(i => i.minLevel),
          backgroundColor: 'rgba(239,68,68,0.2)',
          borderColor: COLORS.red,
          borderWidth: 2,
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        animation: { duration: 600 },
        plugins: { legend: baseLegend, tooltip: { backgroundColor: '#0e2048', bodyFont: baseFont, borderColor: COLORS.grid, borderWidth: 1 } },
        scales: { ...baseScales, y: { ...baseScales.y, beginAtZero: true } }
      }
    });
  }

  // ---- Init all dashboard charts ----
  function initDashboard() {
    renderStockTrend('week');
    renderCategoryPie();
  }

  function initReports() {
    renderDamagedBar();
    renderStaffTrend();
    renderStockStatus();
    renderLowStockBar();
  }

  return { renderStockTrend, renderCategoryPie, renderDamagedBar, renderStaffTrend, renderStockStatus, renderLowStockBar, initDashboard, initReports };

})();
