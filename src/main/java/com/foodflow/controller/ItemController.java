package com.catering.controller;

import com.catering.model.User;
import com.catering.config.SecurityConfig;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;

@WebServlet("/items")
public class ItemController extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);

        // 🔐 Check login
        if (session == null || session.getAttribute("user") == null) {
            response.sendRedirect("login.jsp");
            return;
        }

        User user = (User) session.getAttribute("user");

        // For now just forward to items page
        // Later this will fetch from ItemDAO
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

        // Example: Add item
        if ("add".equals(action)) {

            // 🔐 Only Admin or Manager can add
            if (!SecurityConfig.isAtLeastManager(user)) {
                response.sendRedirect("access-denied.jsp");
                return;
            }

            // For now just placeholder
            System.out.println("Item add requested");

            response.sendRedirect("items");
        }
    }
}
