package com.AdminPanel.backend.orders.views;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface OrderWithCarView {
    Integer getId();
    Integer getUserId();

    LocalDateTime getDateOfReceipt();
    LocalDateTime getDateOfReturn();

    String getPlaceOfReceipt();
    String getPlaceOfReturn();

    Integer getPaymentMethodId();
    Integer getStatusId();

    LocalDate getAddDate();
    LocalDate getExpectedReturnDate();

    String getCarModel();
    String getCarBrand();
    String getCarImageUrl();

    String getStatusName();
}