package com.foodflow.controller;

import com.foodflow.config.SecurityConfig;
import com.foodflow.dao.ItemDAO;
import com.foodflow.dao.StoreRequestDAO;
import com.foodflow.model.StoreRequest;
import com.foodflow.model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebServlet("/requests")
public class RequestController extends HttpServlet {

    private final StoreRequestDAO requestDAO = new StoreRequestDAO();
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
        request.setAttribute("items", itemDAO.getAllItems());
        request.setAttribute("canApproveRequests", SecurityConfig.canApproveRequests(user));
        request.setAttribute("canCreateRequests", SecurityConfig.canCreateRequests(user));
        if (SecurityConfig.canApproveRequests(user)) {
            request.setAttribute("requests", requestDAO.getAllRequests());
        } else {
            request.setAttribute("requests", requestDAO.getRequestsForRequester(user.getUserId()));
        }
        request.getRequestDispatcher("/requests/list.jsp").forward(request, response);
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

        if ("create".equals(action)) {
            if (!SecurityConfig.canCreateRequests(user)) {
                response.sendRedirect("access-denied.jsp");
                return;
            }

            StoreRequest storeRequest = new StoreRequest();
            storeRequest.setRequesterId(user.getUserId());
            storeRequest.setItemId(Integer.parseInt(request.getParameter("itemId")));
            storeRequest.setQuantityRequested(Double.parseDouble(request.getParameter("quantity")));
            storeRequest.setNotes(request.getParameter("notes"));
            requestDAO.createRequest(storeRequest);
            response.sendRedirect("requests");
            return;
        }

        if ("approve".equals(action) || "reject".equals(action)) {
            if (!SecurityConfig.canApproveRequests(user)) {
                response.sendRedirect("access-denied.jsp");
                return;
            }

            int requestId = Integer.parseInt(request.getParameter("requestId"));
            requestDAO.updateRequestStatus(requestId, user.getUserId(), "approve".equals(action) ? "APPROVED" : "REJECTED");
            response.sendRedirect("requests");
            return;
        }

        response.sendRedirect("requests");
    }
}
