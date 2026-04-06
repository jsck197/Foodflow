package com.foodflow.service;

import com.foodflow.dao.SupplyDAO;
import com.foodflow.model.Supply;

public class SupplyService {
    private final SupplyDAO supplyDAO = new SupplyDAO();

    public boolean recordSupply(int itemId, double quantity, int userId) {
        if (itemId <= 0 || quantity <= 0 || userId <= 0) {
            return false;
        }

        Supply supply = new Supply();
        supply.setItemId(itemId);
        supply.setQuantity(quantity);
        supply.setSupplier("USER_" + userId);
        supply.setRecordedBy(userId);
        return supplyDAO.addSupply(supply);
    }
}
