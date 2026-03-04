USE foodflow;

-- =========================================
-- USERS
-- =========================================
INSERT INTO users (name, email, password, role) VALUES
('System Admin', 'admin@foodflow.com', '$2y$10$hashedpassword1', 'ADMIN'),
('Catering Manager', 'manager@foodflow.com', '$2y$10$hashedpassword2', 'MANAGER'),
('Store Clerk One', 'clerk1@foodflow.com', '$2y$10$hashedpassword3', 'CLERK'),
('Store Clerk Two', 'clerk2@foodflow.com', '$2y$10$hashedpassword4', 'CLERK');

-- =========================================
-- ITEMS
-- =========================================
INSERT INTO items (name, category, stock, unit_of_measure, description) VALUES
('Sugar', 'Non-Perishable', 100, 'kg', 'White granulated sugar'),
('Kales', 'Perishable', 50, 'kg', 'Fresh green kales for cooking'),
('Cups', 'Non-Perishable', 200, 'pcs', 'Plastic cups for serving'),
('Plates', 'Non-Perishable', 150, 'pcs', 'Disposable plates');

-- =========================================
-- SUPPLY
-- =========================================
INSERT INTO supply (item_id, quantity, supplier, supply_date, recorded_by) VALUES
(1, 50, 'Sweet Foods Ltd.', '2026-03-01 09:00:00', 1),
(2, 20, 'Fresh Veggies Co.', '2026-03-01 09:30:00', 3),
(3, 100, 'Party Supplies Ltd.', '2026-03-01 10:00:00', 3);

-- =========================================
-- ITEM USAGE
-- =========================================
INSERT INTO item_usage (item_id, quantity, usage_date, recorded_by) VALUES
(1, 10, '2026-03-01 12:00:00', 3),
(2, 5, '2026-03-01 12:30:00', 3),
(3, 20, '2026-03-01 13:00:00', 4);

-- =========================================
-- DAMAGE LOG
-- =========================================
INSERT INTO damage_log (item_id, quantity, damage_date, description, reported_by) VALUES
(3, 3, '2026-03-01 14:00:00', 'Cracked during lunch service', 3),
(4, 2, '2026-03-01 14:30:00', 'Chipped plates', 4);

-- =========================================
-- BORROW TRANSACTION (optional)
-- =========================================
INSERT INTO borrow_transaction (item_id, quantity_borrowed, quantity_returned, borrow_date, return_date, status, recorded_by) VALUES
(3, 10, 0, '2026-03-01 11:00:00', NULL, 'BORROWED', 3),
(4, 5, 5, '2026-02-28 10:00:00', '2026-03-01 10:00:00', 'RETURNED', 4);