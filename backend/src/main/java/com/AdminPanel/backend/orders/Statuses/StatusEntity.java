package com.AdminPanel.backend.orders.Statuses;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
@Table(name = "order_statuses")
public class StatusEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;

    @Column(name = "is_closed")
    private Boolean closed;
}
