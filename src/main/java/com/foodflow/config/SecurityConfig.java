package com.foodflow.config;

import com.catering.model.User;

public class SecurityConfig {

    /**
     * Check if a user is an Admin
     */
    public static boolean isAdmin(User user) {
        return user != null && user.getRole() == User.Role.ADMIN;
    }

    /**
     * Check if a user is a Manager
     */
    public static boolean isManager(User user) {
        return user != null && user.getRole() == User.Role.MANAGER;
    }

    /**
     * Check if a user is a Store Clerk
     */
    public static boolean isClerk(User user) {
        return user != null && user.getRole() == User.Role.CLERK;
    }

    /**
     * Check if a user has at least Manager-level access (Admin or Manager)
     */
    public static boolean isAtLeastManager(User user) {
        return isAdmin(user) || isManager(user);
    }

    /**
     * General permission check
     * Example usage:
     * SecurityConfig.hasPermission(user, "VIEW_REPORTS")
     */
    public static boolean hasPermission(User user, String permission) {
        if (user == null) return false;

        switch (permission) {
            case "MANAGE_USERS":
                return isAdmin(user);
            case "VIEW_REPORTS":
                return isAdmin(user) || isManager(user);
            case "ADD_ITEMS":
                return isAdmin(user) || isManager(user);
            case "RECORD_TRANSACTIONS":
                return true; // everyone can record supplies/usage/damage
            default:
                return false;
        }
    }
}
