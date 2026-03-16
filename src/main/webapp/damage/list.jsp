<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Damage Log</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/css/app.css">
</head>
<body>
<main class="shell">
    <section class="page-card page-head">
        <div>
            <p class="eyebrow">Damage</p>
            <h1>Report damaged stock</h1>
            <p>Basic form and seeded examples for the <code>/damage</code> route.</p>
        </div>
        <div class="nav-links">
            <a class="button secondary" href="../dashboard">Dashboard</a>
            <a class="button secondary" href="../usage">Usage</a>
        </div>
    </section>

    <% if (request.getAttribute("error") != null) { %>
    <section class="notice error"><%= request.getAttribute("error") %></section>
    <% } %>

    <section class="content-grid">
        <article class="form-card">
            <h2>Damage form</h2>
            <form method="post" action="../damage">
                <label>
                    Item ID
                    <input type="number" name="itemId" placeholder="3" required>
                </label>
                <label>
                    Quantity damaged
                    <input type="number" name="quantity" step="1" min="1" placeholder="5" required>
                </label>
                <label>
                    Reason
                    <textarea name="reason" placeholder="Cracked during handling" required></textarea>
                </label>
                <button type="submit">Record damage</button>
            </form>
        </article>

        <article class="table-card">
            <h2>Seeded examples</h2>
            <table>
                <thead>
                <tr><th>Date</th><th>Item</th><th>Qty</th><th>Description</th></tr>
                </thead>
                <tbody>
                <tr><td>2026-03-01</td><td>Cups</td><td>5</td><td>Cracked during lunch service</td></tr>
                <tr><td>2026-03-02</td><td>Plates</td><td>3</td><td>Chipped during inventory check</td></tr>
                <tr><td>2026-03-03</td><td>Spoons</td><td>10</td><td>Bent in storage</td></tr>
                </tbody>
            </table>
        </article>
    </section>
</main>
</body>
</html>
