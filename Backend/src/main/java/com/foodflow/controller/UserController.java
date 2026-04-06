package com.foodflow.controller;

import com.foodflow.dao.UserDAO;
import com.foodflow.model.User;
import com.foodflow.service.UserService;
import com.foodflow.util.PasswordUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.List;

@WebServlet("/admin/users")
public class UserController extends HttpServlet {

    private final UserDAO userDAO = new UserDAO();
    private final UserService userService = new UserService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
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
        if (action == null) {
            action = "list";
        }

        switch (action) {
            case "add":
                request.getRequestDispatcher("/admin/user-add.jsp").forward(request, response);
                break;
            case "edit":
                int editId = Integer.parseInt(request.getParameter("id"));
                request.setAttribute("user", userDAO.getUserById(editId));
                request.getRequestDispatcher("/admin/user-edit.jsp").forward(request, response);
                break;
            case "delete":
                int deleteId = Integer.parseInt(request.getParameter("id"));
                userDAO.deleteUser(deleteId);
                response.sendRedirect("users");
                break;
            default:
                List<User> users = userDAO.getAllUsers();
                request.setAttribute("users", users);
                request.getRequestDispatcher("/admin/users.jsp").forward(request, response);
                break;
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
            User newUser = new User();
            newUser.setFullName(request.getParameter("fullName"));
            newUser.setUsername(request.getParameter("fullName"));
            newUser.setEmail(request.getParameter("email"));
            newUser.setPassword(request.getParameter("password"));
            newUser.setRole(User.Role.valueOf(request.getParameter("role").toUpperCase()));
            userService.addUser(newUser);
            response.sendRedirect("users");
            return;
        }

        if ("edit".equals(action)) {
            int id = Integer.parseInt(request.getParameter("id"));
            User userToUpdate = userDAO.getUserById(id);
            userToUpdate.setFullName(request.getParameter("fullName"));
            userToUpdate.setUsername(request.getParameter("fullName"));
            userToUpdate.setEmail(request.getParameter("email"));
            userToUpdate.setRole(User.Role.valueOf(request.getParameter("role").toUpperCase()));
            String password = request.getParameter("password");
            userToUpdate.setPassword(password == null || password.isBlank() ? "" : PasswordUtil.hashPassword(password));
            userDAO.updateUser(userToUpdate);
            response.sendRedirect("users");
            return;
        }

        response.sendRedirect("users");
    }
}
