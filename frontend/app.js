/* ============================================================
   InvenTrack Pro — Main Application (app.js)
   ============================================================ */

'use strict';

const App = (() => {

  // ---- DataTable instances ----
  const tables = {};
  
  // ---- User Role & Filter ----
  let userRole = 'viewer';
  let filterType = 'all';

  // ---- Utilities ----
  function formatDate(d) {
    if (!d) return '—';
    const dt = new Date(d);
    return dt.toLocaleDateString('en-KE', { year:'numeric', month:'short', day:'2-digit' });
  }

  function daysUntil(dateStr) {
    if (!dateStr) return null;
    const diff = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
    return diff;
  }

  function statusBadge(status) {
    const map = {
      'In Stock':               ['green', 'fa-circle-check'],
      'Low Stock':              ['amber', 'fa-triangle-exclamation'],
      'Out of Stock':           ['red',   'fa-circle-xmark'],
      'Under Review':           ['amber', 'fa-rotate'],
      'Written Off':            ['red',   'fa-ban'],
      'Returned to Supplier':   ['blue',  'fa-truck-arrow-right'],
      'Pending Return':         ['amber', 'fa-clock'],
      'Consumed':               ['cyan',  'fa-circle-check'],
      'Returned':               ['green', 'fa-check-double'],
    };
    const [color, icon] = map[status] || ['neutral', 'fa-circle'];
    return `<span class="badge badge-${color}"><i class="fa-solid ${icon}"></i> ${status}</span>`;
  }

  function expiryBadge(dateStr) {
    const days = daysUntil(dateStr);
    if (days === null) return '<span class="expiry-badge fresh">N/A</span>';
    if (days < 0)  return `<span class="expiry-badge expired"><i class="fa-solid fa-circle-xmark"></i> Expired</span>`;
    if (days <= 7) return `<span class="expiry-badge soon"><i class="fa-solid fa-triangle-exclamation"></i> ${days}d left</span>`;
    return `<span class="expiry-badge fresh"><i class="fa-solid fa-check"></i> ${days}d left</span>`;
  }

  function stockBar(qty, minLevel) {
    const maxDisplay = Math.max(qty, minLevel) * 2 || 100;
    const pct  = Math.min(Math.round((qty / maxDisplay) * 100), 100);
    const cls  = qty <= 0 ? 'low' : qty <= minLevel ? 'medium' : 'high';
    return `<div class="stock-bar-wrap">
      <div class="stock-bar"><div class="stock-bar-fill ${cls}" style="width:${pct}%"></div></div>
      <span class="stock-pct">${qty}</span>
    </div>`;
  }

  function actionBtns(id, type = 'item') {
    return `<div class="d-flex gap-1">
      <button class="btn-action-sm" title="View" onclick="App.viewRecord('${id}','${type}')"><i class="fa-solid fa-eye"></i></button>
      <button class="btn-action-sm danger" title="Delete" onclick="App.deleteRecord('${id}','${type}')"><i class="fa-solid fa-trash"></i></button>
      ${type==='staff' ? `<button class="btn-action-sm" title="Mark Returned" onclick="App.markReturned('${id}')"><i class="fa-solid fa-check"></i></button>` : ''}
      ${type==='damage' ? `<button class="btn-action-sm" title="Write Off" onclick="App.writeOff('${id}')"><i class="fa-solid fa-ban"></i></button>` : ''}
    </div>`;
  }

  // ---- Init DataTable helper ----
  function initDT(id, options = {}) {
    if (tables[id]) { tables[id].destroy(); }
    tables[id] = $(`#${id}`).DataTable({
      pageLength: 10,
      lengthChange: true,
      responsive: true,
      order: [],
      language: {
        search:         '',
        searchPlaceholder: 'Search...',
        lengthMenu:     'Show _MENU_ rows',
        info:           'Showing _START_–_END_ of _TOTAL_',
        paginate: { previous: '<i class="fa-solid fa-chevron-left"></i>', next: '<i class="fa-solid fa-chevron-right"></i>' },
        emptyTable: '<span style="color:#64748b;font-size:13px">No records found</span>',
      },
      ...options,
    });
    return tables[id];
  }

  // ---- PAGES ----
  function renderDashboard() {
    const stats = InvenData.getStats();
    countUp('totalItems',   stats.totalItems);
    countUp('inStockCount', stats.inStock);
    countUp('damagedCount', stats.damagedTotal);
    countUp('staffCheckouts', stats.staffCheckouts);

    // Low stock list
    const lst = document.getElementById('lowStockList');
    if (lst) {
      lst.innerHTML = '';
      const low = stats.lowStockItems;
      document.getElementById('lowStockBadge').textContent = low.length;
      if (low.length === 0) {
        lst.innerHTML = '<p style="color:var(--text-muted);font-size:13px;text-align:center;padding:20px;">✅ All items are adequately stocked</p>';
      } else {
        low.forEach(item => {
          const cls = item.status === 'Out of Stock' ? 'danger' : 'warn';
          const icon = item.status === 'Out of Stock' ? 'fa-circle-xmark' : 'fa-triangle-exclamation';
          lst.innerHTML += `<div class="alert-item ${cls}">
            <span class="alert-item-icon"><i class="fa-solid ${icon}"></i></span>
            <span class="alert-item-name">${item.name}</span>
            <span class="alert-item-qty">${item.qty} / ${item.minLevel} ${item.unit}</span>
            <span class="badge badge-${cls === 'danger' ? 'red' : 'amber'}">${item.status}</span>
          </div>`;
        });
      }
    }

    // Recent activity
    const act = document.getElementById('recentActivity');
    if (act) {
      act.innerHTML = '';
      const activities = InvenData.getActivity();
      activities.slice(0, 8).forEach(a => {
        const iconMap = { add: 'fa-plus', damage: 'fa-triangle-exclamation', checkout: 'fa-user-check' };
        act.innerHTML += `<div class="activity-item">
          <div class="activity-icon ${a.type}"><i class="fa-solid ${iconMap[a.type] || 'fa-circle'}"></i></div>
          <div class="activity-text">${a.text}</div>
          <div class="activity-time">${a.time}</div>
        </div>`;
      });
    }

    InvenCharts.initDashboard();
  }

  function renderAvailableTable() {
    let items = InvenData.Items.getAll();
    
    // Apply role-based filtering
    if (userRole === 'manager' && filterType === 'demand') {
      // Manager sees only perishable/demand items
      items = items.filter(i => i.category === 'Perishable');
    }
    
    const tbody = document.getElementById('availableTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    items.forEach(item => {
      tbody.innerHTML += `<tr>
        <td><span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--accent-cyan)">${item.id}</span></td>
        <td><strong>${item.name}</strong></td>
        <td><span class="badge badge-${item.category==='Perishable'?'cyan':'blue'}">${item.category}</span></td>
        <td>${stockBar(item.qty, item.minLevel)}</td>
        <td style="color:var(--text-secondary)">${item.unit}</td>
        <td style="font-family:'JetBrains Mono',monospace;color:var(--text-muted)">${item.minLevel}</td>
        <td>${statusBadge(item.status)}</td>
        <td style="color:var(--text-muted);font-size:12px">${formatDate(item.addedDate)}</td>
        <td>${actionBtns(item.id, 'item')}</td>
      </tr>`;
    });
    initDT('availableTable');
  }

  function renderDamagedTable() {
    const records = InvenData.Damaged.getAll();
    const tbody = document.getElementById('damagedTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const stats = InvenData.getStats();
    countUp('totalDamaged', stats.damagedTotal);
    countUp('reviewCount',  stats.underReview);
    countUp('writtenOffCount', stats.writtenOff);
    records.forEach(r => {
      tbody.innerHTML += `<tr>
        <td><span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--accent-red)">${r.ref}</span></td>
        <td><strong>${r.itemName}</strong></td>
        <td><span class="badge badge-${r.category==='Perishable'?'cyan':'blue'}">${r.category}</span></td>
        <td style="font-family:'JetBrains Mono',monospace">${r.qtyDamaged}</td>
        <td><span class="badge badge-red">${r.damageType}</span></td>
        <td>${r.reportedBy}</td>
        <td style="color:var(--text-muted);font-size:12px">${formatDate(r.date)}</td>
        <td>${statusBadge(r.status)}</td>
        <td>${actionBtns(r.ref, 'damage')}</td>
      </tr>`;
    });
    initDT('damagedTable');
  }

  function renderPerishableTable() {
    const items = InvenData.Items.getAll().filter(i => i.category === 'Perishable');
    const tbody = document.getElementById('perishableTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const expiring = items.filter(i => { const d=daysUntil(i.expiry); return d!==null && d<=7 && d>=0; });
    document.getElementById('expiringBadge').textContent = `${expiring.length} Expiring Soon`;
    items.forEach(item => {
      tbody.innerHTML += `<tr>
        <td><span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--accent-cyan)">${item.id}</span></td>
        <td><strong>${item.name}</strong></td>
        <td>${stockBar(item.qty, item.minLevel)}</td>
        <td style="color:var(--text-secondary)">${item.unit}</td>
        <td style="font-family:'JetBrains Mono',monospace;font-size:12px">${formatDate(item.expiry)}</td>
        <td>${expiryBadge(item.expiry)}</td>
        <td>${statusBadge(item.status)}</td>
        <td>${actionBtns(item.id, 'item')}</td>
      </tr>`;
    });
    initDT('perishableTable');
  }

  function renderNonPerishableTable() {
    const items = InvenData.Items.getAll().filter(i => i.category === 'Non-Perishable');
    const tbody = document.getElementById('nonperishableTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    items.forEach(item => {
      tbody.innerHTML += `<tr>
        <td><span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--navy-300)">${item.id}</span></td>
        <td><strong>${item.name}</strong></td>
        <td>${stockBar(item.qty, item.minLevel)}</td>
        <td style="color:var(--text-secondary)">${item.unit}</td>
        <td style="color:var(--text-muted)">Indefinite</td>
        <td>${item.supplier || '—'}</td>
        <td>${statusBadge(item.status)}</td>
        <td>${actionBtns(item.id, 'item')}</td>
      </tr>`;
    });
    initDT('nonperishableTable');
  }

  function renderStaffTable() {
    const records = InvenData.Staff.getAll();
    const tbody = document.getElementById('staffTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const stats = InvenData.getStats();
    countUp('checkedOutTotal', stats.staffCheckouts);
    countUp('pendingReturns',  stats.pendingReturns);
    countUp('activeStaff',     stats.uniqueStaff);
    records.forEach(r => {
      tbody.innerHTML += `<tr>
        <td><span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--accent-amber)">${r.ref}</span></td>
        <td><strong>${r.staffName}</strong></td>
        <td><span class="badge badge-blue">${r.dept}</span></td>
        <td>${r.itemName}</td>
        <td style="font-family:'JetBrains Mono',monospace">${r.qtyTaken}</td>
        <td style="color:var(--text-muted);font-size:12px">${formatDate(r.dateTaken)}</td>
        <td style="color:var(--text-muted);font-size:12px">${formatDate(r.returnDate)}</td>
        <td>${statusBadge(r.status)}</td>
        <td>${actionBtns(r.ref, 'staff')}</td>
      </tr>`;
    });
    initDT('staffTable');
  }

  function renderReports() {
    const stats = InvenData.getStats();
    const items = InvenData.Items.getAll();
    const damaged = InvenData.Damaged.getAll();
    const staff = InvenData.Staff.getAll();

    // Update timestamp
    document.getElementById('reportUpdateTime').textContent = new Date().toLocaleTimeString();

    // Update summary statistics
    const totalValue = items.reduce((sum, item) => sum + (item.qty * (Math.random() * 50 + 10)), 0);
    countUp('reportTotalValue', Math.round(totalValue / 1000));
    
    const damageLoss = damaged.reduce((sum, d) => sum + (d.qtyDamaged * (Math.random() * 30 + 5)), 0);
    document.getElementById('reportDamageLoss').textContent = '$' + Math.round(damageLoss).toLocaleString();
    
    document.getElementById('reportDamageCount').textContent = damaged.length;
    document.getElementById('reportTurnover').textContent = Math.round((staff.length / items.length) * 100) + '%';
    document.getElementById('reportValueTrend').textContent = '+' + Math.floor(Math.random() * 15 + 5) + '%';
    
    // Category Summary
    const perishable = items.filter(i => i.category === 'Perishable');
    const nonPerishable = items.filter(i => i.category === 'Non-Perishable');
    
    function getCategoryStats(category) {
      const cats = category === 'Perishable' ? perishable : nonPerishable;
      const total = cats.length;
      const inStock = cats.filter(i => i.status === 'In Stock').length;
      const lowStock = cats.filter(i => i.status === 'Low Stock').length;
      const dmg = damaged.filter(d => d.category === category).length;
      const avgValue = cats.length ? Math.round(totalValue / cats.length / 100) * 100 : 0;
      const health = ((inStock / (total || 1)) * 100).toFixed(0);
      return { total, inStock, lowStock, dmg, avgValue, health };
    }
    
    const tbody = document.getElementById('reportSummaryBody');
    if (tbody) {
      const perStats = getCategoryStats('Perishable');
      const nonPerStats = getCategoryStats('Non-Perishable');
      tbody.innerHTML = `
        <tr>
          <td><span class="badge badge-cyan">Perishable</span></td>
          <td style="font-weight:600">${perStats.total}</td>
          <td><span style="color:var(--accent-green)">${perStats.inStock}</span></td>
          <td><span style="color:var(--accent-amber)">${perStats.lowStock}</span></td>
          <td><span style="color:var(--accent-red)">${perStats.dmg}</span></td>
          <td style="font-family:'JetBrains Mono',monospace">$${perStats.avgValue}</td>
          <td><span class="badge badge-${perStats.health >= 70 ? 'green' : perStats.health >= 40 ? 'amber' : 'red'}">${perStats.health}% Healthy</span></td>
        </tr>
        <tr>
          <td><span class="badge badge-blue">Non-Perishable</span></td>
          <td style="font-weight:600">${nonPerStats.total}</td>
          <td><span style="color:var(--accent-green)">${nonPerStats.inStock}</span></td>
          <td><span style="color:var(--accent-amber)">${nonPerStats.lowStock}</span></td>
          <td><span style="color:var(--accent-red)">${nonPerStats.dmg}</span></td>
          <td style="font-family:'JetBrains Mono',monospace">$${nonPerStats.avgValue}</td>
          <td><span class="badge badge-${nonPerStats.health >= 70 ? 'green' : nonPerStats.health >= 40 ? 'amber' : 'red'}">${nonPerStats.health}% Healthy</span></td>
        </tr>
      `;
    }

    // Expiring soon
    const expiringList = document.getElementById('expiringList');
    if (expiringList) {
      const expiring = items.filter(i => {
        const d = daysUntil(i.expiry);
        return d !== null && d <= 7 && d >= 0;
      }).sort((a, b) => daysUntil(a.expiry) - daysUntil(b.expiry));
      
      if (expiring.length === 0) {
        expiringList.innerHTML = '<p style="color:var(--accent-green);font-size:13px;text-align:center;padding:20px;"><i class="fa-solid fa-check-circle"></i> No items expiring soon</p>';
      } else {
        expiringList.innerHTML = expiring.map(item => {
          const days = daysUntil(item.expiry);
          const badgeColor = days <= 1 ? 'red' : days <= 3 ? 'amber' : 'orange';
          return `<div class="alert-item ${badgeColor}" style="margin-bottom:8px;">
            <span class="alert-item-icon"><i class="fa-solid fa-clock"></i></span>
            <span class="alert-item-name">${item.name}</span>
            <span class="badge badge-${badgeColor === 'red' ? 'red' : 'amber'}">${days}d left</span>
          </div>`;
        }).join('');
      }
    }

    // Top damaged items
    const topDamagedList = document.getElementById('topDamagedList');
    if (topDamagedList) {
      const topDamaged = damaged.sort((a, b) => b.qtyDamaged - a.qtyDamaged).slice(0, 5);
      if (topDamaged.length === 0) {
        topDamagedList.innerHTML = '<p style="color:var(--accent-green);font-size:13px;text-align:center;padding:20px;"><i class="fa-solid fa-check-circle"></i> Great! No damaged items</p>';
      } else {
        topDamagedList.innerHTML = topDamaged.map((d, idx) => `<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-bottom:1px solid var(--border-color);font-size:12px;">
          <div style="display:flex;align-items:center;gap:8px;flex:1;">
            <span style="background:var(--navy-700);border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--accent-red)">${idx + 1}</span>
            <div>
              <div style="font-weight:600;color:var(--text-bright)">${d.itemName}</div>
              <div style="color:var(--text-muted);font-size:11px">${d.damageType}</div>
            </div>
          </div>
          <span style="background:rgba(239,68,68,0.15);color:var(--accent-red);padding:4px 8px;border-radius:4px;font-weight:600">${d.qtyDamaged}</span>
        </div>`).join('');
      }
    }

    // Initialize charts
    setTimeout(InvenCharts.initReports, 100);
  }

  // ---- Count-up animation ----
  function countUp(elId, target) {
    const el = document.getElementById(elId);
    if (!el) return;
    const start = parseInt(el.textContent) || 0;
    const step  = Math.ceil((target - start) / 20);
    if (start === target) { el.textContent = target; return; }
    let cur = start;
    const timer = setInterval(() => {
      cur += step;
      if ((step > 0 && cur >= target) || (step < 0 && cur <= target)) {
        clearInterval(timer);
        el.textContent = target;
      } else {
        el.textContent = cur;
      }
    }, 30);
  }

  // ---- Navigation ----
  function navigate(page) {
    // Update nav
    document.querySelectorAll('.nav-item').forEach(li => li.classList.remove('active'));
    const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (navItem) navItem.classList.add('active');

    // Update pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const pageEl = document.getElementById(`page-${page}`);
    if (pageEl) pageEl.classList.add('active');

    // Update topbar titles
    const titles = {
      dashboard:     'Dashboard',
      available:     'Available Stock',
      damaged:       'Damaged Items',
      perishable:    'Perishable Goods',
      nonperishable: 'Non-Perishable Goods',
      staffrecords:  'Staff Records',
      reports:       'Reports',
    };
    const t = titles[page] || page;
    document.getElementById('pageTitle').textContent = t;
    document.getElementById('bcActive').textContent  = t;

    // Render page
    const renderMap = {
      dashboard:     renderDashboard,
      available:     renderAvailableTable,
      damaged:       renderDamagedTable,
      perishable:    renderPerishableTable,
      nonperishable: renderNonPerishableTable,
      staffrecords:  renderStaffTable,
      reports:       renderReports,
    };
    if (renderMap[page]) renderMap[page]();
  }

  // ---- Modal helpers ----
  function showToast(msg, type = 'success') {
    const toast  = document.getElementById('appToast');
    const body   = document.getElementById('toastBody');
    body.innerHTML = msg;
    toast.className = `toast align-items-center text-white border-0 bg-${type}`;
    const bsToast = bootstrap.Toast.getOrCreateInstance(toast, { delay: 3500 });
    bsToast.show();
  }

  function getModal(id) { return bootstrap.Modal.getOrCreateInstance(document.getElementById(id)); }

  function hideModal(id) { getModal(id).hide(); }

  // ---- Populate item selects in modals ----
  function populateItemSelects() {
    const items = InvenData.Items.getAll();
    const opts  = items.map(i => `<option value="${i.name}">${i.name} (${i.qty} ${i.unit})</option>`).join('');
    const defOpt = '<option value="">Select Item</option>';
    document.getElementById('dmgItemName').innerHTML     = defOpt + opts;
    document.getElementById('staffItemSelect').innerHTML = defOpt + opts;
  }

  // ---- SAVE ITEM ----
  function saveItem() {
    const name     = document.getElementById('itemName').value.trim();
    const category = document.getElementById('itemCategory').value;
    const qty      = parseInt(document.getElementById('itemQty').value);
    const unit     = document.getElementById('itemUnit').value;
    const minLevel = parseInt(document.getElementById('itemMinLevel').value) || 10;
    const expiry   = document.getElementById('itemExpiry').value || null;
    const supplier = document.getElementById('itemSupplier').value.trim();
    const notes    = document.getElementById('itemNotes').value.trim();

    if (!name || !category || isNaN(qty)) {
      showToast('<i class="fa-solid fa-triangle-exclamation me-2"></i> Please fill all required fields.', 'danger');
      return;
    }
    InvenData.Items.add({ name, category, qty, unit, minLevel, expiry, supplier, notes });
    hideModal('addItemModal');
    document.getElementById('addItemModal').querySelectorAll('input,select,textarea').forEach(el => el.value = '');
    showToast(`<i class="fa-solid fa-circle-check me-2"></i> Item <strong>${name}</strong> added successfully!`, 'success');
    renderAvailableTable();
  }

  // ---- SAVE DAMAGE ----
  function saveDamage() {
    const itemName   = document.getElementById('dmgItemName').value;
    const qtyDamaged = parseInt(document.getElementById('dmgQty').value);
    const damageType = document.getElementById('dmgType').value;
    const reportedBy = document.getElementById('dmgReporter').value.trim();
    const date       = document.getElementById('dmgDate').value || new Date().toISOString().slice(0,10);
    const status     = document.getElementById('dmgStatus').value;
    const notes      = document.getElementById('dmgNotes').value.trim();

    if (!itemName || isNaN(qtyDamaged) || !damageType || !reportedBy) {
      showToast('<i class="fa-solid fa-triangle-exclamation me-2"></i> Please fill all required fields.', 'danger');
      return;
    }

    // Determine category from item
    const item = InvenData.Items.getAll().find(i => i.name === itemName);
    const category = item ? item.category : 'Unknown';

    InvenData.Damaged.add({ itemName, category, qtyDamaged, damageType, reportedBy, date, status, notes });
    hideModal('addDamagedModal');
    document.getElementById('addDamagedModal').querySelectorAll('input,select,textarea').forEach(el => el.value = '');
    showToast(`<i class="fa-solid fa-circle-check me-2"></i> Damage report for <strong>${itemName}</strong> filed!`, 'success');
    renderDamagedTable();
  }

  // ---- SAVE STAFF ----
  function saveStaff() {
    const staffName  = document.getElementById('staffName').value.trim();
    const dept       = document.getElementById('staffDept').value;
    const itemName   = document.getElementById('staffItemSelect').value;
    const qtyTaken   = parseInt(document.getElementById('staffQtyTaken').value);
    const dateTaken  = document.getElementById('staffDateTaken').value || new Date().toISOString().slice(0,10);
    const returnDate = document.getElementById('staffReturnDate').value || null;
    const notes      = document.getElementById('staffNotes').value.trim();

    if (!staffName || !dept || !itemName || isNaN(qtyTaken)) {
      showToast('<i class="fa-solid fa-triangle-exclamation me-2"></i> Please fill all required fields.', 'danger');
      return;
    }

    InvenData.Staff.add({ staffName, dept, itemName, qtyTaken, dateTaken, returnDate, status:'Pending Return', notes });
    // Deduct from stock
    const item = InvenData.Items.getAll().find(i => i.name === itemName);
    if (item) InvenData.Items.updateQty(item.id, Math.max(0, item.qty - qtyTaken));

    hideModal('addStaffCheckoutModal');
    document.getElementById('addStaffCheckoutModal').querySelectorAll('input,select,textarea').forEach(el => el.value = '');
    showToast(`<i class="fa-solid fa-circle-check me-2"></i> Checkout logged for <strong>${staffName}</strong>!`, 'success');
    renderStaffTable();
  }

  // ---- Public record actions ----
  function viewRecord(id, type) {
    let data, html = '';
    if (type === 'item') {
      data = InvenData.Items.getAll().find(i => i.id === id);
      if (!data) return;
      html = `<div class="detail-grid">
        <div class="detail-item"><div class="detail-label">Item ID</div><div class="detail-value" style="font-family:'JetBrains Mono',monospace;color:var(--accent-cyan)">${data.id}</div></div>
        <div class="detail-item"><div class="detail-label">Name</div><div class="detail-value">${data.name}</div></div>
        <div class="detail-item"><div class="detail-label">Category</div><div class="detail-value">${data.category}</div></div>
        <div class="detail-item"><div class="detail-label">Stock Qty</div><div class="detail-value" style="font-family:'JetBrains Mono',monospace">${data.qty} ${data.unit}</div></div>
        <div class="detail-item"><div class="detail-label">Min Level</div><div class="detail-value">${data.minLevel}</div></div>
        <div class="detail-item"><div class="detail-label">Status</div><div class="detail-value">${statusBadge(data.status)}</div></div>
        <div class="detail-item"><div class="detail-label">Expiry Date</div><div class="detail-value">${data.expiry ? formatDate(data.expiry) : 'N/A'}</div></div>
        <div class="detail-item"><div class="detail-label">Supplier</div><div class="detail-value">${data.supplier || '—'}</div></div>
        <div class="detail-item" style="grid-column:1/-1"><div class="detail-label">Notes</div><div class="detail-value">${data.notes || '—'}</div></div>
      </div>`;
    } else if (type === 'damage') {
      data = InvenData.Damaged.getAll().find(d => d.ref === id);
      if (!data) return;
      html = `<div class="detail-grid">
        <div class="detail-item"><div class="detail-label">Reference</div><div class="detail-value" style="font-family:'JetBrains Mono',monospace;color:var(--accent-red)">${data.ref}</div></div>
        <div class="detail-item"><div class="detail-label">Item Name</div><div class="detail-value">${data.itemName}</div></div>
        <div class="detail-item"><div class="detail-label">Category</div><div class="detail-value">${data.category}</div></div>
        <div class="detail-item"><div class="detail-label">Qty Damaged</div><div class="detail-value" style="font-family:'JetBrains Mono',monospace">${data.qtyDamaged}</div></div>
        <div class="detail-item"><div class="detail-label">Damage Type</div><div class="detail-value">${data.damageType}</div></div>
        <div class="detail-item"><div class="detail-label">Reported By</div><div class="detail-value">${data.reportedBy}</div></div>
        <div class="detail-item"><div class="detail-label">Date</div><div class="detail-value">${formatDate(data.date)}</div></div>
        <div class="detail-item"><div class="detail-label">Status</div><div class="detail-value">${statusBadge(data.status)}</div></div>
        <div class="detail-item" style="grid-column:1/-1"><div class="detail-label">Description</div><div class="detail-value">${data.notes || '—'}</div></div>
      </div>`;
    } else if (type === 'staff') {
      data = InvenData.Staff.getAll().find(s => s.ref === id);
      if (!data) return;
      html = `<div class="detail-grid">
        <div class="detail-item"><div class="detail-label">Reference</div><div class="detail-value" style="font-family:'JetBrains Mono',monospace;color:var(--accent-amber)">${data.ref}</div></div>
        <div class="detail-item"><div class="detail-label">Staff Name</div><div class="detail-value">${data.staffName}</div></div>
        <div class="detail-item"><div class="detail-label">Department</div><div class="detail-value">${data.dept}</div></div>
        <div class="detail-item"><div class="detail-label">Item</div><div class="detail-value">${data.itemName}</div></div>
        <div class="detail-item"><div class="detail-label">Qty Taken</div><div class="detail-value" style="font-family:'JetBrains Mono',monospace">${data.qtyTaken}</div></div>
        <div class="detail-item"><div class="detail-label">Status</div><div class="detail-value">${statusBadge(data.status)}</div></div>
        <div class="detail-item"><div class="detail-label">Date Taken</div><div class="detail-value">${formatDate(data.dateTaken)}</div></div>
        <div class="detail-item"><div class="detail-label">Return Date</div><div class="detail-value">${formatDate(data.returnDate)}</div></div>
        <div class="detail-item" style="grid-column:1/-1"><div class="detail-label">Notes</div><div class="detail-value">${data.notes || '—'}</div></div>
      </div>`;
    }
    document.getElementById('viewItemBody').innerHTML = html;
    getModal('viewItemModal').show();
  }

  function deleteRecord(id, type) {
    if (!confirm('Delete this record permanently?')) return;
    if (type === 'item')   InvenData.Items.remove(id);
    if (type === 'damage') InvenData.Damaged.remove(id);
    if (type === 'staff')  InvenData.Staff.remove(id);
    showToast('<i class="fa-solid fa-trash me-2"></i> Record deleted.', 'danger');
    // Refresh current page
    const active = document.querySelector('.nav-item.active');
    if (active) navigate(active.dataset.page);
  }

  function markReturned(ref) {
    InvenData.Staff.markReturned(ref);
    showToast('<i class="fa-solid fa-check-double me-2"></i> Item marked as returned.', 'success');
    renderStaffTable();
  }

  function writeOff(ref) {
    InvenData.Damaged.updateStatus(ref, 'Written Off');
    showToast('<i class="fa-solid fa-ban me-2"></i> Item written off.', 'success');
    renderDamagedTable();
  }

  // ---- Global Search ----
  function globalSearch(term) {
    if (!term.trim()) return;
    // Search available items and switch to page
    const found = InvenData.Items.getAll().filter(i =>
      i.name.toLowerCase().includes(term.toLowerCase()) ||
      i.id.toLowerCase().includes(term.toLowerCase())
    );
    if (found.length) {
      navigate('available');
      setTimeout(() => {
        if (tables['availableTable']) {
          tables['availableTable'].search(term).draw();
        }
      }, 300);
    }
  }

  // ---- Sidebar filter ----
  function filterAvailableTable() {
    const cat    = document.getElementById('filterCategory').value;
    const status = document.getElementById('filterStatus').value;
    let items  = InvenData.Items.getAll().filter(i => {
      return (!cat || i.category === cat) && (!status || i.status === status);
    });
    
    // Apply role-based filtering
    if (userRole === 'manager' && filterType === 'demand') {
      items = items.filter(i => i.category === 'Perishable');
    }
    
    const tbody = document.getElementById('availableTableBody');
    tbody.innerHTML = '';
    items.forEach(item => {
      tbody.innerHTML += `<tr>
        <td><span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--accent-cyan)">${item.id}</span></td>
        <td><strong>${item.name}</strong></td>
        <td><span class="badge badge-${item.category==='Perishable'?'cyan':'blue'}">${item.category}</span></td>
        <td>${stockBar(item.qty, item.minLevel)}</td>
        <td style="color:var(--text-secondary)">${item.unit}</td>
        <td style="font-family:'JetBrains Mono',monospace;color:var(--text-muted)">${item.minLevel}</td>
        <td>${statusBadge(item.status)}</td>
        <td style="color:var(--text-muted);font-size:12px">${formatDate(item.addedDate)}</td>
        <td>${actionBtns(item.id, 'item')}</td>
      </tr>`;
    });
    if (tables['availableTable']) { tables['availableTable'].destroy(); }
    initDT('availableTable');
  }

  // ---- Date display ----
  function setDate() {
    const el = document.getElementById('currentDate');
    if (el) el.textContent = new Date().toLocaleDateString('en-KE', { weekday:'short', year:'numeric', month:'short', day:'numeric' });
  }

  // ---- Theme Toggle ----
  function initTheme() {
    const savedTheme = localStorage.getItem('inventrack-theme') || 'dark';
    applyTheme(savedTheme);
  }

  function applyTheme(theme) {
    const body = document.body;
    const themeBtn = document.getElementById('themeBtn');
    const icon = themeBtn.querySelector('i');

    if (theme === 'light') {
      body.classList.add('light-mode');
      localStorage.setItem('inventrack-theme', 'light');
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      body.classList.remove('light-mode');
      localStorage.setItem('inventrack-theme', 'dark');
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  }

  function toggleTheme() {
    const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  // ---- Init ----
  function init() {
    setDate();
    initTheme();
    
    // Update role/filter in sidebar
    const roleDisplay = userRole.charAt(0).toUpperCase() + userRole.slice(1);
    const filterDisplay = filterType === 'demand' ? ' — Supply Demand' : '';
    const userRoleEl = document.querySelector('.user-role');
    if (userRoleEl) {
      userRoleEl.textContent = roleDisplay + filterDisplay;
    }

    // Sidebar toggle
    document.getElementById('sidebarToggle').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('collapsed');
      document.getElementById('mainWrapper').classList.toggle('collapsed');
    });

    // Theme toggle
    document.getElementById('themeBtn').addEventListener('click', toggleTheme);

    // Nav clicks
    document.querySelectorAll('.nav-item[data-page] a').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const page = link.closest('.nav-item').dataset.page;
        navigate(page);
      });
    });

    // Chart period buttons
    document.querySelectorAll('[data-chart-period]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-chart-period]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        InvenCharts.renderStockTrend(btn.dataset.chartPeriod);
      });
    });

    // Save buttons
    document.getElementById('saveItemBtn').addEventListener('click', saveItem);
    document.getElementById('saveDmgBtn').addEventListener('click', saveDamage);
    document.getElementById('saveStaffBtn').addEventListener('click', saveStaff);

    // Filter listeners
    document.getElementById('filterCategory').addEventListener('change', filterAvailableTable);
    document.getElementById('filterStatus').addEventListener('change', filterAvailableTable);

    // Global search
    document.getElementById('globalSearch').addEventListener('keydown', e => {
      if (e.key === 'Enter') globalSearch(e.target.value);
    });

    // Modal open — populate selects
    document.getElementById('addDamagedModal').addEventListener('show.bs.modal', populateItemSelects);
    document.getElementById('addStaffCheckoutModal').addEventListener('show.bs.modal', populateItemSelects);

    // Category selector shows/hides expiry field
    document.getElementById('itemCategory').addEventListener('change', e => {
      document.getElementById('expiryWrap').style.display = e.target.value === 'Perishable' ? '' : 'none';
    });
    document.getElementById('expiryWrap').style.display = 'none';

    // Check for URL parameters to load specific page
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    const roleParam = urlParams.get('role');
    const filterParam = urlParams.get('filter');
    
    // Set user role and filter if provided
    if (roleParam) userRole = roleParam;
    if (filterParam) filterType = filterParam;
    
    const defaultPage = pageParam && ['dashboard', 'available', 'damaged', 'perishable', 'nonperishable', 'staffrecords', 'reports'].includes(pageParam) ? pageParam : 'dashboard';
    
    // Load requested page or default to dashboard
    navigate(defaultPage);
  }

  // Expose public interface
  return { init, navigate, viewRecord, deleteRecord, markReturned, writeOff };

})();

// ---- Expose globally for inline onclick handlers ----
window.App = App;

document.addEventListener('DOMContentLoaded', App.init);
