package com.foodflow.controller;

import com.foodflow.config.SecurityConfig;
import com.foodflow.dao.ItemDAO;
import com.foodflow.model.Item;
import com.foodflow.model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebServlet("/items")
public class ItemController extends HttpServlet {

    private final ItemDAO itemDAO = new ItemDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.sendRedirect("login.jsp");
            return;
        }

        User user = (User) session.getAttribute("user");
        String query = request.getParameter("q");
        request.setAttribute("canManageInventory", SecurityConfig.canManageInventory(user));
        request.setAttribute("items", itemDAO.searchItems(query));
        request.setAttribute("query", query == null ? "" : query);
        request.getRequestDispatcher("/items/list.jsp").forward(request, response);
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
        String action = request.getParameter("action");

        if ("add".equals(action)) {
            if (!SecurityConfig.canManageInventory(user)) {
                response.sendRedirect("access-denied.jsp");
                return;
            }

            Item item = new Item();
            item.setName(request.getParameter("itemName"));
            item.setCategory(request.getParameter("category"));
            String itemType = request.getParameter("itemType");
            item.setItemType(itemType == null || itemType.isBlank() ? "FOOD" : itemType.toUpperCase());
            item.setUnitOfMeasure(request.getParameter("unitOfMeasure"));
            item.setDescription(request.getParameter("description"));
            item.setCurrentStock(parseDouble(request.getParameter("quantity")));
            itemDAO.addItem(item);
            response.sendRedirect("items");
            return;
        }

        if ("updateStatus".equals(action)) {
            if (!SecurityConfig.canManageInventory(user)) {
                response.sendRedirect("access-denied.jsp");
                return;
            }

            int itemId = Integer.parseInt(request.getParameter("itemId"));
            double stock = parseDouble(request.getParameter("stock"));
            String status = request.getParameter("status");
            itemDAO.updateItemStatus(itemId, stock, status);
            response.sendRedirect("items");
            return;
        }

        response.sendRedirect("items");
    }

    private double parseDouble(String value) {
        if (value == null || value.isBlank()) {
            return 0;
        }
        return Double.parseDouble(value);
    }
}
