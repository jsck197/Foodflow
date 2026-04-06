package com.foodflow.model;

import java.time.LocalDate;
import java.time.LocalTime;

public class Supply {
    private int supplyId;
    private int itemId;
    private String itemName;
    private double quantity;
    private String supplier;
    private Integer recordedBy;
    private String recordedByName;
    private LocalDate date = LocalDate.now();
    private LocalTime time = LocalTime.now();

    public int getSupplyId() { return supplyId; }
    public void setSupplyId(int supplyId) { this.supplyId = supplyId; }

    public int getItemId() { return itemId; }
    public void setItemId(int itemId) { this.itemId = itemId; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public double getQuantity() { return quantity; }
    public void setQuantity(double quantity) { this.quantity = quantity; }

    public String getSupplier() { return supplier; }
    public void setSupplier(String supplier) { this.supplier = supplier; }

    public Integer getRecordedBy() { return recordedBy; }
    public void setRecordedBy(Integer recordedBy) { this.recordedBy = recordedBy; }

    public String getRecordedByName() { return recordedByName; }
    public void setRecordedByName(String recordedByName) { this.recordedByName = recordedByName; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getTime() { return time; }
    public void setTime(LocalTime time) { this.time = time; }
}
