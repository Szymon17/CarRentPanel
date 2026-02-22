package com.AdminPanel.backend.cars;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cars")
public class CarEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Integer year;

    @Column(name = "number_of_seats", nullable = false)
    private Integer numberOfSeats;

    @Column(name = "drive_type", nullable = false, length = 100)
    private String driveType;

    @Column(name = "fuel_type", nullable = false, length = 50)
    private String fuelType;

    @Column(name = "daily_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal dailyPrice;

    @Column(nullable = false)
    private Integer power;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    @Column(name = "engine_capacity", nullable = false, length = 10)
    private String engineCapacity;

    @Column(nullable = false)
    private String color;

    @Column(nullable = false)
    private String transmission;

    @Column(name = "fuel_usage_city", nullable = false, length = 10)
    private String fuelUsageCity;

    @Column(name = "fuel_usage_outcity", nullable = false, length = 10)
    private String fuelUsageOutcity;

    @Column(name = "image_url", nullable = false, columnDefinition = "text")
    private String imageUrl;

    @Column(name = "localisation", nullable = false)
    private String localisation;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public Integer getNumberOfSeats() { return numberOfSeats; }
    public void setNumberOfSeats(Integer numberOfSeats) { this.numberOfSeats = numberOfSeats; }

    public String getDriveType() { return driveType; }
    public void setDriveType(String driveType) { this.driveType = driveType; }

    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }

    public BigDecimal getDailyPrice() { return dailyPrice; }
    public void setDailyPrice(BigDecimal dailyPrice) { this.dailyPrice = dailyPrice; }

    public Integer getPower() { return power; }
    public void setPower(Integer power) { this.power = power; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getEngineCapacity() { return engineCapacity; }
    public void setEngineCapacity(String engineCapacity) { this.engineCapacity = engineCapacity; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getTransmission() { return transmission; }
    public void setTransmission(String transmission) { this.transmission = transmission; }

    public String getFuelUsageCity() { return fuelUsageCity; }
    public void setFuelUsageCity(String fuelUsageCity) { this.fuelUsageCity = fuelUsageCity; }

    public String getFuelUsageOutcity() { return fuelUsageOutcity; }
    public void setFuelUsageOutcity(String fuelUsageOutcity) { this.fuelUsageOutcity = fuelUsageOutcity; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getLocalisation() { return localisation; }
    public void setLocalisation(String localisation) { this.localisation = localisation; }
}
