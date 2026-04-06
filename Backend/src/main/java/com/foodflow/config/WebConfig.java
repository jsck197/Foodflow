package com.foodflow.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class WebConfig {

    // Session timeout in minutes
    public static final int SESSION_TIMEOUT_MINUTES = 30;

    /**
     * Apply general servlet settings (call this in servlets or a Filter)
     */
    public static void configureRequest(HttpServletRequest request) {
    try {
        request.setCharacterEncoding("UTF-8");
    } catch (java.io.UnsupportedEncodingException e) {
        throw new RuntimeException("UTF-8 encoding not supported", e);
    }
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

}
