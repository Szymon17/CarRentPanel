package com.AdminPanel.backend.cars.dto;

import com.AdminPanel.backend.cars.CarEntity;
import java.util.List;

public class OrderWithCarResponse {
   List<CarEntity> cars;

   public OrderWithCarResponse(List<CarEntity> cars){
       this.cars = cars;
   }

    public List<CarEntity> getCars() {
        return cars;
    }
}