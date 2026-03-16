<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Add User</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/css/app.css">
</head>
<body>
<main class="auth-shell stack">
    <section class="page-card">
        <p class="eyebrow">Admin</p>
        <h1>Add user</h1>
        <p class="muted">Minimal form wired to the existing admin servlet.</p>
    </section>

    <section class="form-card">
        <form method="post" action="users">
            <input type="hidden" name="action" value="add">
            <label>
                Full name
                <input type="text" name="fullName" required>
            </label>
            <label>
                Username
                <input type="text" name="username" required>
            </label>
            <label>
                Password
                <input type="password" name="password" required>
            </label>
            <label>
                Role
                <select name="role">
                    <option value="ADMIN">Admin</option>
                    <option value="DEPARTMENT_HEAD">Department Head</option>
                    <option value="COOK">Cook</option>
                </select>
            </label>
            <button type="submit">Create user</button>
        </form>
    </section>
</main>
</body>
</html>
