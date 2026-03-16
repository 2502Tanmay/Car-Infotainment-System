const API_BASE_URL = 'http://localhost:8080/api';

/* ---------------- FETCH DATA ---------------- */
async function fetchLatestData() {
    try {
        const response = await fetch(`${API_BASE_URL}/latest`);
        if (!response.ok) throw new Error("Fetch failed");

        const data = await response.json();
        updateDashboard(data);
    } catch (error) {
        console.error(error);
        showError("Unable to fetch latest car data");
    }
}

/* ---------------- UPDATE DASHBOARD ---------------- */
function updateDashboard(data) {
    // Update temperature
    const tempElement = document.querySelector('.temp-value');
    if (tempElement && data.temp != null) {
        tempElement.textContent = `${Math.round(data.temp)} °C`;
    }

    // Update seatbelt status
    const seatbeltElement = document.querySelector('.seatbelt-status');
    if (seatbeltElement) {
        seatbeltElement.textContent = data.seat_belt_status ? 'Buckled' : 'Unbuckled';
        seatbeltElement.classList.remove('buckled', 'unbuckled');
        seatbeltElement.classList.add(data.seat_belt_status ? 'buckled' : 'unbuckled');
    }

    // Update tire pressure sensors
    updateSensor('.fl', data.tire_pressure_1);
    updateSensor('.fr', data.tire_pressure_2);
    updateSensor('.rl', data.tire_pressure_3);
    updateSensor('.rr', data.tire_pressure_4);
}

/* ---------------- SENSOR STATUS ---------------- */
function updateSensor(selector, value) {
    const sensor = document.querySelector(`.sensor${selector}`);
    if (!sensor || value == null) return;

    sensor.querySelector('.sensor-value').textContent = Math.round(value);

    sensor.classList.remove('normal', 'warning', 'critical');

    if (value < 28) {
        sensor.classList.add('critical');
    } else if (value <= 35) {
        sensor.classList.add('normal');
    } else {
        sensor.classList.add('warning');
    }
}

/* ---------------- ERROR UI ---------------- */
function showError(message) {
    const div = document.createElement('div');
    div.className = 'error-message';
    div.textContent = message;
    div.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 50, 50, 0.9);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 1000;
    `;
    document.body.appendChild(div);

    setTimeout(() => div.remove(), 4000);
}

/* ---------------- AUTO REFRESH ---------------- */
document.addEventListener('DOMContentLoaded', () => {
    fetchLatestData();
    setInterval(fetchLatestData, 5000);
});

/* ---------------- LOGOUT ---------------- */
function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}