package com.smartcar.car.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcar.car.model.CarData;
import com.smartcar.car.repository.CarDataRepository;

@RestController
@CrossOrigin(origins="*")
@RequestMapping("/api")
public class CarDataController {

	@Autowired 
	private CarDataRepository repository;
	
	@PostMapping("/add")
	public CarData addCarData(@RequestBody CarData data) {
	    data.setTimeOfInput(LocalDateTime.now());
	    return repository.save(data);
	}
	
	@GetMapping("/all")
	public List<CarData> getAllData() {
		return repository.findAll();
	}
	
	@GetMapping("/latest")
	public CarData getLatestData() {
		return repository.findTopByOrderByTimeOfInputDesc();
	}
	
	

}
