package com.AdminPanel.backend.customers;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/customers")
public class CustomersController {
    CustomersRepository customersRepository;

    CustomersController(CustomersRepository customersRepository) {
        this.customersRepository = customersRepository;
    }

    @GetMapping("/search")
    public ResponseEntity<List<CustomerEntity>> httpSearchCustomers(@RequestParam String query) {
        if (query == null || query.isBlank()) {
            return ResponseEntity.ok(List.of());
        }

        List<CustomerEntity> customers = customersRepository.search(query.trim(), PageRequest.of(0, 10));

        return ResponseEntity.ok(customers);
    }
}
