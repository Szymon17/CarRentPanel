package com.AdminPanel.backend.orders;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto-increment from PostgreSQL
    private Integer id;

    @Column(name = "car_id", nullable = false)
    private Integer carId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "date_of_receipt", nullable = false)
    private LocalDateTime dateOfReceipt;

    @Column(name = "date_of_return", nullable = false)
    private LocalDateTime dateOfReturn;

    @Column(name = "place_of_receipt", nullable = false, length = 255)
    private String placeOfReceipt;

    @Column(name = "place_of_return", nullable = false, length = 255)
    private String placeOfReturn;

    @Column(name = "payment_method_id")
    private Integer paymentMethodId;

    @Column(name = "status_id", nullable = false)
    private Integer statusId = 1; // pending default

    @Column(name = "add_date", nullable = false)
    private LocalDate addDate;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getCarId() { return carId; }
    public void setCarId(Integer carId) { this.carId = carId; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public LocalDateTime getDateOfReceipt() { return dateOfReceipt; }
    public void setDateOfReceipt(LocalDateTime dateOfReceipt) { this.dateOfReceipt = dateOfReceipt; }

    public LocalDateTime getDateOfReturn() { return dateOfReturn; }
    public void setDateOfReturn(LocalDateTime dateOfReturn) { this.dateOfReturn = dateOfReturn; }

    public String getPlaceOfReceipt() { return placeOfReceipt; }
    public void setPlaceOfReceipt(String placeOfReceipt) { this.placeOfReceipt = placeOfReceipt; }

    public String getPlaceOfReturn() { return placeOfReturn; }
    public void setPlaceOfReturn(String placeOfReturn) { this.placeOfReturn = placeOfReturn; }

    public Integer getPaymentMethodId() { return paymentMethodId; }
    public void setPaymentMethodId(Integer paymentMethodId) { this.paymentMethodId = paymentMethodId; }

    public Integer getStatusId() { return statusId; }
    public void setStatusId(Integer statusId) { this.statusId = statusId; }

    public LocalDate getAddDate() { return addDate; }
    public void setAddDate(LocalDate addDate) { this.addDate = addDate; }
}
