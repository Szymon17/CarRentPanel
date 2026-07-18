package com.AdminPanel.backend.cars;

import com.AdminPanel.backend.cars.dto.OrderWithCarResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/cars")
public class CarsController {
    CarsRepository carsRepository;

    CarsController(CarsRepository carsRepository){
        this.carsRepository = carsRepository;
    }

    @GetMapping("/list")
    public OrderWithCarResponse httpGetList(HttpServletRequest req, HttpServletResponse res){
        List<CarEntity> cars = carsRepository.findFirst50Cars();

        return new OrderWithCarResponse(cars);
    }

    @GetMapping("/car")
    public ResponseEntity<CarEntity> httpGetCarByID(@RequestParam Long id){
        CarEntity car = carsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        return ResponseEntity.ok(car);
    }

    @PostMapping("/create")
    public ResponseEntity<CarEntity> httpCreateCar(@RequestBody CarEntity car){
            car.setId(null);
            CarEntity savedCar = carsRepository.save(car);

            return ResponseEntity.ok(savedCar);
    }

    @PutMapping("/car")
    public ResponseEntity<CarEntity> httpModifyCar(@RequestBody CarEntity car){
        CarEntity savedCar = carsRepository.save(car);

        return ResponseEntity.ok(savedCar);
    }

    @DeleteMapping("/car")
    public ResponseEntity<CarEntity> httpDeleteCar(@RequestParam Long id){
        Optional<CarEntity> car = carsRepository.findById(id);

        if(car.isEmpty()) return ResponseEntity.notFound().build();

        carsRepository.deleteById(id);
        return ResponseEntity.ok(car.get());
    }
}
