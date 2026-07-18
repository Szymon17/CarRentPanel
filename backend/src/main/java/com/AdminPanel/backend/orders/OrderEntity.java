package com.AdminPanel.backend.orders;

import com.AdminPanel.backend.cars.CarEntity;
import com.AdminPanel.backend.orders.Statuses.StatusEntity;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto-increment from PostgreSQL
    private Integer id;

    @ManyToOne()
    @JoinColumn(name = "car_id", nullable = false)
    private CarEntity car;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "date_of_receipt")
    private LocalDateTime dateOfReceipt;

    @Column(name = "date_of_return")
    private LocalDateTime dateOfReturn;

    @Column(name = "place_of_receipt", nullable = false, length = 255)
    private String placeOfReceipt;

    @Column(name = "place_of_return", nullable = false, length = 255)
    private String placeOfReturn;

    @Column(name = "payment_method_id")
    private Integer paymentMethodId;

    @ManyToOne()
    @JoinColumn(name = "status_id", nullable = false)
    private StatusEntity status;

    @Column(name = "add_date", nullable = false)
    private LocalDate addDate;

    @Column(name = "expected_return_date", nullable = false)
    private LocalDate expectedReturnDate;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public CarEntity getCar() { return car; }
    public void setCar(CarEntity car) { this.car = car; }

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

    public StatusEntity getStatusId() { return status; }
    public void setStatusId(StatusEntity status) { this.status = status; }

    public LocalDate getAddDate() { return addDate; }
    public void setAddDate(LocalDate addDate) { this.addDate = addDate; }

    public LocalDate getExpectedReturnDate() { return expectedReturnDate; }
    public void setExpectedReturnDate(LocalDate expectedReturnDate) { this.expectedReturnDate = expectedReturnDate; }
}
