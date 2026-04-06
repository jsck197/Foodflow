package com.foodflow.controller;

import com.foodflow.config.SecurityConfig;
import com.foodflow.dao.ReportDAO;
import com.foodflow.model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebServlet("/reports")
public class ReportController extends HttpServlet {

    private final ReportDAO reportDAO = new ReportDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.sendRedirect("login.jsp");
            return;
        }

        User user = (User) session.getAttribute("user");
        if (!SecurityConfig.canViewReports(user)) {
            response.sendRedirect("access-denied.jsp");
            return;
        }

        request.setAttribute("usageReport", reportDAO.getUsageReport());
        request.setAttribute("damageReport", reportDAO.getDamageReport());
        request.setAttribute("lowStockItems", reportDAO.getLowStockItems(10));
        request.setAttribute("pendingRequests", reportDAO.getPendingRequests());
        request.getRequestDispatcher("/reports/list.jsp").forward(request, response);
    }
}
