package com.AdminPanel.backend.paymentMethods;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/payment-methods")
public class PaymentMethodsController {
    PaymentMethodsRepository paymentMethodsRepository;

    PaymentMethodsController(PaymentMethodsRepository paymentMethodsRepository) {
        this.paymentMethodsRepository = paymentMethodsRepository;
    }

    @GetMapping("/list")
    public ResponseEntity<List<PaymentMethodEntity>> httpGetPaymentMethods() {
        List<PaymentMethodEntity> paymentMethods = paymentMethodsRepository.findByIsActiveTrue();

        return ResponseEntity.ok(paymentMethods);
    }
}
