package com.foodflow.controller;

import com.foodflow.config.SecurityConfig;
import com.foodflow.dao.ItemDAO;
import com.foodflow.dao.SupplyDAO;
import com.foodflow.model.User;
import com.foodflow.service.SupplyService;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebServlet("/supplies")
public class SupplyController extends HttpServlet {

    private final SupplyDAO supplyDAO = new SupplyDAO();
    private final ItemDAO itemDAO = new ItemDAO();
    private final SupplyService supplyService = new SupplyService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.sendRedirect("login.jsp");
            return;
        }

        request.setAttribute("items", itemDAO.getAllItems());
        request.setAttribute("supplies", supplyDAO.getAllSupplies());
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
        if (!SecurityConfig.canManageInventory(user)) {
            response.sendRedirect("access-denied.jsp");
            return;
        }

        String itemId = request.getParameter("itemId");
        String quantityStr = request.getParameter("quantity");

        try {
            int quantity = Integer.parseInt(quantityStr);
            supplyService.recordSupply(Integer.parseInt(itemId), quantity, user.getUserId());
            response.sendRedirect("supplies");
        } catch (NumberFormatException e) {
            request.setAttribute("error", "Invalid quantity");
            request.setAttribute("items", itemDAO.getAllItems());
            request.setAttribute("supplies", supplyDAO.getAllSupplies());
            request.getRequestDispatcher("/supplies/list.jsp").forward(request, response);
        }
    }
}
