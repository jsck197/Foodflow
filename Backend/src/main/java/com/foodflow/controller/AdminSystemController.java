package com.foodflow.controller;

import com.foodflow.dao.SystemDAO;
import com.foodflow.model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebServlet("/admin/system")
public class AdminSystemController extends HttpServlet {

    private final SystemDAO systemDAO = new SystemDAO();

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

        request.setAttribute("logs", systemDAO.getRecentLogs());
        request.getRequestDispatcher("/admin/system.jsp").forward(request, response);
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
        String message;
        if ("backup".equals(action)) {
            message = "Database backup triggered";
        } else if ("restore".equals(action)) {
            message = "Database restore triggered";
        } else {
            message = "System maintenance routine triggered";
        }
        systemDAO.logMaintenanceAction(currentUser.getUserId(), message);
        response.sendRedirect("system");
    }
}
