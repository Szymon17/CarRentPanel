package com.AdminPanel.backend.orders;

import com.AdminPanel.backend.cars.CarEntity;
import com.AdminPanel.backend.cars.CarsRepository;
import com.AdminPanel.backend.customers.CustomerEntity;
import com.AdminPanel.backend.customers.CustomersRepository;
import com.AdminPanel.backend.orders.Statuses.StatusEntity;
import com.AdminPanel.backend.orders.Statuses.StatusRepository;
import com.AdminPanel.backend.orders.dto.OrderRequest;
import com.AdminPanel.backend.orders.dto.OrderResponse;
import com.AdminPanel.backend.orders.views.OrderWithCarView;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/orders")
public class OrdersController {
    OrdersRepository ordersRepository;
    StatusRepository statusRepository;
    CustomersRepository customersRepository;
    CarsRepository carsRepository;

    OrdersController(
            OrdersRepository ordersRepository,
            StatusRepository statusRepository,
            CustomersRepository customersRepository,
            CarsRepository carsRepository
    ){
        this.ordersRepository = ordersRepository;
        this.statusRepository = statusRepository;
        this.customersRepository = customersRepository;
        this.carsRepository = carsRepository;
    }

    @GetMapping("/list")
    public ResponseEntity<List<OrderResponse>> httpGetUnfinishedOrders(@RequestParam(defaultValue = "0") int page){
        int size = 100;

        Pageable pageable = PageRequest.of(page,size);

        List<OrderWithCarView> orders = ordersRepository.getUnfinishedOrders(pageable);
        List<Integer> userIds = orders.stream().map(OrderWithCarView::getUserId).distinct().toList();

        Map<Integer, CustomerEntity> customersById = customersRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(CustomerEntity::getId, customer -> customer));

        List<OrderResponse> response = orders.stream()
                .map(order -> OrderResponse.from(order, customersById.get(order.getUserId())))
                .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/order")
    public ResponseEntity<OrderResponse> httpGetOrderInfo(@RequestParam Long id){
        OrderWithCarView order = ordersRepository.getOrderById(id);
        CustomerEntity customer = customersRepository.findById(order.getUserId()).orElse(null);

        return ResponseEntity.ok(OrderResponse.from(order, customer));
    }

    @GetMapping("/statuses")
    public ResponseEntity<List<StatusEntity>> httpGetStatuses(){
        List<StatusEntity> statuses = statusRepository.findAll();

        return ResponseEntity.ok(statuses);
    }

    @PostMapping("/create")
    public ResponseEntity<OrderResponse> httpCreateOrder(@RequestBody OrderRequest request){
        CarEntity car = carsRepository.findById(request.carId().longValue())
                .orElseThrow(() -> new RuntimeException("Car not found"));
        StatusEntity status = statusRepository.findById(request.statusId())
                .orElseThrow(() -> new RuntimeException("Status not found"));

        OrderEntity order = new OrderEntity();
        order.setCar(car);
        order.setUserId(request.userId());
        order.setDateOfReceipt(request.dateOfReceipt());
        order.setDateOfReturn(request.dateOfReturn());
        order.setPlaceOfReceipt(request.placeOfReceipt());
        order.setPlaceOfReturn(request.placeOfReturn());
        order.setPaymentMethodId(request.paymentMethodId());
        order.setStatusId(status);
        order.setAddDate(request.addDate());
        order.setExpectedReturnDate(request.expectedReturnDate());

        OrderEntity saved = ordersRepository.save(order);

        return ResponseEntity.ok(toOrderResponse(saved));
    }

    @PutMapping("/order")
    public ResponseEntity<OrderResponse> httpModifyOrder(@RequestBody OrderRequest request){
        OrderEntity order = ordersRepository.findById(request.id().longValue())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        StatusEntity status = statusRepository.findById(request.statusId())
                .orElseThrow(() -> new RuntimeException("Status not found"));

        order.setUserId(request.userId());
        order.setDateOfReceipt(request.dateOfReceipt());
        order.setDateOfReturn(request.dateOfReturn());
        order.setPlaceOfReceipt(request.placeOfReceipt());
        order.setPlaceOfReturn(request.placeOfReturn());
        order.setPaymentMethodId(request.paymentMethodId());
        order.setStatusId(status);
        order.setAddDate(request.addDate());
        order.setExpectedReturnDate(request.expectedReturnDate());

        OrderEntity saved = ordersRepository.save(order);

        return ResponseEntity.ok(toOrderResponse(saved));
    }

    private OrderResponse toOrderResponse(OrderEntity saved){
        OrderWithCarView view = ordersRepository.getOrderById(saved.getId().longValue());
        CustomerEntity customer = customersRepository.findById(saved.getUserId()).orElse(null);

        return OrderResponse.from(view, customer);
    }
}
