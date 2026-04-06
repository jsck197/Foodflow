package com.foodflow.model;

import com.foodflow.model.enums.ItemStatus;

public class Item {
    private int itemId;
    private String name;
    private String category;
    private String itemType = "FOOD";
    private double currentStock;
    private String unitOfMeasure;
    private String description;
    private String status = ItemStatus.AVAILABLE.name();

    public int getItemId() { return itemId; }
    public void setItemId(int itemId) { this.itemId = itemId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getItemType() { return itemType; }
    public void setItemType(String itemType) { this.itemType = itemType; }

    public double getCurrentStock() { return currentStock; }
    public void setCurrentStock(double currentStock) { this.currentStock = currentStock; }
    public double getStock() { return currentStock; }
    public void setStock(double currentStock) { this.currentStock = currentStock; }

    public String getUnitOfMeasure() { return unitOfMeasure; }
    public void setUnitOfMeasure(String unitOfMeasure) { this.unitOfMeasure = unitOfMeasure; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isLowStock() {
        return ItemStatus.OUT_OF_STOCK.name().equalsIgnoreCase(status) || currentStock <= 10;
    }

    public boolean isInStock() {
        return currentStock > 0;
    }
}
