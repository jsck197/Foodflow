<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.foodflow.model.User" %>
<%
    User currentUser = (User) session.getAttribute("user");
%>
<!DOCTYPE html>
<html>
<head>
    <title>Clerk Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/css/app.css">
</head>
<body>
<main class="shell">
    <section class="page-card page-head">
        <div>
            <p class="eyebrow">Clerk Dashboard</p>
            <h1>Daily kitchen activity</h1>
            <p>Built for the current clerk flow and the seeded <code>COOK</code> role.</p>
        </div>
        <div class="toolbar">
            <a class="button secondary" href="../auth?action=logout">Log out</a>
        </div>
    </section>

    <section class="panel-grid">
        <article class="panel">
            <h2>Current user</h2>
            <p><strong><%= currentUser != null ? currentUser.getFullName() : "Kitchen staff" %></strong></p>
            <p class="muted">Role: <%= currentUser != null ? currentUser.getRole() : "COOK" %></p>
        </article>
        <article class="panel">
            <h2>Allowed actions</h2>
            <ul class="plain-list">
                <li><a href="../usage">Record stock usage</a></li>
                <li><a href="../damage">Report damage</a></li>
                <li><a href="../items">Check stock levels</a></li>
            </ul>
        </article>
    </section>
</main>
</body>
</html>
