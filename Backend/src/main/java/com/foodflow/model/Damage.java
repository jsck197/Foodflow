package com.foodflow.model;

import java.time.LocalDate;

public class Damage {
    private int damageId;
    private int itemId;
    private String itemName;
    private double quantity;
    private LocalDate date = LocalDate.now();
    private String description;
    private String reportedBy;
    private Integer reportedByUserId;

    public int getDamageId() { return damageId; }
    public void setDamageId(int damageId) { this.damageId = damageId; }

    public int getItemId() { return itemId; }
    public void setItemId(int itemId) { this.itemId = itemId; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public double getQuantity() { return quantity; }
    public void setQuantity(double quantity) { this.quantity = quantity; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getReportedBy() { return reportedBy; }
    public void setReportedBy(String reportedBy) { this.reportedBy = reportedBy; }

    public Integer getReportedByUserId() { return reportedByUserId; }
    public void setReportedByUserId(Integer reportedByUserId) { this.reportedByUserId = reportedByUserId; }
}
