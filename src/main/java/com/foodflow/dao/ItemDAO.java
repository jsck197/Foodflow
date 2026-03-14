package com.foodflow.dao;

import com.foodflow.config.DatabaseConfig;
import com.foodflow.model.Item;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ItemDAO {

    // CREATE
    public void addItem(Item item) {
        String sql = "INSERT INTO items (name, category, stock, unit_of_measure, description, status) VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, item.getName());
            stmt.setString(2, item.getCategory());
            stmt.setDouble(3, item.getCurrentStock());
            stmt.setString(4, item.getUnitOfMeasure());
            stmt.setString(5, item.getDescription());
            stmt.setString(6, item.getStatus());

            stmt.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // READ BY ID
    public Item getItemById(int id) {
        String sql = "SELECT * FROM items WHERE item_id = ?";
        Item item = null;

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                item = mapResultSetToItem(rs);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return item;
    }

    // READ ALL
    public List<Item> getAllItems() {
        String sql = "SELECT * FROM items";
        List<Item> items = new ArrayList<>();

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                items.add(mapResultSetToItem(rs));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return items;
    }

    // UPDATE
    public void updateItem(Item item) {
        String sql = "UPDATE items SET name=?, category=?, stock=?, unit_of_measure=?, description=?, status=? WHERE item_id=?";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, item.getName());
            stmt.setString(2, item.getCategory());
            stmt.setDouble(3, item.getCurrentStock());
            stmt.setString(4, item.getUnitOfMeasure());
            stmt.setString(5, item.getDescription());
            stmt.setString(6, item.getStatus());
            stmt.setInt(7, item.getItemId());

            stmt.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // DELETE
    public void deleteItem(int id) {
        String sql = "DELETE FROM items WHERE item_id=?";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            stmt.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // MAPPING METHOD (VERY IMPORTANT)
    private Item mapResultSetToItem(ResultSet rs) throws SQLException {
        Item item = new Item();

        item.setItemId(rs.getInt("item_id"));
        item.setName(rs.getString("name"));
        item.setCategory(rs.getString("category"));
        item.setCurrentStock(rs.getDouble("stock"));
        item.setUnitOfMeasure(rs.getString("unit_of_measure"));
        item.setDescription(rs.getString("description"));
        item.setStatus(rs.getString("status"));

        return item;
    }
}