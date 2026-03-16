<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Inventory Items</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/css/app.css">
</head>
<body>
<main class="shell">
    <section class="page-card page-head">
        <div>
            <p class="eyebrow">Inventory</p>
            <h1>Items list</h1>
            <p>Placeholder inventory view for the <code>/items</code> route.</p>
        </div>
        <div class="nav-links">
            <a class="button secondary" href="../dashboard">Dashboard</a>
            <a class="button secondary" href="../reports">Reports</a>
        </div>
    </section>

    <section class="content-grid">
        <article class="table-card">
            <h2>Seeded inventory snapshot</h2>
            <table>
                <thead>
                <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Reorder</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                <tr><td>Sugar</td><td>Non-perishable</td><td>100 kg</td><td>20 kg</td><td class="status-ok">Available</td></tr>
                <tr><td>Kales</td><td>Perishable</td><td>50 kg</td><td>5 kg</td><td class="status-ok">Available</td></tr>
                <tr><td>Rice</td><td>Non-perishable</td><td>80 kg</td><td>25 kg</td><td class="status-ok">Available</td></tr>
                <tr><td>Detergent</td><td>Cleaning supplies</td><td>15 liters</td><td>5 liters</td><td class="status-low">Low stock</td></tr>
                <tr><td>Spoons</td><td>Utensils</td><td>250 pcs</td><td>100 pcs</td><td class="status-ok">Available</td></tr>
                </tbody>
            </table>
        </article>

        <article class="form-card">
            <h2>Add item placeholder</h2>
            <% if (request.getAttribute("error") != null) { %>
            <section class="notice error"><%= request.getAttribute("error") %></section>
            <% } %>
            <form method="post" action="../items">
                <input type="hidden" name="action" value="add">
                <label>
                    Item name
                    <input type="text" name="itemName" placeholder="Beans">
                </label>
                <label>
                    Category
                    <select name="categoryId">
                        <option value="1">Perishable</option>
                        <option value="2">Non-perishable</option>
                        <option value="3">Utensils</option>
                        <option value="4">Cleaning supplies</option>
                    </select>
                </label>
                <label>
                    Opening stock
                    <input type="number" step="0.01" name="quantity" placeholder="25">
                </label>
                <button type="submit">Submit placeholder add</button>
            </form>
            <p class="muted small">The current servlet only checks permissions and redirects. This form is here so the route can be exercised from the browser.</p>
        </article>
    </section>
</main>
</body>
</html>
