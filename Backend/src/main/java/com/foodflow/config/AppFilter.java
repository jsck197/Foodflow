package com.foodflow.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebFilter("/*")
public class AppFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) {
        // No-op.
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        WebConfig.configureRequest(request);
        WebConfig.configureResponse(response);
        request.getSession().setMaxInactiveInterval(WebConfig.SESSION_TIMEOUT_MINUTES * 60);

        chain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {
        // No-op.
    }
}
