<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Usage Log</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/css/app.css">
</head>
<body>
<main class="shell">
    <section class="page-card page-head">
        <div>
            <p class="eyebrow">Usage</p>
            <h1>Record stock consumption</h1>
            <p>Simple POST form for the current <code>/usage</code> endpoint.</p>
        </div>
        <div class="nav-links">
            <a class="button secondary" href="../dashboard">Dashboard</a>
            <a class="button secondary" href="../damage">Damage</a>
        </div>
    </section>

    <% if (request.getAttribute("error") != null) { %>
    <section class="notice error"><%= request.getAttribute("error") %></section>
    <% } %>

    <section class="content-grid">
        <article class="form-card">
            <h2>Usage form</h2>
            <form method="post" action="../usage">
                <label>
                    Item ID
                    <input type="number" name="itemId" placeholder="5" required>
                </label>
                <label>
                    Quantity used
                    <input type="number" name="quantity" step="1" min="1" placeholder="15" required>
                </label>
                <button type="submit">Record usage</button>
            </form>
        </article>

        <article class="table-card">
            <h2>Seeded examples</h2>
            <table>
                <thead>
                <tr><th>Date</th><th>Item</th><th>Qty</th><th>Context</th></tr>
                </thead>
                <tbody>
                <tr><td>2026-03-01</td><td>Sugar</td><td>10</td><td>Lunch preparation</td></tr>
                <tr><td>2026-03-01</td><td>Kales</td><td>5</td><td>Cooking</td></tr>
                <tr><td>2026-03-02</td><td>Rice</td><td>15</td><td>Lunch service</td></tr>
                </tbody>
            </table>
        </article>
    </section>
</main>
</body>
</html>
