package com.foodflow.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

public class WebConfig {

    // Session timeout in minutes
    public static final int SESSION_TIMEOUT_MINUTES = 30;

    /**
     * Apply general servlet settings (call this in servlets or a Filter)
     */
    public static void configureRequest(HttpServletRequest request) {
        // Ensure request uses UTF-8 encoding
        request.setCharacterEncoding("UTF-8");
    }

    /**
     * Apply general servlet settings to response
     */
    public static void configureResponse(HttpServletResponse response) {
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
    }

    /**
     * CORS setup if needed later for frontend separation
     */
    public static void enableCORS(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*"); // Allow all for now
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    /**
     * Example Filter class for applying configs automatically
     */
    public static class AppFilter implements Filter {

        @Override
        public void init(FilterConfig filterConfig) {}

        @Override
        public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
                throws IOException, ServletException {

            HttpServletRequest request = (HttpServletRequest) servletRequest;
            HttpServletResponse response = (HttpServletResponse) servletResponse;

            configureRequest(request);
            configureResponse(response);
            // enableCORS(response); // Uncomment if needed for separate frontend

            // Set session timeout
            request.getSession().setMaxInactiveInterval(SESSION_TIMEOUT_MINUTES * 60);

            chain.doFilter(servletRequest, servletResponse);
        }

        @Override
        public void destroy() {}
    }
}