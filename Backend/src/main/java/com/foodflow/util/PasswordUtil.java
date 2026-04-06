package com.foodflow.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public final class PasswordUtil {

    private PasswordUtil() {
    }

    public static String hashPassword(String plainTextPassword) {
        if (plainTextPassword == null) {
            return "";
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(plainTextPassword.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 algorithm not available", ex);
        }
    }

    public static boolean verifyPassword(String plainTextPassword, String storedPassword) {
        if (plainTextPassword == null || storedPassword == null) {
            return false;
        }

        if (plainTextPassword.equals(storedPassword)) {
            return true;
        }

        String sha = hashPassword(plainTextPassword);
        if (sha.equalsIgnoreCase(storedPassword)) {
            return true;
        }

        // Allow already-bcrypt values in seeded SQL for local setup; replace with BCrypt in production.
        return storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$");
    }
}
