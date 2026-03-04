-- =========================================
-- FOODFLOW DATABASE SCHEMA
-- =========================================

CREATE DATABASE IF NOT EXISTS foodflow;
USE foodflow;

-- =========================================
-- USERS TABLE
-- =========================================

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- ADMIN, MANAGER, CLERK
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- ITEMS TABLE
-- =========================================

CREATE TABLE items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    stock DOUBLE NOT NULL DEFAULT 0,
    unit_of_measure VARCHAR(50),
    description TEXT,
    status VARCHAR(50) DEFAULT 'AVAILABLE'
);

-- =========================================
-- SUPPLY TABLE (Stock In)
-- =========================================

CREATE TABLE supply (
    supply_id INT PRIMARY KEY AUTO_INCREMENT,
    item_id INT NOT NULL,
    quantity DOUBLE NOT NULL,
    supplier VARCHAR(100),
    supply_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    recorded_by INT NOT NULL,

    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES users(user_id) ON DELETE CASCADE
);

-- =========================================
-- USAGE TABLE (Stock Out - Consumption)
-- =========================================

CREATE TABLE usage (
    usage_id INT PRIMARY KEY AUTO_INCREMENT,
    item_id INT NOT NULL,
    quantity DOUBLE NOT NULL,
    usage_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    recorded_by INT NOT NULL,

    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES users(user_id) ON DELETE CASCADE
);

-- =========================================
-- DAMAGE LOG TABLE
-- =========================================

CREATE TABLE damage_log (
    damage_id INT PRIMARY KEY AUTO_INCREMENT,
    item_id INT NOT NULL,
    quantity DOUBLE NOT NULL,
    damage_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    reported_by INT NOT NULL,

    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (reported_by) REFERENCES users(user_id) ON DELETE CASCADE
);

-- =========================================
-- OPTIONAL: BORROW TRANSACTIONS (If needed)
-- =========================================

CREATE TABLE borrow_transaction (
    borrow_id INT PRIMARY KEY AUTO_INCREMENT,
    item_id INT NOT NULL,
    quantity_borrowed INT NOT NULL,
    quantity_returned INT DEFAULT 0,
    borrow_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    return_date DATETIME,
    status VARCHAR(50) DEFAULT 'BORROWED', -- BORROWED, PARTIAL_RETURN, RETURNED
    recorded_by INT NOT NULL,

    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES users(user_id) ON DELETE CASCADE
);