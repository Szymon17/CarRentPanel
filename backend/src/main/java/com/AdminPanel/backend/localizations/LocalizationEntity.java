package com.AdminPanel.backend.localizations;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
@Table(name = "localizations")
public class LocalizationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "localization")
    private String localization;
}
