<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Access Denied</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/app.css">
</head>
<body>
<main class="auth-shell stack">
    <section class="page-card">
        <p class="eyebrow">FoodFlow</p>
        <h1>Access denied</h1>
        <p class="muted">Your current role does not have permission for that route.</p>
        <div class="actions">
            <a class="button primary" href="dashboard">Return to dashboard</a>
            <a class="button secondary" href="auth?action=logout">Log out</a>
        </div>
    </section>
</main>
</body>
</html>
