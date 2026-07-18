package com.AdminPanel.backend.localizations;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocalizationsRepository extends JpaRepository<LocalizationEntity, Integer> {
}
