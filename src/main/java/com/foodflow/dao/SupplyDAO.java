package com.foodflow.dao;

import com.foodflow.config.DatabaseConfig;
import com.foodflow.model.Supply;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class SupplyDAO {

    private Connection conn;

    public SupplyDAO() {
        conn = DatabaseConfig.getConnection();
    }

    // -------------------------------
    // ADD NEW SUPPLY
    // -------------------------------
    public boolean addSupply(Supply supply) {
        String sql = "INSERT INTO supply (item_id, quantity, supplier, date, time) VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, supply.getItemId());
            stmt.setDouble(2, supply.getQuantity());
            stmt.setString(3, supply.getSupplier());
            stmt.setDate(4, Date.valueOf(supply.getDate()));
            stmt.setTime(5, Time.valueOf(supply.getTime()));
            int rows = stmt.executeUpdate();
            return rows > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // -------------------------------
    // GET SUPPLY BY ID
    // -------------------------------
    public Supply getSupplyById(int supplyId) {
        String sql = "SELECT * FROM supply WHERE supply_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, supplyId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return mapResultSetToSupply(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    // -------------------------------
    // LIST ALL SUPPLIES
    // -------------------------------
    public List<Supply> getAllSupplies() {
        List<Supply> supplies = new ArrayList<>();
        String sql = "SELECT * FROM supply ORDER BY date DESC, time DESC";
        try (Statement stmt = conn.createStatement()) {
            ResultSet rs = stmt.executeQuery(sql);
            while (rs.next()) {
                supplies.add(mapResultSetToSupply(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return supplies;
    }

    // -------------------------------
    // LIST SUPPLIES BY ITEM
    // -------------------------------
    public List<Supply> getSuppliesByItem(int itemId) {
        List<Supply> supplies = new ArrayList<>();
        String sql = "SELECT * FROM supply WHERE item_id = ? ORDER BY date DESC";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, itemId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                supplies.add(mapResultSetToSupply(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return supplies;
    }

    // -------------------------------
    // UPDATE SUPPLY
    // -------------------------------
    public boolean updateSupply(Supply supply) {
        String sql = "UPDATE supply SET item_id = ?, quantity = ?, supplier = ?, date = ?, time = ? WHERE supply_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, supply.getItemId());
            stmt.setDouble(2, supply.getQuantity());
            stmt.setString(3, supply.getSupplier());
            stmt.setDate(4, Date.valueOf(supply.getDate()));
            stmt.setTime(5, Time.valueOf(supply.getTime()));
            stmt.setInt(6, supply.getSupplyId());
            int rows = stmt.executeUpdate();
            return rows > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // -------------------------------
    // DELETE SUPPLY
    // -------------------------------
    public boolean deleteSupply(int supplyId) {
        String sql = "DELETE FROM supply WHERE supply_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, supplyId);
            int rows = stmt.executeUpdate();
            return rows > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // -------------------------------
    // HELPER: MAP RESULTSET TO SUPPLY OBJECT
    // -------------------------------
    private Supply mapResultSetToSupply(ResultSet rs) throws SQLException {
        Supply supply = new Supply();
        supply.setSupplyId(rs.getInt("supply_id"));
        supply.setItemId(rs.getInt("item_id"));
        supply.setQuantity(rs.getDouble("quantity"));
        supply.setSupplier(rs.getString("supplier"));
        supply.setDate(rs.getDate("date").toLocalDate());
        supply.setTime(rs.getTime("time").toLocalTime());
        return supply;
    }
}