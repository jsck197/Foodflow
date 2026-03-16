<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.List" %>
<%@ page import="com.foodflow.model.User" %>
<%
    List<User> users = (List<User>) request.getAttribute("users");
%>
<!DOCTYPE html>
<html>
<head>
    <title>User Management</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/css/app.css">
</head>
<body>
<main class="shell">
    <section class="page-card page-head">
        <div>
            <p class="eyebrow">Admin</p>
            <h1>User management</h1>
            <p>List view for the <code>/admin/users</code> route.</p>
        </div>
        <div class="nav-links">
            <a class="button primary" href="users?action=add">Add user</a>
            <a class="button secondary" href="dashboard.jsp">Dashboard</a>
        </div>
    </section>

    <section class="table-card">
        <h2>Users</h2>
        <table>
            <thead>
            <tr><th>ID</th><th>Name</th><th>Role</th><th>Email</th><th>Actions</th></tr>
            </thead>
            <tbody>
            <% if (users != null && !users.isEmpty()) { %>
                <% for (User user : users) { %>
                <tr>
                    <td><%= user.getUserId() %></td>
                    <td><%= user.getFullName() %></td>
                    <td><%= user.getRole() %></td>
                    <td><%= user.getEmail() %></td>
                    <td>
                        <a href="users?action=edit&id=<%= user.getUserId() %>">Edit</a>
                        <span class="muted">|</span>
                        <a class="danger" href="users?action=delete&id=<%= user.getUserId() %>">Delete</a>
                    </td>
                </tr>
                <% } %>
            <% } else { %>
                <tr><td>1</td><td>System Admin</td><td>ADMIN</td><td>admin@foodflow.com</td><td>Seeded example</td></tr>
                <tr><td>2</td><td>Department Head</td><td>DEPARTMENT_HEAD</td><td>head@foodflow.com</td><td>Seeded example</td></tr>
                <tr><td>3</td><td>Head Cook</td><td>COOK</td><td>cook1@foodflow.com</td><td>Seeded example</td></tr>
            <% } %>
            </tbody>
        </table>
    </section>
</main>
</body>
</html>
