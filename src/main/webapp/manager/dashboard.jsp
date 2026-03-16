<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.foodflow.model.User" %>
<%
    User currentUser = (User) session.getAttribute("user");
%>
<!DOCTYPE html>
<html>
<head>
    <title>Manager Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/css/app.css">
</head>
<body>
<main class="shell">
    <section class="page-card page-head">
        <div>
            <p class="eyebrow">Manager Dashboard</p>
            <h1>Department operations</h1>
            <p>Built for the seeded <code>DEPARTMENT_HEAD</code> role and any future <code>MANAGER</code> user.</p>
        </div>
        <div class="toolbar">
            <a class="button secondary" href="../auth?action=logout">Log out</a>
        </div>
    </section>

    <section class="metrics">
        <article class="metric-card">
            <p class="eyebrow">Current user</p>
            <h2><%= currentUser != null ? currentUser.getFullName() : "Manager session" %></h2>
            <p class="muted">Role: <%= currentUser != null ? currentUser.getRole() : "DEPARTMENT_HEAD" %></p>
        </article>
        <article class="metric-card">
            <p class="eyebrow">Pending request sample</p>
            <h2>1</h2>
            <p class="muted">Sample data includes one pending store request.</p>
        </article>
    </section>

    <section class="panel-grid">
        <article class="panel">
            <h2>Quick links</h2>
            <ul class="plain-list">
                <li><a href="../items">Inventory items</a></li>
                <li><a href="../supplies">Supply intake</a></li>
                <li><a href="../usage">Usage log</a></li>
                <li><a href="../damage">Damage log</a></li>
                <li><a href="../reports">Reports</a></li>
            </ul>
        </article>
        <article class="panel">
            <h2>Seeded cues</h2>
            <ul class="plain-list">
                <li>Weekly kitchen supplies request already approved.</li>
                <li>Urgent lunch-service request is still pending.</li>
                <li>Detergent is the sample low-stock item.</li>
            </ul>
        </article>
    </section>
</main>
</body>
</html>
