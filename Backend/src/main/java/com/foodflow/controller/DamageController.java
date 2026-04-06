package com.foodflow.controller;

import com.foodflow.config.SecurityConfig;
import com.foodflow.dao.DamageDAO;
import com.foodflow.dao.ItemDAO;
import com.foodflow.model.User;
import com.foodflow.service.DamageService;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebServlet("/damage")
public class DamageController extends HttpServlet {

    private final DamageDAO damageDAO = new DamageDAO();
    private final ItemDAO itemDAO = new ItemDAO();
    private final DamageService damageService = new DamageService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.sendRedirect("login.jsp");
            return;
        }

        request.setAttribute("items", itemDAO.getAllItems());
        request.setAttribute("damageEntries", damageDAO.getAllDamage());
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
        if (!SecurityConfig.canRecordOperationalData(user)) {
            response.sendRedirect("access-denied.jsp");
            return;
        }

        String itemId = request.getParameter("itemId");
        String quantityStr = request.getParameter("quantity");
        String reason = request.getParameter("reason");

        try {
            int quantity = Integer.parseInt(quantityStr);
            damageService.recordDamage(Integer.parseInt(itemId), quantity, reason, user.getUserId());
            response.sendRedirect("damage");
        } catch (NumberFormatException e) {
            request.setAttribute("error", "Invalid quantity");
            request.setAttribute("items", itemDAO.getAllItems());
            request.setAttribute("damageEntries", damageDAO.getAllDamage());
            request.getRequestDispatcher("/damage/list.jsp").forward(request, response);
        }
    }
}
