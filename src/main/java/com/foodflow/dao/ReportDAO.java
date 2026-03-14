package com.foodflow.dao;

import com.foodflow.config.DatabaseConfig;
import com.foodflow.model.Item;
import com.foodflow.model.Damage;
import com.foodflow.model.Usage;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ReportDAO {

    private Connection conn;

    public ReportDAO() {
        conn = DatabaseConfig.getConnection();
    }

    // -------------------------------
    // GET LOW STOCK ITEMS
    // -------------------------------
    public List<Item> getLowStockItems(double threshold) {
        List<Item> lowStockItems = new ArrayList<>();
        String sql = "SELECT * FROM item WHERE stock <= ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setDouble(1, threshold);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Item item = new Item();
                item.setItemId(rs.getInt("item_id"));
                item.setName(rs.getString("name"));
                item.setCategory(rs.getString("category"));
                item.setStock(rs.getDouble("stock"));
                item.setUnitOfMeasure(rs.getString("unit_of_measure"));
                item.setDescription(rs.getString("description"));
                lowStockItems.add(item);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return lowStockItems;
    }

    // -------------------------------
    // GET USAGE REPORT (ALL ITEMS)
    // -------------------------------
    public List<Usage> getUsageReport() {
        List<Usage> usageList = new ArrayList<>();
        String sql = "SELECT * FROM usage ORDER BY date DESC";
        try (Statement stmt = conn.createStatement()) {
            ResultSet rs = stmt.executeQuery(sql);
            while (rs.next()) {
                Usage usage = new Usage();
                usage.setUsageId(rs.getInt("usage_id"));
                usage.setItemId(rs.getInt("item_id"));
                usage.setQuantity(rs.getDouble("quantity"));
                usage.setItemUserName(rs.getString("item_user_name"));
                usage.setDate(rs.getDate("date").toLocalDate());
                usageList.add(usage);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return usageList;
    }

    // -------------------------------
    // GET DAMAGE REPORT (ALL ITEMS)
    // -------------------------------
    public List<Damage> getDamageReport() {
        List<Damage> damageList = new ArrayList<>();
        String sql = "SELECT * FROM damage ORDER BY date DESC";
        try (Statement stmt = conn.createStatement()) {
            ResultSet rs = stmt.executeQuery(sql);
            while (rs.next()) {
                Damage damage = new Damage();
                damage.setDamageId(rs.getInt("damage_id"));
                damage.setItemId(rs.getInt("item_id"));
                damage.setQuantity(rs.getDouble("quantity"));
                damage.setDate(rs.getDate("date").toLocalDate());
                damage.setDescription(rs.getString("description"));
                damage.setReportedBy(rs.getString("reported_by"));
                damageList.add(damage);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return damageList;
    }

    // -------------------------------
    // GET TOTAL USAGE OF AN ITEM
    // -------------------------------
    public double getTotalUsageByItem(int itemId) {
        String sql = "SELECT SUM(quantity) AS total_usage FROM usage WHERE item_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, itemId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getDouble("total_usage");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    // -------------------------------
    // GET TOTAL DAMAGE OF AN ITEM
    // -------------------------------
    public double getTotalDamageByItem(int itemId) {
        String sql = "SELECT SUM(quantity) AS total_damage FROM damage WHERE item_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, itemId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getDouble("total_damage");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }
}