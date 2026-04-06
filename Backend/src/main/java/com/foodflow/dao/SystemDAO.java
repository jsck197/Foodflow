package com.foodflow.dao;

import com.foodflow.config.DatabaseConfig;
import com.foodflow.model.SystemLog;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class SystemDAO {

    public List<SystemLog> getRecentLogs() {
        String sql = "SELECT l.*, u.name AS user_name FROM system_logs l LEFT JOIN users u ON l.user_id = u.user_id ORDER BY l.timestamp DESC";
        List<SystemLog> logs = new ArrayList<>();
        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                SystemLog log = new SystemLog();
                log.setLogId(rs.getInt("log_id"));
                int userId = rs.getInt("user_id");
                log.setUserId(rs.wasNull() ? null : userId);
                log.setUserName(rs.getString("user_name"));
                log.setAction(rs.getString("action_performed"));
                Timestamp timestamp = rs.getTimestamp("timestamp");
                if (timestamp != null) {
                    log.setTimestamp(timestamp.toLocalDateTime());
                }
                logs.add(log);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return logs;
    }

    public boolean logMaintenanceAction(int userId, String action) {
        String sql = "INSERT INTO system_logs (user_id, action_performed, timestamp) VALUES (?, ?, CURRENT_TIMESTAMP)";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            stmt.setString(2, action);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
}
