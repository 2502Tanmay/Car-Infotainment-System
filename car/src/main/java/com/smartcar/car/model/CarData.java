package com.smartcar.car.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "bmw_car_dashboard")
public class CarData {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	private float tire_pressure_1;
	private float tire_pressure_2;
	private float tire_pressure_3;
	private float tire_pressure_4;
	private float temp;
	
	private boolean seat_belt_status;
	
	@Column(name = "time_of_input")
	private LocalDateTime timeOfInput;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public float getTire_pressure_1() {
		return tire_pressure_1;
	}

	public void setTire_pressure_1(float tire_pressure_1) {
		this.tire_pressure_1 = tire_pressure_1;
	}

	public float getTire_pressure_2() {
		return tire_pressure_2;
	}

	public void setTire_pressure_2(float tire_pressure_2) {
		this.tire_pressure_2 = tire_pressure_2;
	}

	public float getTire_pressure_3() {
		return tire_pressure_3;
	}

	public void setTire_pressure_3(float tire_pressure_3) {
		this.tire_pressure_3 = tire_pressure_3;
	}

	public float getTire_pressure_4() {
		return tire_pressure_4;
	}

	public void setTire_pressure_4(float tire_pressure_4) {
		this.tire_pressure_4 = tire_pressure_4;
	}

	public float getTemp() {
		return temp;
	}

	public void setTemp(float temp) {
		this.temp = temp;
	}

	public boolean isSeat_belt_status() {
		return seat_belt_status;
	}

	public void setSeat_belt_status(boolean seat_belt_status) {
		this.seat_belt_status = seat_belt_status;
	}

	public LocalDateTime getTimeOfInput() {
		return timeOfInput;
	}

	public void setTimeOfInput(LocalDateTime timeOfInput) {
		this.timeOfInput = timeOfInput;
	}

}
