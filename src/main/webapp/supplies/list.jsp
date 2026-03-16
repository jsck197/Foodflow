<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Supply Intake</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/css/app.css">
</head>
<body>
<main class="shell">
    <section class="page-card page-head">
        <div>
            <p class="eyebrow">Supplies</p>
            <h1>Record incoming stock</h1>
            <p>Minimal frontend for the <code>/supplies</code> servlet.</p>
        </div>
        <div class="nav-links">
            <a class="button secondary" href="../dashboard">Dashboard</a>
            <a class="button secondary" href="../items">Items</a>
        </div>
    </section>

    <% if (request.getAttribute("error") != null) { %>
    <section class="notice error"><%= request.getAttribute("error") %></section>
    <% } %>

    <section class="content-grid">
        <article class="form-card">
            <h2>Supply form</h2>
            <form method="post" action="../supplies">
                <label>
                    Item ID
                    <input type="number" name="itemId" placeholder="1" required>
                </label>
                <label>
                    Quantity
                    <input type="number" name="quantity" step="1" min="1" placeholder="50" required>
                </label>
                <button type="submit">Record supply</button>
            </form>
        </article>

        <article class="table-card">
            <h2>Seeded examples</h2>
            <table>
                <thead>
                <tr><th>Date</th><th>Item</th><th>Qty</th><th>Notes</th></tr>
                </thead>
                <tbody>
                <tr><td>2026-03-01</td><td>Sugar</td><td>50</td><td>Initial stock from supplier</td></tr>
                <tr><td>2026-03-02</td><td>Rice</td><td>50</td><td>Monthly rice supply</td></tr>
                <tr><td>2026-03-02</td><td>Cooking Oil</td><td>20</td><td>Cooking oil refill</td></tr>
                </tbody>
            </table>
        </article>
    </section>
</main>
</body>
</html>
