package com.foodflow.controller;

import com.foodflow.model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/dashboard")
public class DashboardController extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);

        // 🔐 1. Check if session exists
        if (session == null || session.getAttribute("user") == null) {
            response.sendRedirect("login.jsp");
            return;
        }

        // 👤 2. Get logged-in user
        User user = (User) session.getAttribute("user");

        // 🚦 3. Redirect based on role
        switch (user.getRole()) {

            case ADMIN:
                response.sendRedirect("admin/dashboard.jsp");
                break;

            case MANAGER:
            case DEPARTMENT_HEAD:
                response.sendRedirect("manager/dashboard.jsp");
                break;

            case CLERK:
            case COOK:
                response.sendRedirect("clerk/dashboard.jsp");
                break;

            default:
                response.sendRedirect("login.jsp");
                break;
        }
    }
}
