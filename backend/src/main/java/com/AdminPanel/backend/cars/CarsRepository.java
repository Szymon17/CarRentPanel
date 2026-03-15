package com.AdminPanel.backend.cars;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarsRepository extends JpaRepository<CarEntity, Long> {
    @Query(value = "SELECT * FROM Cars ORDER BY ID DESC LIMIT 50",  nativeQuery = true)
    List<CarEntity> findFirst50Cars();


}
