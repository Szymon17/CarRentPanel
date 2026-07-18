package com.AdminPanel.backend.orders.dto;

public record UserSummary(
        Integer id,
        String name,
        String surname,
        String phoneNumber,
        String email
) {}
