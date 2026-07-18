package com.AdminPanel.backend.customers;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomersRepository extends JpaRepository<CustomerEntity, Integer> {
    @Query("""
    SELECT c FROM CustomerEntity c
    WHERE LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%'))
       OR CAST(c.id AS string) LIKE CONCAT('%', :query, '%')
    ORDER BY c.id
    """)
    List<CustomerEntity> search(@Param("query") String query, Pageable pageable);
}
