package com.foodflow.controller;

import com.foodflow.dao.DamageDAO;
import com.foodflow.model.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;

@WebServlet("/damage")
public class DamageController extends HttpServlet {

    private DamageDAO damageDAO = new DamageDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.sendRedirect("login.jsp");
            return;
        }

        // For now: forward to JSP page
        request.getRequestDispatcher("/damage/list.jsp").forward(request, response);
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

        // Only Admin, Manager, or Clerk can log damage
        if (!(user.getRole() == User.Role.ADMIN || user.getRole() == User.Role.MANAGER || user.getRole() == User.Role.CLERK)) {
            response.sendRedirect("access-denied.jsp");
            return;
        }

        // Get form parameters
        String itemId = request.getParameter("itemId");
        String quantityStr = request.getParameter("quantity");
        String reason = request.getParameter("reason");

        try {
            int quantity = Integer.parseInt(quantityStr);

            // Call DAO to log damage
            damageDAO.recordDamage(itemId, quantity, reason, user.getUserId());

            response.sendRedirect("damage"); // back to list
        } catch (NumberFormatException e) {
            request.setAttribute("error", "Invalid quantity");
            request.getRequestDispatcher("/damage/list.jsp").forward(request, response);
        }
    }
}