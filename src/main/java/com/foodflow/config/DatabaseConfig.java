package com.foodflow.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConfig {

    // Database credentials
    private static final String DB_URL = "jdbc:mysql://localhost:3306/foodflow";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "your_password_here";

    // Load driver (optional for newer JDBC versions)
    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("MySQL JDBC Driver not found.");
            e.printStackTrace();
        }
    }

    /**
     * Get a database connection.
     * @return Connection object
     * @throws SQLException if connection fails
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
    }

    // Optional: Test connection
    public static void main(String[] args) {
        try (Connection conn = DatabaseConfig.getConnection()) {
            if (conn != null && !conn.isClosed()) {
                System.out.println("Connected to database successfully!");
            } else {
                System.out.println("Failed to connect to database.");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
