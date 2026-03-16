package com.smartcar.car.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartcar.car.model.CarData;

public interface CarDataRepository extends JpaRepository<CarData, Integer> {
		CarData findTopByOrderByTimeOfInputDesc();
}
