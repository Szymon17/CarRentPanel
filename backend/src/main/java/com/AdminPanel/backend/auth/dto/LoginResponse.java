package com.AdminPanel.backend.auth.dto;

public class LoginResponse {
    private String message;
    private String email;

    public LoginResponse(String email, String message) {
        this.message = message;
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public String getEmail() {
        return email;
    }
}
