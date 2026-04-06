package com.foodflow.controller;

import com.foodflow.dao.UserDAO;
import com.foodflow.model.User;
import com.foodflow.util.PasswordUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/auth")
public class AuthController extends HttpServlet {

    private UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String action = request.getParameter("action");

        // Handle logout
        if ("logout".equals(action)) {
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            response.sendRedirect("login.jsp");
            return;
        }

        // Default: show login page
        request.getRequestDispatcher("/login.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String username = request.getParameter("username");
        String password = request.getParameter("password");

        // Basic validation
        if (username == null || password == null ||
                username.trim().isEmpty() || password.trim().isEmpty()) {

            request.setAttribute("error", "Username and password required.");
            request.getRequestDispatcher("/login.jsp").forward(request, response);
            return;
        }

        // Fetch user
        User user = userDAO.getUserByUsername(username);

        // Validate user + password
        if (user != null && PasswordUtil.verifyPassword(password, user.getPassword())) {

            if (!user.isActive()) {
                request.setAttribute("error", "Account is deactivated.");
                request.getRequestDispatcher("/login.jsp").forward(request, response);
                return;
            }

            // Successful login
            HttpSession session = request.getSession();
            session.setAttribute("user", user);
            session.setAttribute("role", user.getRole());
            session.setMaxInactiveInterval(30 * 60); // 30 mins

            userDAO.resetLoginAttempts(user.getUserId());
            userDAO.updateLastLogin(user.getUserId());
            userDAO.logUserActivity(
                    user.getUserId(),
                    "LOGIN",
                    "auth",
                    "User logged in",
                    request.getRemoteAddr()
            );

            response.sendRedirect("dashboard");

        } else {
            // Failed login
            userDAO.incrementLoginAttempts(username);

            request.setAttribute("error", "Invalid username or password.");
            request.getRequestDispatcher("/login.jsp").forward(request, response);
        }
    }
}
