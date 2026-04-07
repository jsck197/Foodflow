package com.foodflow.config;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class DatabaseConfig {

    private static final String DB_URL;
    private static final String DB_USER;
    private static final String DB_PASSWORD;

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new IllegalStateException("MySQL JDBC Driver not found.", e);
        }

        Properties props = loadProperties();

        DB_URL = System.getenv().getOrDefault("FOODFLOW_DB_URL",
                props.getProperty("db.url", "jdbc:mysql://localhost:3306/foodflow?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"));
        DB_USER = System.getenv().getOrDefault("FOODFLOW_DB_USER",
                props.getProperty("db.user", "root"));
        DB_PASSWORD = System.getenv().getOrDefault("FOODFLOW_DB_PASSWORD",
                props.getProperty("db.password", ""));
    }

    private static Properties loadProperties() {
        Properties props = new Properties();
        try (InputStream input = DatabaseConfig.class.getClassLoader().getResourceAsStream("db.properties")) {
            if (input != null) {
                props.load(input);
            }
        } catch (IOException e) {
            throw new IllegalStateException("Unable to load database properties.", e);
        }
        return props;
    }

    public static Connection getConnection() {
        try {
            return DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
        } catch (SQLException firstFailure) {
            if (isUnknownDatabase(firstFailure)) {
                initializeDatabase();
                try {
                    return DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
                } catch (SQLException secondFailure) {
                    throw new IllegalStateException("Unable to create database connection after initialization.", secondFailure);
                }
            }
            throw new IllegalStateException("Unable to create database connection.", firstFailure);
        }
    }

    private static boolean isUnknownDatabase(SQLException e) {
        String msg = e.getMessage();
        return msg != null && msg.toLowerCase().contains("unknown database");
    }

    private static void initializeDatabase() {
        String databaseName = extractDatabaseName(DB_URL);
        String serverUrl = buildServerUrl(DB_URL);

        if (databaseName == null || serverUrl == null) {
            throw new IllegalStateException("Unable to parse database URL for initialization: " + DB_URL);
        }

        try (Connection conn = DriverManager.getConnection(serverUrl, DB_USER, DB_PASSWORD);
             Statement stmt = conn.createStatement()) {
            stmt.executeUpdate("CREATE DATABASE IF NOT EXISTS `" + databaseName + "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        } catch (SQLException e) {
            throw new IllegalStateException("Unable to create database '" + databaseName + "'.", e);
        }

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            executeSqlScript(conn, "database/schema.sql");
        } catch (SQLException e) {
            throw new IllegalStateException("Unable to initialize database schema.", e);
        }
    }

    private static String extractDatabaseName(String url) {
        Pattern pattern = Pattern.compile("^jdbc:mysql://[^/]+/([^?]+)(\\?.*)?$");
        Matcher matcher = pattern.matcher(url);
        return matcher.matches() ? matcher.group(1) : null;
    }

    private static String buildServerUrl(String url) {
        Pattern pattern = Pattern.compile("^(jdbc:mysql://[^/]+/)([^?]+)(\\?.*)?$");
        Matcher matcher = pattern.matcher(url);
        if (!matcher.matches()) {
            return null;
        }
        String base = matcher.group(1);
        String params = matcher.group(3);
        return base + (params != null ? params : "");
    }

    private static void executeSqlScript(Connection conn, String resourcePath) {
        try (InputStream input = DatabaseConfig.class.getClassLoader().getResourceAsStream(resourcePath)) {
            if (input == null) {
                throw new IllegalStateException("Database schema resource not found: " + resourcePath);
            }
            List<String> statements = parseSqlStatements(input);
            try (Statement stmt = conn.createStatement()) {
                for (String sql : statements) {
                    if (!sql.trim().isEmpty()) {
                        stmt.execute(sql);
                    }
                }
            }
        } catch (IOException | SQLException e) {
            throw new IllegalStateException("Failed to execute database schema script.", e);
        }
    }

    private static List<String> parseSqlStatements(InputStream input) throws IOException {
        List<String> statements = new ArrayList<>();
        String delimiter = ";";
        StringBuilder sql = new StringBuilder();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(input, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String trimmed = line.trim();
                if (trimmed.isEmpty() || trimmed.startsWith("--") || trimmed.startsWith("#")) {
                    continue;
                }
                if (trimmed.toUpperCase().startsWith("DELIMITER ")) {
                    delimiter = trimmed.substring("DELIMITER ".length());
                    continue;
                }
                sql.append(line).append("\n");
                if (trimmed.endsWith(delimiter)) {
                    int end = sql.length() - delimiter.length();
                    String statement = sql.substring(0, end).trim();
                    if (!statement.isEmpty()) {
                        statements.add(statement);
                    }
                    sql.setLength(0);
                }
            }
            if (sql.length() > 0) {
                String remaining = sql.toString().trim();
                if (!remaining.isEmpty()) {
                    statements.add(remaining);
                }
            }
        }
        return statements;
    }
}
