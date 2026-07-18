package com.AdminPanel.backend.paymentMethods;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentMethodsRepository extends JpaRepository<PaymentMethodEntity, Integer> {
    List<PaymentMethodEntity> findByIsActiveTrue();
}
