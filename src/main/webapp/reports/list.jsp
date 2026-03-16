<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Reports</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/css/app.css">
</head>
<body>
<main class="shell">
    <section class="page-card page-head">
        <div>
            <p class="eyebrow">Reports</p>
            <h1>Operational reports</h1>
            <p>Fallback reporting page that stays useful while DAO queries continue to evolve.</p>
        </div>
        <div class="nav-links">
            <a class="button secondary" href="../dashboard">Dashboard</a>
            <a class="button secondary" href="../items">Items</a>
        </div>
    </section>

    <section class="metrics">
        <article class="metric-card">
            <p class="eyebrow">Low stock</p>
            <h2>Detergent</h2>
            <p class="muted">15 liters in stock in sample data.</p>
        </article>
        <article class="metric-card">
            <p class="eyebrow">Pending requests</p>
            <h2>1 active</h2>
            <p class="muted">Urgent lunch-service request is still pending.</p>
        </article>
        <article class="metric-card">
            <p class="eyebrow">Damage incidents</p>
            <h2>3 logged</h2>
            <p class="muted">Based on the seed script.</p>
        </article>
    </section>

    <section class="panel-grid">
        <article class="table-card">
            <h2>Low stock watchlist</h2>
            <table>
                <thead>
                <tr><th>Item</th><th>Category</th><th>Stock</th><th>Signal</th></tr>
                </thead>
                <tbody>
                <tr><td>Detergent</td><td>Cleaning supplies</td><td>15 liters</td><td class="status-low">Low stock</td></tr>
                </tbody>
            </table>
        </article>
        <article class="table-card">
            <h2>Pending request sample</h2>
            <table>
                <thead>
                <tr><th>Requester</th><th>Date</th><th>Status</th><th>Notes</th></tr>
                </thead>
                <tbody>
                <tr><td>Assistant Cook</td><td>2026-03-05</td><td class="status-low">Pending</td><td>Urgent requirement for lunch service</td></tr>
                </tbody>
            </table>
        </article>
    </section>
</main>
</body>
</html>
