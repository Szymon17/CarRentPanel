package com.AdminPanel.backend.paymentMethods;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
@Table(name = "payment_methods")
public class PaymentMethodEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @Column(name = "is_active")
    private Boolean isActive;
}
