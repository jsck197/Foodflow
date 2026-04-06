/* ============================================================
   InvenTrack Pro — Data Store & Sample Data (data.js)
   ============================================================ */

'use strict';

const InvenData = (() => {

  // ---- Seed Data ----
  const defaultItems = [
    // Perishable
    { id:'ITM-001', name:'Fresh Milk', category:'Perishable', qty:120, unit:'Litres', minLevel:20, expiry:'2025-04-05', supplier:'FarmFresh Ltd', status:'In Stock', notes:'Store refrigerated', addedDate:'2025-03-20' },
    { id:'ITM-002', name:'Sliced Bread', category:'Perishable', qty:85, unit:'Pieces', minLevel:30, expiry:'2025-04-02', supplier:'BakeMaster', status:'In Stock', notes:'', addedDate:'2025-03-21' },
    { id:'ITM-003', name:'Eggs', category:'Perishable', qty:18, unit:'Pieces', minLevel:24, expiry:'2025-04-10', supplier:'PoultryPlus', status:'Low Stock', notes:'', addedDate:'2025-03-19' },
    { id:'ITM-004', name:'Butter', category:'Perishable', qty:0, unit:'Kg', minLevel:5, expiry:'2025-05-01', supplier:'DairyBest', status:'Out of Stock', notes:'', addedDate:'2025-03-18' },
    { id:'ITM-005', name:'Yogurt (Plain)', category:'Perishable', qty:60, unit:'Pieces', minLevel:15, expiry:'2025-04-08', supplier:'FarmFresh Ltd', status:'In Stock', notes:'', addedDate:'2025-03-22' },
    { id:'ITM-006', name:'Chicken Breast', category:'Perishable', qty:40, unit:'Kg', minLevel:10, expiry:'2025-04-03', supplier:'MeatHouse Co.', status:'In Stock', notes:'Keep frozen', addedDate:'2025-03-20' },
    { id:'ITM-007', name:'Orange Juice', category:'Perishable', qty:7, unit:'Litres', minLevel:10, expiry:'2025-04-15', supplier:'FreshPress', status:'Low Stock', notes:'', addedDate:'2025-03-17' },
    { id:'ITM-008', name:'Cheese Blocks', category:'Perishable', qty:25, unit:'Kg', minLevel:8, expiry:'2025-05-20', supplier:'DairyBest', status:'In Stock', notes:'', addedDate:'2025-03-21' },

    // Non-Perishable
    { id:'ITM-009', name:'Cooking Oil (5L)', category:'Non-Perishable', qty:200, unit:'Pieces', minLevel:30, expiry:null, supplier:'OilMasters', status:'In Stock', notes:'', addedDate:'2025-03-10' },
    { id:'ITM-010', name:'Sugar (2kg bag)', category:'Non-Perishable', qty:150, unit:'Bags', minLevel:40, expiry:null, supplier:'SweetSupply Co', status:'In Stock', notes:'', addedDate:'2025-03-10' },
    { id:'ITM-011', name:'Table Salt', category:'Non-Perishable', qty:90, unit:'Pieces', minLevel:20, expiry:null, supplier:'SaltWorks', status:'In Stock', notes:'', addedDate:'2025-03-09' },
    { id:'ITM-012', name:'Rice (25kg bag)', category:'Non-Perishable', qty:12, unit:'Bags', minLevel:15, expiry:null, supplier:'GrainCorp', status:'Low Stock', notes:'', addedDate:'2025-03-11' },
    { id:'ITM-013', name:'Flour (10kg)', category:'Non-Perishable', qty:55, unit:'Bags', minLevel:20, expiry:null, supplier:'MillBros', status:'In Stock', notes:'', addedDate:'2025-03-12' },
    { id:'ITM-014', name:'Canned Tomatoes', category:'Non-Perishable', qty:300, unit:'Pieces', minLevel:80, expiry:null, supplier:'CannedBest', status:'In Stock', notes:'', addedDate:'2025-03-08' },
    { id:'ITM-015', name:'Bleach Disinfectant', category:'Non-Perishable', qty:8, unit:'Bottles', minLevel:15, expiry:null, supplier:'CleanCo', status:'Low Stock', notes:'Hazardous—store locked', addedDate:'2025-03-13' },
    { id:'ITM-016', name:'Tissue Paper Rolls', category:'Non-Perishable', qty:500, unit:'Pieces', minLevel:100, expiry:null, supplier:'PaperSupply', status:'In Stock', notes:'', addedDate:'2025-03-15' },
    { id:'ITM-017', name:'Dishwashing Liquid', category:'Non-Perishable', qty:0, unit:'Bottles', minLevel:20, expiry:null, supplier:'CleanCo', status:'Out of Stock', notes:'', addedDate:'2025-03-16' },
    { id:'ITM-018', name:'Baking Powder', category:'Non-Perishable', qty:44, unit:'Pieces', minLevel:12, expiry:null, supplier:'BakeMaster', status:'In Stock', notes:'', addedDate:'2025-03-14' },
  ];

  const defaultDamaged = [
    { ref:'DMG-001', itemName:'Eggs', category:'Perishable', qtyDamaged:24, damageType:'Broken', reportedBy:'Jane Mwangi', date:'2025-03-28', status:'Under Review', notes:'Dropped during delivery unloading.' },
    { ref:'DMG-002', itemName:'Dishwashing Liquid', category:'Non-Perishable', qtyDamaged:10, damageType:'Water Damaged', reportedBy:'Peter Ochieng', date:'2025-03-25', status:'Written Off', notes:'Flooded storeroom section.' },
    { ref:'DMG-003', itemName:'Fresh Milk', category:'Perishable', qtyDamaged:15, damageType:'Expired', reportedBy:'Mary Akinyi', date:'2025-03-20', status:'Written Off', notes:'Found expired during stock check.' },
    { ref:'DMG-004', itemName:'Rice (25kg bag)', category:'Non-Perishable', qtyDamaged:3, damageType:'Contaminated', reportedBy:'Tom Owino', date:'2025-03-27', status:'Under Review', notes:'Suspected pest contamination.' },
    { ref:'DMG-005', itemName:'Canned Tomatoes', category:'Non-Perishable', qtyDamaged:12, damageType:'Broken', reportedBy:'Susan Wanjiku', date:'2025-03-29', status:'Under Review', notes:'Shelving collapse incident.' },
    { ref:'DMG-006', itemName:'Orange Juice', category:'Perishable', qtyDamaged:4, damageType:'Expired', reportedBy:'Admin User', date:'2025-03-30', status:'Written Off', notes:'Passed use-by date, not noticed.' },
  ];

  const defaultStaff = [
    { ref:'CHK-001', staffName:'James Otieno', dept:'Kitchen', itemName:'Cooking Oil (5L)', qtyTaken:5, dateTaken:'2025-03-28', returnDate:'2025-04-04', status:'Pending Return', notes:'Weekly kitchen allocation.' },
    { ref:'CHK-002', staffName:'Grace Chebet', dept:'Housekeeping', itemName:'Bleach Disinfectant', qtyTaken:3, dateTaken:'2025-03-27', returnDate:null, status:'Consumed', notes:'Cleaning common areas.' },
    { ref:'CHK-003', staffName:'David Kamau', dept:'Maintenance', itemName:'Tissue Paper Rolls', qtyTaken:20, dateTaken:'2025-03-26', returnDate:'2025-04-02', status:'Pending Return', notes:'Restroom restocking.' },
    { ref:'CHK-004', staffName:'Alice Njeri', dept:'Kitchen', itemName:'Sugar (2kg bag)', qtyTaken:10, dateTaken:'2025-03-25', returnDate:null, status:'Consumed', notes:'Baking preparation.' },
    { ref:'CHK-005', staffName:'Mark Oduya', dept:'Administration', itemName:'Baking Powder', qtyTaken:6, dateTaken:'2025-03-20', returnDate:'2025-03-27', status:'Returned', notes:'Event catering.' },
    { ref:'CHK-006', staffName:'Lilian Wambua', dept:'Kitchen', itemName:'Flour (10kg)', qtyTaken:4, dateTaken:'2025-03-29', returnDate:null, status:'Pending Return', notes:'Pastry section.' },
    { ref:'CHK-007', staffName:'Brian Mwangi', dept:'Security', itemName:'Tissue Paper Rolls', qtyTaken:5, dateTaken:'2025-03-30', returnDate:null, status:'Consumed', notes:'Guard post supplies.' },
  ];

  // ---- LocalStorage helpers ----
  const KEYS = { items:'it_items', damaged:'it_damaged', staff:'it_staff', activity:'it_activity' };

  function load(key, fallback) {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch(e) { return fallback; }
  }

  function save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // ---- Init ----
  function init() {
    if (!localStorage.getItem(KEYS.items))   save(KEYS.items,   defaultItems);
    if (!localStorage.getItem(KEYS.damaged)) save(KEYS.damaged, defaultDamaged);
    if (!localStorage.getItem(KEYS.staff))   save(KEYS.staff,   defaultStaff);
    if (!localStorage.getItem(KEYS.activity)) {
      save(KEYS.activity, [
        { type:'add',      text:'Added <strong>Fresh Milk (120L)</strong> to inventory', time:'2 hours ago' },
        { type:'damage',   text:'Damage reported: <strong>Eggs (×24)</strong> broken',  time:'5 hours ago' },
        { type:'checkout', text:'<strong>James Otieno</strong> checked out Cooking Oil', time:'Yesterday' },
        { type:'add',      text:'Added <strong>Bleach Disinfectant (×8)</strong>',       time:'2 days ago' },
        { type:'damage',   text:'<strong>Dishwashing Liquid</strong> written off',        time:'5 days ago' },
        { type:'checkout', text:'<strong>Grace Chebet</strong> checked out Bleach',       time:'4 days ago' },
      ]);
    }
  }

  // ---- CRUD ----
  const Items = {
    getAll() { return load(KEYS.items, defaultItems); },
    save(arr) { save(KEYS.items, arr); },
    add(item) {
      const arr = this.getAll();
      item.id = 'ITM-' + String(arr.length + 1).padStart(3, '0');
      item.addedDate = new Date().toISOString().slice(0,10);
      item.status = item.qty <= 0 ? 'Out of Stock' : item.qty <= Number(item.minLevel) ? 'Low Stock' : 'In Stock';
      arr.push(item);
      this.save(arr);
      logActivity('add', `Added <strong>${item.name}</strong> to inventory`);
      return item;
    },
    remove(id) {
      const arr = this.getAll().filter(i => i.id !== id);
      this.save(arr);
    },
    updateQty(id, newQty) {
      const arr = this.getAll();
      const item = arr.find(i => i.id === id);
      if(item) {
        item.qty = newQty;
        item.status = newQty <= 0 ? 'Out of Stock' : newQty <= Number(item.minLevel) ? 'Low Stock' : 'In Stock';
        this.save(arr);
      }
    }
  };

  const Damaged = {
    getAll() { return load(KEYS.damaged, defaultDamaged); },
    save(arr) { save(KEYS.damaged, arr); },
    add(record) {
      const arr = this.getAll();
      record.ref = 'DMG-' + String(arr.length + 1).padStart(3, '0');
      arr.push(record);
      this.save(arr);
      logActivity('damage', `Damage reported: <strong>${record.itemName} (×${record.qtyDamaged})</strong> – ${record.damageType}`);
      return record;
    },
    remove(ref) {
      const arr = this.getAll().filter(d => d.ref !== ref);
      this.save(arr);
    },
    updateStatus(ref, status) {
      const arr = this.getAll();
      const rec = arr.find(d => d.ref === ref);
      if(rec) { rec.status = status; this.save(arr); }
    }
  };

  const Staff = {
    getAll() { return load(KEYS.staff, defaultStaff); },
    save(arr) { save(KEYS.staff, arr); },
    add(record) {
      const arr = this.getAll();
      record.ref = 'CHK-' + String(arr.length + 1).padStart(3, '0');
      arr.push(record);
      this.save(arr);
      logActivity('checkout', `<strong>${record.staffName}</strong> checked out ${record.itemName} (×${record.qtyTaken})`);
      return record;
    },
    remove(ref) {
      const arr = this.getAll().filter(s => s.ref !== ref);
      this.save(arr);
    },
    markReturned(ref) {
      const arr = this.getAll();
      const rec = arr.find(s => s.ref === ref);
      if(rec) { rec.status = 'Returned'; this.save(arr); }
    }
  };

  function logActivity(type, text) {
    const arr = load(KEYS.activity, []);
    arr.unshift({ type, text, time: 'Just now' });
    if(arr.length > 20) arr.pop();
    save(KEYS.activity, arr);
  }

  function getActivity() { return load(KEYS.activity, []); }

  // ---- Stats Helpers ----
  function getStats() {
    const items   = Items.getAll();
    const damaged = Damaged.getAll();
    const staff   = Staff.getAll();
    return {
      totalItems:      items.length,
      inStock:         items.filter(i => i.status === 'In Stock').length,
      outOfStock:      items.filter(i => i.status === 'Out of Stock').length,
      lowStock:        items.filter(i => i.status === 'Low Stock').length,
      damagedTotal:    damaged.length,
      underReview:     damaged.filter(d => d.status === 'Under Review').length,
      writtenOff:      damaged.filter(d => d.status === 'Written Off').length,
      staffCheckouts:  staff.length,
      pendingReturns:  staff.filter(s => s.status === 'Pending Return').length,
      uniqueStaff:     [...new Set(staff.map(s => s.staffName))].length,
      perishableCount: items.filter(i => i.category === 'Perishable').length,
      nonPerishCount:  items.filter(i => i.category === 'Non-Perishable').length,
      lowStockItems:   items.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock'),
    };
  }

  function resetAll() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    init();
  }

  init();
  return { Items, Damaged, Staff, getStats, getActivity, logActivity, resetAll };

})();
