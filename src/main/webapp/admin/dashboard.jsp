<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.foodflow.model.User" %>
<%
    User currentUser = (User) session.getAttribute("user");
%>
<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/css/app.css">
</head>
<body>
<main class="shell">
    <section class="page-card page-head">
        <div>
            <p class="eyebrow">Admin Dashboard</p>
            <h1>System overview</h1>
            <p>Use these quick links to exercise the backend routes and seeded workflows.</p>
        </div>
        <div class="toolbar">
            <a class="button secondary" href="../auth?action=logout">Log out</a>
        </div>
    </section>

    <section class="metrics">
        <article class="metric-card">
            <p class="eyebrow">Current user</p>
            <h2><%= currentUser != null ? currentUser.getFullName() : "Admin session" %></h2>
            <p class="muted">Role: <%= currentUser != null ? currentUser.getRole() : "ADMIN" %></p>
        </article>
        <article class="metric-card">
            <p class="eyebrow">Low stock snapshot</p>
            <h2>1 flagged item</h2>
            <p class="muted">Sample data marks detergent as low stock.</p>
        </article>
        <article class="metric-card">
            <p class="eyebrow">Last refreshed</p>
            <h2 data-now>Loading...</h2>
            <p class="muted">Client-side timestamp for quick smoke testing.</p>
        </article>
    </section>

    <section class="panel-grid">
        <article class="panel">
            <h2>Operations</h2>
            <ul class="plain-list">
                <li><a href="../items">Open inventory</a></li>
                <li><a href="../supplies">Record supply</a></li>
                <li><a href="../usage">Record usage</a></li>
                <li><a href="../damage">Record damage</a></li>
                <li><a href="../reports">View reports</a></li>
                <li><a href="users">Manage users</a></li>
            </ul>
        </article>
        <article class="panel">
            <h2>Backend test notes</h2>
            <ul class="plain-list">
                <li>Forms post to the existing servlet endpoints.</li>
                <li>Tables show seeded examples so pages stay useful while DAO wiring evolves.</li>
                <li>The dashboard route now recognizes seeded manager and cook role names.</li>
            </ul>
        </article>
    </section>
</main>
<script src="../assets/js/app.js"></script>
</body>
</html>
