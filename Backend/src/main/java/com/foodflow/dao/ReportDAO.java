package com.foodflow.dao;

import com.foodflow.model.Damage;
import com.foodflow.model.Item;
import com.foodflow.model.StoreRequest;
import com.foodflow.model.Usage;

import java.util.List;
import java.util.stream.Collectors;

public class ReportDAO {

    private final ItemDAO itemDAO = new ItemDAO();
    private final UsageDAO usageDAO = new UsageDAO();
    private final DamageDAO damageDAO = new DamageDAO();
    private final StoreRequestDAO storeRequestDAO = new StoreRequestDAO();

    public List<Item> getLowStockItems(double threshold) {
        return itemDAO.getAllItems().stream()
                .filter(item -> item.getCurrentStock() <= threshold || item.isLowStock())
                .collect(Collectors.toList());
    }

    public List<Usage> getUsageReport() {
        return usageDAO.getAllUsage();
    }

    public List<Damage> getDamageReport() {
        return damageDAO.getAllDamage();
    }

    public List<StoreRequest> getPendingRequests() {
        return storeRequestDAO.getPendingRequests();
    }
}
