package com.AdminPanel.backend.cars;

import com.AdminPanel.backend.auth.UserRepository;
import com.AdminPanel.backend.cars.dto.GetCarsResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cars")
public class CarsController {
    CarsRepository carsRepository;

    CarsController(CarsRepository carsRepository){
        this.carsRepository = carsRepository;
    }

    @GetMapping("/list")
    public GetCarsResponse httpGetList(HttpServletRequest req, HttpServletResponse res){
        List<CarEntity> cars = carsRepository.findFirst50Cars();

        return new GetCarsResponse(cars);
    }

    @PostMapping("/create")
    public ResponseEntity<CarEntity> httpCreateCar(@RequestBody CarEntity car){
            car.setId(null);
            CarEntity savedCar = carsRepository.save(car);

            return ResponseEntity.ok(savedCar);
    }
}
