FOODflow cartering DEPT


## Overview
A full-featured inventory management web application with a dark blue industrial UI theme,
shake-on-hover card effects, and comprehensive inventory tracking features.

---

## File Structure
```
inventory-system/
├── index.html              ← Main SPA entry point (open this in browser)
├── css/
│   ├── style.css           ← Main dark-blue theme stylesheet
│   └── animations.css      ← Shake effects, keyframes, transitions
├── js/
│   ├── data.js             ← LocalStorage data store + CRUD helpers
│   ├── charts.js           ← Chart.js chart definitions
│   └── app.js              ← Main application logic, routing, tables
└── jsp/
    ├── inventoryApi.jsp    ← RESTful JSON API endpoint (Java/Tomcat)
    └── dashboard.jsp       ← Server-side rendered dashboard example
```

---

## Features
- **Dashboard** — Summary stats with count-up animation, low stock alerts, activity feed, trend charts
- **Available Stock** — Full item register with category/status filters, stock bar indicators
- **Damaged Items** — Broken/damaged item log, write-off workflow, damage type classification
- **Perishable Goods** — Expiry tracking, days-remaining badges, expiry warnings
- **Non-Perishable Goods** — Long-shelf-life inventory, supplier tracking
- **Staff Records** — Staff checkout log, return tracking, department filtering
- **Reports** — 4 Chart.js charts: damaged by type, staff trend, stock status donut, low-stock bar

---

## Technologies Used
| Technology | Purpose |
|---|---|
| HTML5 | Structure & semantics |
| CSS3 (custom) | Dark blue theme, animations, shake effects |
| JavaScript (ES6+) | App logic, routing, CRUD |
| Bootstrap 5.3 | Grid layout, modals, toasts, responsive |
| Chart.js 4.4 | All data visualizations |
| DataTables 1.13 | Sortable/searchable/paginated tables |
| Font Awesome 6.5 | Icons |
| Google Fonts | Exo 2 + JetBrains Mono |
| Java Server Pages (JSP) | Server-side rendering + REST API |
| LocalStorage | Client-side data persistence |

---

## Running the Frontend
1. Open `index.html` directly in any modern browser — no server needed
2. Data persists in browser LocalStorage between sessions
3. Click "Reset Data" in the console to restore sample data: `InvenData.resetAll()`

---

## Running the JSP Files (Java/Tomcat)
1. Deploy to Apache Tomcat 9+ or any Java EE container
2. Place files under `WEB-INF/` or as a web module
3. Configure JNDI datasource in `context.xml` for DB integration
4. Access API: `GET /inventoryApi.jsp?action=getStats`

---

## Shake Card Effect
Every card uses the `.shake-card` CSS class. On hover:
- X-axis displacement animation (`@keyframes shake`)
- Y-axis bounce for stat cards (`@keyframes shakeY`)
- Cyan glow pulse (`@keyframes shakeGlow`)

---

## Item Categories
- **Perishable** — Foods, dairy, beverages with expiry dates
- **Non-Perishable** — Dry goods, cleaning supplies, canned items

## Item Statuses
- 🟢 In Stock — qty > min level
- 🟡 Low Stock — qty ≤ min level
- 🔴 Out of Stock — qty = 0
