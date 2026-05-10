package com.AdminPanel.backend.orders;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdersRepository extends JpaRepository<OrderEntity, Long> {
    @Query(value = "SELECT * FROM orders WHERE status_id IN(1,2) LIMIT :limit OFFSET :offset", nativeQuery = true)
    List<OrderEntity> getUnfinishedOrders(@Param("limit") int limit,@Param("offset") int offset);
}
