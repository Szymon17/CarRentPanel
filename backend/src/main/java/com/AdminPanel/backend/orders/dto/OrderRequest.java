package com.AdminPanel.backend.orders.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record OrderRequest(
        Integer id,
        Integer carId,
        Integer userId,
        LocalDateTime dateOfReceipt,
        LocalDateTime dateOfReturn,
        String placeOfReceipt,
        String placeOfReturn,
        Integer paymentMethodId,
        Integer statusId,
        LocalDate addDate,
        LocalDate expectedReturnDate
) {}
