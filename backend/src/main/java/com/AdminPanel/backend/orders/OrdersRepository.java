package com.AdminPanel.backend.orders;

import com.AdminPanel.backend.orders.views.OrderWithCarView;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdersRepository extends JpaRepository<OrderEntity, Long> {
    @Query("""
    SELECT 
        o.id as id,
        o.userId as userId,
        o.dateOfReceipt as dateOfReceipt,
        o.dateOfReturn as dateOfReturn,
        o.placeOfReceipt as placeOfReceipt,
        o.placeOfReturn as placeOfReturn,
        o.paymentMethodId as paymentMethodId,
        o.addDate as addDate,
        o.expectedReturnDate as expectedReturnDate,
    
        c.model as carModel,
        c.brand as carBrand,
        c.imageUrl as carImageUrl,
            
        s.name as statusName,
        s.id as statusId
    
    FROM OrderEntity o
    JOIN o.car c
    JOIN o.status s
    WHERE s.id IN (1,2)
    """)
    List<OrderWithCarView> getUnfinishedOrders(Pageable pageable);


    @Query("""
    SELECT 
        o.id as id,
        o.userId as userId,
        o.dateOfReceipt as dateOfReceipt,
        o.dateOfReturn as dateOfReturn,
        o.placeOfReceipt as placeOfReceipt,
        o.placeOfReturn as placeOfReturn,
        o.paymentMethodId as paymentMethodId,
        o.addDate as addDate,
        o.expectedReturnDate as expectedReturnDate,
    
        c.model as carModel,
        c.brand as carBrand,
        c.imageUrl as carImageUrl,
            
        s.name as statusName,
        s.id as statusId
    
    FROM OrderEntity o
    JOIN o.car c
    JOIN o.status s
    WHERE o.id = :id
    """)
    OrderWithCarView getOrderById(Long id);
}
