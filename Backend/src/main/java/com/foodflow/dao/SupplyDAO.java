package com.foodflow.dao;

import com.foodflow.config.DatabaseConfig;
import com.foodflow.model.Supply;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class SupplyDAO {

    public boolean addSupply(Supply supply) {
        String insertSql = "INSERT INTO supply (item_id, quantity, supplier, supply_date, recorded_by) VALUES (?, ?, ?, ?, ?)";
        String stockSql = "UPDATE items SET stock = stock + ?, status = CASE WHEN stock + ? <= 0 THEN 'OUT_OF_STOCK' ELSE 'AVAILABLE' END WHERE item_id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement insertStmt = conn.prepareStatement(insertSql);
             PreparedStatement stockStmt = conn.prepareStatement(stockSql)) {
            conn.setAutoCommit(false);
            insertStmt.setInt(1, supply.getItemId());
            insertStmt.setDouble(2, supply.getQuantity());
            insertStmt.setString(3, supply.getSupplier());
            insertStmt.setTimestamp(4, Timestamp.valueOf(LocalDateTime.of(supply.getDate(), supply.getTime())));
            if (supply.getRecordedBy() == null || supply.getRecordedBy() <= 0) {
                insertStmt.setNull(5, java.sql.Types.INTEGER);
            } else {
                insertStmt.setInt(5, supply.getRecordedBy());
            }
            insertStmt.executeUpdate();

            stockStmt.setDouble(1, supply.getQuantity());
            stockStmt.setDouble(2, supply.getQuantity());
            stockStmt.setInt(3, supply.getItemId());
            stockStmt.executeUpdate();

            conn.commit();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public List<Supply> getAllSupplies() {
        String sql = "SELECT s.*, i.name AS item_name, u.name AS recorded_by_name " +
                "FROM supply s JOIN items i ON s.item_id = i.item_id " +
                "LEFT JOIN users u ON s.recorded_by = u.user_id ORDER BY s.supply_date DESC";
        List<Supply> supplies = new ArrayList<>();
        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                supplies.add(mapResultSetToSupply(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return supplies;
    }

    private Supply mapResultSetToSupply(ResultSet rs) throws SQLException {
        Supply supply = new Supply();
        supply.setSupplyId(rs.getInt("supply_id"));
        supply.setItemId(rs.getInt("item_id"));
        supply.setItemName(rs.getString("item_name"));
        supply.setQuantity(rs.getDouble("quantity"));
        supply.setSupplier(rs.getString("supplier"));
        int recordedBy = rs.getInt("recorded_by");
        supply.setRecordedBy(rs.wasNull() ? null : recordedBy);
        supply.setRecordedByName(rs.getString("recorded_by_name"));
        Timestamp timestamp = rs.getTimestamp("supply_date");
        if (timestamp != null) {
            supply.setDate(timestamp.toLocalDateTime().toLocalDate());
            supply.setTime(timestamp.toLocalDateTime().toLocalTime());
        }
        return supply;
    }
}
