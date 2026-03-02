package com.catering.controller;

import com.catering.dao.UsageDAO;
import com.catering.model.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;

@WebServlet("/usage")
public class UsageController extends HttpServlet {

    private UsageDAO usageDAO = new UsageDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.sendRedirect("login.jsp");
            return;
        }

        // For now: just forward to JSP page
        request.getRequestDispatcher("/usage/list.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.sendRedirect("login.jsp");
            return;
        }

        User user = (User) session.getAttribute("user");

        // Only Admin, Manager, or Clerk can record usage
        if (!(user.getRole() == User.Role.ADMIN || user.getRole() == User.Role.MANAGER || user.getRole() == User.Role.CLERK)) {
            response.sendRedirect("access-denied.jsp");
            return;
        }

        // Get form parameters
        String itemId = request.getParameter("itemId");
        String quantityStr = request.getParameter("quantity");

        try {
            int quantity = Integer.parseInt(quantityStr);

            // Call DAO to record usage
            usageDAO.recordUsage(itemId, quantity, user.getUserId());

            // Optional: log activity
            // usageDAO.logActivity(user.getUserId(), itemId, quantity);

            response.sendRedirect("usage"); // redirect back to list page
        } catch (NumberFormatException e) {
            request.setAttribute("error", "Invalid quantity");
            request.getRequestDispatcher("/usage/list.jsp").forward(request, response);
        }
    }
}