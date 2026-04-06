Backend Guide

#Main Folder
## `config/` Directory

The `config` folder contains all the configuration files necessary for the backend to operate. It serves as the central place for setting up the system environment, database connections, security, and web-related settings. This folder ensures that other modules (DAO, service, controller) can easily access shared configurations.

### Key Files

- **`DatabaseConfig.java`**
  - Handles database connectivity.
  - Provides methods to get a database `Connection` object.
  - Used by DAO classes to interact with the database.
  - Supports connection pooling for efficient resource management.

- **`SecurityConfig.java`**
  - Manages role-based access and authentication logic.
  - Can contain helper methods to verify user roles or permissions.
  - Prepares the backend for integration with Spring Security or custom security checks.

- **`WebConfig.java`**
  - Configures servlet settings, filters, session management, and encoding.
  - Optional for small projects but useful for expanding web functionality.
  - Ensures consistent application behavior across all controllers.

### Purpose

The `config` directory is essential for separating system setup from business logic. By centralizing configuration here, the backend becomes more maintainable, flexible, and secure. All other modules rely on these configurations to function correctly.


# Controllers (`controller/`)

The `controller` package handles **all HTTP requests** coming from the front-end, processing them, and deciding which views to render. Each controller corresponds to a specific module or functional area of the FoodFlow system. Controllers also enforce **role-based access**, so users only see or modify what they’re allowed to.  

## File Overview

| File | Purpose | Key Responsibilities |
|------|---------|---------------------|
| `LoginController.java` / `AuthController.java` | Handles authentication | Login, logout, session management, redirect based on role, enforce account active/locked checks |
| `DashboardController.java` | Manages dashboard pages | Show summaries, statistics, and quick links for each user role |
| `ItemController.java` | Handles item management | CRUD operations for inventory items, search, validation, enforce role permissions |
| `SupplyController.java` | Handles stock incoming | Record new deliveries, update stock levels, alert low stock |
| `UsageController.java` | Handles stock usage | Record daily consumption, update inventory, track usage trends |
| `DamageController.java` | Handles damaged items | Log broken or spoiled items, update stock, generate damage alerts |
| `ReportController.java` | Handles reports & analytics | Aggregate data from items, usage, and damage logs; generate reports, charts, and exports |
| `UserController.java` | Handles admin user management | CRUD for users, assign roles, reset passwords, enforce admin-only access |

## Role-Based Access

- **Admin:** Full access to all controllers, including `UserController` and `ReportController`  
- **Manager:** Limited access: mostly `DashboardController`, `ItemController`, `SupplyController`, `UsageController`, `DamageController`, and `ReportController`  
- **Clerk:** Operational access: mainly `DashboardController`, `ItemController`, `SupplyController`, `UsageController`, `DamageController`  

## Notes

- Controllers communicate with **DAO classes** to retrieve or update database information.  
- Responses are forwarded to JSP/Thymeleaf templates located in `/templates/pages/` or `/templates/admin/`.  
- All controllers check the **current session** to ensure the user is logged in and has permission for the requested action.  