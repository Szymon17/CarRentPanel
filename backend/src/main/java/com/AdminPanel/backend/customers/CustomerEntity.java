package com.AdminPanel.backend.customers;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class CustomerEntity {

    @Id
    @Column(name = "user_id")
    private Integer id;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String surname;

    @Column(name = "phonenumber", nullable = false, length = 100)
    private String phoneNumber;

    public Integer getId() { return id; }

    public String getEmail() { return email; }

    public String getName() { return name; }

    public String getSurname() { return surname; }

    public String getPhoneNumber() { return phoneNumber; }
}
