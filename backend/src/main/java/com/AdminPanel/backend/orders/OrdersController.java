package com.AdminPanel.backend.orders;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrdersController {
    OrdersRepository ordersRepository;

    OrdersController(OrdersRepository ordersRepository ){
        this.ordersRepository = ordersRepository;
    }

    @GetMapping("/list")
    public ResponseEntity<List<OrderEntity>> getUnfinishedOrders(@RequestParam(defaultValue = "0") int page){
        int bunchSize = 100;
        int offset = page * bunchSize;

        List<OrderEntity> orders = ordersRepository.getUnfinishedOrders(bunchSize, offset);
        return ResponseEntity.ok(orders);
    }
}
