<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.List" %>
<%@ page import="com.foodflow.model.Item" %>
<%@ page import="com.foodflow.model.Usage" %>
<%
    List<Item> items = (List<Item>) request.getAttribute("items");
    List<Usage> usageEntries = (List<Usage>) request.getAttribute("usageEntries");
%>
<!DOCTYPE html>
<html>
<head>
    <title>Issued Items</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/css/app.css">
</head>
<body>
<main class="shell">
    <section class="page-card page-head">
        <div>
            <p class="eyebrow">Issued Items</p>
            <h1>Record items used</h1>
            <p>Implements the Store Keeper flow for issuing stock and deducting it from inventory.</p>
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
            <h2>Issue stock</h2>
            <form method="post" action="../usage">
                <label>
                    Item
                    <select name="itemId" required>
                        <% if (items != null) { for (Item item : items) { %>
                        <option value="<%= item.getItemId() %>"><%= item.getName() %> (<%= item.getCurrentStock() %> <%= item.getUnitOfMeasure() %>)</option>
                        <% }} %>
                    </select>
                </label>
                <label>Quantity issued<input type="number" name="quantity" step="1" min="1" required></label>
                <label>Issued to<input type="text" name="issuedTo" placeholder="Department or person"></label>
                <button type="submit">Deduct from inventory</button>
            </form>
        </article>

        <article class="table-card">
            <h2>Issued records</h2>
            <table>
                <thead>
                <tr><th>Date</th><th>Item</th><th>Qty</th><th>Status</th><th>Recorded By</th></tr>
                </thead>
                <tbody>
                <% if (usageEntries != null && !usageEntries.isEmpty()) { %>
                    <% for (Usage usage : usageEntries) { %>
                    <tr>
                        <td><%= usage.getDate() %></td>
                        <td><%= usage.getItemName() %></td>
                        <td><%= usage.getQuantity() %></td>
                        <td><%= usage.getStatus() %></td>
                        <td><%= usage.getItemUserName() %></td>
                    </tr>
                    <% } %>
                <% } else { %>
                    <tr><td colspan="5">No issued items recorded yet.</td></tr>
                <% } %>
                </tbody>
            </table>
        </article>
    </section>
</main>
</body>
</html>
