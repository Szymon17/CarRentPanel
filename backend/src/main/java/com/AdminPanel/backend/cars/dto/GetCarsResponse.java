package com.AdminPanel.backend.cars.dto;

import com.AdminPanel.backend.cars.CarEntity;
import java.util.List;

public class GetCarsResponse {
   List<CarEntity> cars;

   public GetCarsResponse(List<CarEntity> cars){
       this.cars = cars;
   }

    public List<CarEntity> getCars() {
        return cars;
    }
}