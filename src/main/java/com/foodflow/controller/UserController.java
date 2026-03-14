package com.foodflow.controller;

import com.foodflow.dao.UserDAO;
import com.foodflow.model.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.List;

@WebServlet("/admin/users")
public class UserController extends HttpServlet {

    private UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.sendRedirect("../login.jsp");
            return;
        }

        User currentUser = (User) session.getAttribute("user");

        // Only Admin can access
        if (currentUser.getRole() != User.Role.ADMIN) {
            response.sendRedirect("../access-denied.jsp");
            return;
        }

        String action = request.getParameter("action");
        if (action == null) action = "list";

        switch (action) {
            case "add":
                request.getRequestDispatcher("/admin/user-add.jsp").forward(request, response);
                break;
            case "edit":
                int editId = Integer.parseInt(request.getParameter("id"));
                User userToEdit = userDAO.getUserById(editId);
                request.setAttribute("user", userToEdit);
                request.getRequestDispatcher("/admin/user-edit.jsp").forward(request, response);
                break;
            case "delete":
                int deleteId = Integer.parseInt(request.getParameter("id"));
                userDAO.deleteUser(deleteId);
                response.sendRedirect("users");
                break;
            default: // list
                List<User> users = userDAO.getAllUsers();
                request.setAttribute("users", users);
                request.getRequestDispatcher("/admin/users.jsp").forward(request, response);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.sendRedirect("../login.jsp");
            return;
        }

        User currentUser = (User) session.getAttribute("user");

        if (currentUser.getRole() != User.Role.ADMIN) {
            response.sendRedirect("../access-denied.jsp");
            return;
        }

        String action = request.getParameter("action");

        if ("add".equals(action)) {
            String fullName = request.getParameter("fullName");
            String username = request.getParameter("username");
            String password = request.getParameter("password"); // hash before saving
            String roleStr = request.getParameter("role");

            User.Role role = User.Role.valueOf(roleStr.toUpperCase());

            User newUser = new User();
            newUser.setFullName(fullName);
            newUser.setUsername(username);
            newUser.setPassword(password); // hash later in DAO/Service
            newUser.setRole(role);

            userDAO.addUser(newUser);

            response.sendRedirect("users");
        } else if ("edit".equals(action)) {
            int id = Integer.parseInt(request.getParameter("id"));
            String fullName = request.getParameter("fullName");
            String username = request.getParameter("username");
            String roleStr = request.getParameter("role");

            User.Role role = User.Role.valueOf(roleStr.toUpperCase());

            User userToUpdate = userDAO.getUserById(id);
            userToUpdate.setFullName(fullName);
            userToUpdate.setUsername(username);
            userToUpdate.setRole(role);

            userDAO.updateUser(userToUpdate);

            response.sendRedirect("users");
        }
    }
}