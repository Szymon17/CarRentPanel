package com.AdminPanel.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "panel_users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true)
    private String email;

    private String password;

    public String getEmail(){
        return email;
    }

    public String getPassword(){
        return password;
    }
}
