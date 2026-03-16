<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>FoodFlow Login</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/app.css">
</head>
<body>
<main class="auth-shell stack">
    <section class="page-card">
        <p class="eyebrow">FoodFlow</p>
        <h1>Sign in for backend testing</h1>
        <p class="muted">This is a lightweight login shell for the existing <code>/auth</code> servlet.</p>
    </section>

    <% if (request.getAttribute("error") != null) { %>
    <section class="notice error">
        <strong>Login failed.</strong>
        <div><%= request.getAttribute("error") %></div>
    </section>
    <% } %>

    <section class="form-card">
        <form method="post" action="auth">
            <label>
                Username
                <input type="text" name="username" placeholder="System Admin" required>
            </label>
            <label>
                Password
                <input type="password" name="password" placeholder="Enter seeded password" required>
            </label>
            <button type="submit">Sign in</button>
        </form>
    </section>

    <section class="page-card small">
        <strong>Seeded usernames</strong>
        <ul class="plain-list">
            <li><code>System Admin</code></li>
            <li><code>Department Head</code></li>
            <li><code>Head Cook</code></li>
            <li><code>Assistant Cook</code></li>
        </ul>
        <p class="muted">Passwords depend on the hash already stored in <code>database/sample_data.sql</code>.</p>
        <p><a href="index.html">Back to landing page</a></p>
    </section>
</main>
</body>
</html>
