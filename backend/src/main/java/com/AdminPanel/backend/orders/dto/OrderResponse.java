package com.AdminPanel.backend.orders.dto;

import com.AdminPanel.backend.customers.CustomerEntity;
import com.AdminPanel.backend.orders.views.OrderWithCarView;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record OrderResponse(
        Integer id,
        Integer userId,
        LocalDateTime dateOfReceipt,
        LocalDateTime dateOfReturn,
        String placeOfReceipt,
        String placeOfReturn,
        Integer paymentMethodId,
        Integer statusId,
        String statusName,
        LocalDate addDate,
        LocalDate expectedReturnDate,
        String carModel,
        String carBrand,
        String carImageUrl,
        UserSummary user
) {
    public static OrderResponse from(OrderWithCarView order, CustomerEntity user) {
        UserSummary userSummary = user == null
                ? null
                : new UserSummary(user.getId(), user.getName(), user.getSurname(), user.getPhoneNumber(), user.getEmail());

        return new OrderResponse(
                order.getId(),
                order.getUserId(),
                order.getDateOfReceipt(),
                order.getDateOfReturn(),
                order.getPlaceOfReceipt(),
                order.getPlaceOfReturn(),
                order.getPaymentMethodId(),
                order.getStatusId(),
                order.getStatusName(),
                order.getAddDate(),
                order.getExpectedReturnDate(),
                order.getCarModel(),
                order.getCarBrand(),
                order.getCarImageUrl(),
                userSummary
        );
    }
}
