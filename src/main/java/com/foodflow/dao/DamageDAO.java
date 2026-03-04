package com.catering.dao;

import com.catering.config.DatabaseConfig;
import com.catering.model.Damage;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DamageDAO {

    private Connection conn;

    public DamageDAO() {
        conn = DatabaseConfig.getConnection();
    }

    // -------------------------------
    // ADD NEW DAMAGE RECORD
    // -------------------------------
    public boolean addDamage(Damage damage) {
        String sql = "INSERT INTO damage (item_id, quantity, date, description, reported_by) VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, damage.getItemId());
            stmt.setDouble(2, damage.getQuantity());
            stmt.setDate(3, Date.valueOf(damage.getDate()));
            stmt.setString(4, damage.getDescription());
            stmt.setString(5, damage.getReportedBy());
            int rows = stmt.executeUpdate();
            return rows > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // -------------------------------
    // GET DAMAGE BY ID
    // -------------------------------
    public Damage getDamageById(int damageId) {
        String sql = "SELECT * FROM damage WHERE damage_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, damageId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return mapResultSetToDamage(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    // -------------------------------
    // LIST ALL DAMAGE RECORDS
    // -------------------------------
    public List<Damage> getAllDamage() {
        List<Damage> damageList = new ArrayList<>();
        String sql = "SELECT * FROM damage ORDER BY date DESC";
        try (Statement stmt = conn.createStatement()) {
            ResultSet rs = stmt.executeQuery(sql);
            while (rs.next()) {
                damageList.add(mapResultSetToDamage(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return damageList;
    }

    // -------------------------------
    // LIST DAMAGE BY ITEM
    // -------------------------------
    public List<Damage> getDamageByItem(int itemId) {
        List<Damage> damageList = new ArrayList<>();
        String sql = "SELECT * FROM damage WHERE item_id = ? ORDER BY date DESC";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, itemId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                damageList.add(mapResultSetToDamage(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return damageList;
    }

    // -------------------------------
    // UPDATE DAMAGE RECORD
    // -------------------------------
    public boolean updateDamage(Damage damage) {
        String sql = "UPDATE damage SET item_id = ?, quantity = ?, date = ?, description = ?, reported_by = ? WHERE damage_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, damage.getItemId());
            stmt.setDouble(2, damage.getQuantity());
            stmt.setDate(3, Date.valueOf(damage.getDate()));
            stmt.setString(4, damage.getDescription());
            stmt.setString(5, damage.getReportedBy());
            stmt.setInt(6, damage.getDamageId());
            int rows = stmt.executeUpdate();
            return rows > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // -------------------------------
    // DELETE DAMAGE RECORD
    // -------------------------------
    public boolean deleteDamage(int damageId) {
        String sql = "DELETE FROM damage WHERE damage_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, damageId);
            int rows = stmt.executeUpdate();
            return rows > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // -------------------------------
    // HELPER: MAP RESULTSET TO DAMAGE OBJECT
    // -------------------------------
    private Damage mapResultSetToDamage(ResultSet rs) throws SQLException {
        Damage damage = new Damage();
        damage.setDamageId(rs.getInt("damage_id"));
        damage.setItemId(rs.getInt("item_id"));
        damage.setQuantity(rs.getDouble("quantity"));
        damage.setDate(rs.getDate("date").toLocalDate());
        damage.setDescription(rs.getString("description"));
        damage.setReportedBy(rs.getString("reported_by"));
        return damage;
    }
}