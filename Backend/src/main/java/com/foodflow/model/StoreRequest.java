package com.foodflow.model;

import java.time.LocalDateTime;

public class StoreRequest {
    private int requestId;
    private int requesterId;
    private String requesterName;
    private Integer approverId;
    private String approverName;
    private int itemId;
    private String itemName;
    private double quantityRequested;
    private double quantityApproved;
    private String status = "PENDING";
    private String notes;
    private LocalDateTime requestDate;
    private LocalDateTime approvedDate;

    public int getRequestId() { return requestId; }
    public void setRequestId(int requestId) { this.requestId = requestId; }

    public int getRequesterId() { return requesterId; }
    public void setRequesterId(int requesterId) { this.requesterId = requesterId; }

    public String getRequesterName() { return requesterName; }
    public void setRequesterName(String requesterName) { this.requesterName = requesterName; }

    public Integer getApproverId() { return approverId; }
    public void setApproverId(Integer approverId) { this.approverId = approverId; }

    public String getApproverName() { return approverName; }
    public void setApproverName(String approverName) { this.approverName = approverName; }

    public int getItemId() { return itemId; }
    public void setItemId(int itemId) { this.itemId = itemId; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public double getQuantityRequested() { return quantityRequested; }
    public void setQuantityRequested(double quantityRequested) { this.quantityRequested = quantityRequested; }

    public double getQuantityApproved() { return quantityApproved; }
    public void setQuantityApproved(double quantityApproved) { this.quantityApproved = quantityApproved; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getRequestDate() { return requestDate; }
    public void setRequestDate(LocalDateTime requestDate) { this.requestDate = requestDate; }

    public LocalDateTime getApprovedDate() { return approvedDate; }
    public void setApprovedDate(LocalDateTime approvedDate) { this.approvedDate = approvedDate; }
}
