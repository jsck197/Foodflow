package com.foodflow.controller;

import com.foodflow.dao.SupplyDAO;
import com.foodflow.model.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;

@WebServlet("/supplies")
public class SupplyController extends HttpServlet {

    private SupplyDAO supplyDAO = new SupplyDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.sendRedirect("login.jsp");
            return;
        }

        User user = (User) session.getAttribute("user");

        // For now: just forward to JSP page
        request.getRequestDispatcher("/supplies/list.jsp").forward(request, response);
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

        // Only Admin or Manager can add new supply
        if (!(user.getRole() == User.Role.ADMIN || user.getRole() == User.Role.MANAGER)) {
            response.sendRedirect("access-denied.jsp");
            return;
        }

        // Get form parameters
        String itemId = request.getParameter("itemId");
        String quantityStr = request.getParameter("quantity");

        try {
            int quantity = Integer.parseInt(quantityStr);

            // Call DAO to add supply
            supplyDAO.addSupply(itemId, quantity, user.getUserId());

            // Optional: log activity
            // supplyDAO.logActivity(user.getUserId(), itemId, quantity);

            response.sendRedirect("supplies"); // redirect back to list page
        } catch (NumberFormatException e) {
            request.setAttribute("error", "Invalid quantity");
            request.getRequestDispatcher("/supplies/list.jsp").forward(request, response);
        }
    }
}