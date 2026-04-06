package com.foodflow.controller;

import com.foodflow.dao.StoreRequestDAO;
import com.foodflow.model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebServlet("/dashboard")
public class DashboardController extends HttpServlet {
    private final StoreRequestDAO storeRequestDAO = new StoreRequestDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.sendRedirect("login.jsp");
            return;
        }

        request.setAttribute("pendingRequestCount", storeRequestDAO.countPendingRequests());
        User user = (User) session.getAttribute("user");
        switch (user.getRole()) {
            case ADMIN:
                response.sendRedirect("admin/dashboard.jsp");
                break;
            case DEPARTMENT_HEAD:
                response.sendRedirect("department-head/dashboard.jsp");
                break;
            case STOREKEEPER:
                response.sendRedirect("storekeeper/dashboard.jsp");
                break;
            default:
                response.sendRedirect("login.jsp");
                break;
        }
    }
}
