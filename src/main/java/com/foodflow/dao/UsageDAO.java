package com.foodflow.dao;

import com.foodflow.config.DatabaseConfig;
import com.foodflow.model.Usage;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class UsageDAO {

    private Connection conn;

    public UsageDAO() {
        conn = DatabaseConfig.getConnection();
    }

    // -------------------------------
    // ADD NEW USAGE
    // -------------------------------
    public boolean addUsage(Usage usage) {
        String sql = "INSERT INTO usage (item_id, quantity, item_user_name, date, status) VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, usage.getItemId());
            stmt.setDouble(2, usage.getQuantity());
            stmt.setString(3, usage.getItemUserName());
            stmt.setDate(4, Date.valueOf(usage.getDate()));
            stmt.setString(5, usage.getStatus().name()); // Enum TA/RETURNED
            int rows = stmt.executeUpdate();
            return rows > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // -------------------------------
    // GET USAGE BY ID
    // -------------------------------
    public Usage getUsageById(int usageId) {
        String sql = "SELECT * FROM usage WHERE usage_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, usageId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return mapResultSetToUsage(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    // -------------------------------
    // LIST ALL USAGE
    // -------------------------------
    public List<Usage> getAllUsage() {
        List<Usage> usageList = new ArrayList<>();
        String sql = "SELECT * FROM usage ORDER BY date DESC";
        try (Statement stmt = conn.createStatement()) {
            ResultSet rs = stmt.executeQuery(sql);
            while (rs.next()) {
                usageList.add(mapResultSetToUsage(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return usageList;
    }

    // -------------------------------
    // LIST USAGE BY ITEM
    // -------------------------------
    public List<Usage> getUsageByItem(int itemId) {
        List<Usage> usageList = new ArrayList<>();
        String sql = "SELECT * FROM usage WHERE item_id = ? ORDER BY date DESC";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, itemId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                usageList.add(mapResultSetToUsage(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return usageList;
    }

    // -------------------------------
    // UPDATE USAGE
    // -------------------------------
    public boolean updateUsage(Usage usage) {
        String sql = "UPDATE usage SET item_id = ?, quantity = ?, item_user_name = ?, date = ?, status = ? WHERE usage_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, usage.getItemId());
            stmt.setDouble(2, usage.getQuantity());
            stmt.setString(3, usage.getItemUserName());
            stmt.setDate(4, Date.valueOf(usage.getDate()));
            stmt.setString(5, usage.getStatus().name());
            stmt.setInt(6, usage.getUsageId());
            int rows = stmt.executeUpdate();
            return rows > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // -------------------------------
    // DELETE USAGE
    // -------------------------------
    public boolean deleteUsage(int usageId) {
        String sql = "DELETE FROM usage WHERE usage_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, usageId);
            int rows = stmt.executeUpdate();
            return rows > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // -------------------------------
    // HELPER: MAP RESULTSET TO USAGE OBJECT
    // -------------------------------
    private Usage mapResultSetToUsage(ResultSet rs) throws SQLException {
        Usage usage = new Usage();
        usage.setUsageId(rs.getInt("usage_id"));
        usage.setItemId(rs.getInt("item_id"));
        usage.setQuantity(rs.getDouble("quantity"));
        usage.setItemUserName(rs.getString("item_user_name"));
        usage.setDate(rs.getDate("date").toLocalDate());
        usage.setStatus(Usage.Status.valueOf(rs.getString("status")));
        return usage;
    }
}