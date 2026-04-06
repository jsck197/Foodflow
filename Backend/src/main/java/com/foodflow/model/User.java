package com.foodflow.model;

import java.time.LocalDateTime;

public class User {

    public enum Role {
        ADMIN,
        DEPARTMENT_HEAD,
        STOREKEEPER
    }

    private int userId;
    private String fullName;
    private String username;
    private String email;
    private String password;
    private Role role = Role.STOREKEEPER;
    private boolean active = true;
    private boolean accountLocked;
    private int loginAttempts;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
    private String status = "ACTIVE";

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) {
        this.fullName = fullName;
        if (this.username == null || this.username.isBlank()) {
            this.username = fullName;
        }
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role == null ? Role.STOREKEEPER : role; }
    public void setRole(com.foodflow.model.enums.Role role) {
        this.role = role == null ? Role.STOREKEEPER : Role.valueOf(role.name());
    }

    public boolean isActive() { return active; }
    public void setActive(boolean active) {
        this.active = active;
        this.status = active ? "ACTIVE" : "INACTIVE";
    }

    public boolean isAccountLocked() { return accountLocked || loginAttempts >= 5; }
    public void setAccountLocked(boolean accountLocked) { this.accountLocked = accountLocked; }

    public int getLoginAttempts() { return loginAttempts; }
    public void setLoginAttempts(int loginAttempts) { this.loginAttempts = loginAttempts; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }

    public String getStatus() { return status; }
    public void setStatus(String status) {
        this.status = (status == null || status.isBlank()) ? "ACTIVE" : status.toUpperCase();
        this.active = !"INACTIVE".equals(this.status);
    }
}
