const BASE_URL = "http://localhost:8080/car";

// Save car data
document.getElementById("carForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
        speed: document.getElementById("speed").value,
        fuel_level: document.getElementById("fuel").value,
        seat_belt_status: document.getElementById("seatbelt").checked
    };

    fetch(`${BASE_URL}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(() => {
        alert("Car Data Saved Successfully");
        document.getElementById("carForm").reset();
    })
    .catch(err => console.error(err));
});

// Get all car data
function getAll() {
    fetch(`${BASE_URL}/all`)
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById("carTable");
            table.innerHTML = "";

            data.forEach(car => {
                table.innerHTML += `
                    <tr>
                        <td>${car.id}</td>
                        <td>${car.speed}</td>
                        <td>${car.fuel_level}</td>
                        <td>${car.seat_belt_status}</td>
                        <td>${car.timeOfInput}</td>
                    </tr>
                `;
            });
        });
}

// Get latest car data
function getLatest() {
    fetch(`${BASE_URL}/latest`)
        .then(res => res.json())
        .then(car => {
            document.getElementById("latestData").innerHTML = `
                <p><b>Speed:</b> ${car.speed}</p>
                <p><b>Fuel:</b> ${car.fuel_level}</p>
                <p><b>Seat Belt:</b> ${car.seat_belt_status}</p>
                <p><b>Time:</b> ${car.timeOfInput}</p>
            `;
        });
}
