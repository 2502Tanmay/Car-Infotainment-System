const API_BASE_URL = 'http://localhost:8080/api';

/* ---------------- PAGE LOAD ---------------- */
document.addEventListener('DOMContentLoaded', function () {

    // Simulator-only access check
    if (sessionStorage.getItem('loginType') !== 'simulator') {
        window.location.href = 'login.html';
        return;
    }

    initializeInputs();
    loadSubmissionHistory();
});

/* ---------------- INITIALIZATION ---------------- */
function initializeInputs() {

    syncInputWithSlider('tire_pressure_1', 'tire_pressure_1Slider');
    syncInputWithSlider('tire_pressure_2', 'tire_pressure_2Slider');
    syncInputWithSlider('tire_pressure_3', 'tire_pressure_3Slider');
    syncInputWithSlider('tire_pressure_4', 'tire_pressure_4Slider');
    syncInputWithSlider('temp', 'tempSlider');

    document.getElementById('seatbelt').addEventListener('change', () => {
        updateSeatbeltLabel();
        updatePreview();
    });

    document.getElementById('submitBtn').addEventListener('click', submitData);

    updateSeatbeltLabel();
    updatePreview();
}

function syncInputWithSlider(inputId, sliderId) {
    const input = document.getElementById(inputId);
    const slider = document.getElementById(sliderId);

    input.addEventListener('input', () => {
        slider.value = input.value;
        updatePreview();
    });

    slider.addEventListener('input', () => {
        input.value = slider.value;
        updatePreview();
    });
}

/* ---------------- LIVE PREVIEW ---------------- */
function updatePreview() {

    const tires = ['tire_pressure_1', 'tire_pressure_2', 'tire_pressure_3', 'tire_pressure_4'];

    tires.forEach((tire, index) => {
        const value = parseFloat(document.getElementById(tire).value);
        const preview = document.getElementById(`previewtire_pressure_${index + 1}`);
        preview.textContent = Math.round(value);
        updateSensorColor(preview.parentElement, value);
    });

    const tempC = parseFloat(document.getElementById('temp').value);
    document.getElementById('tempCelsius').textContent = tempC.toFixed(1);
    document.getElementById('tempKelvin').textContent = (tempC + 273.15).toFixed(2);
    document.getElementById('previewTemp').textContent = `${tempC.toFixed(1)}°C`;

    const seatbelt = document.getElementById('seatbelt').checked;
    const seatbeltPreview = document.getElementById('previewSeatbelt');
    seatbeltPreview.textContent = seatbelt ? 'Buckled' : 'Unbuckled';
    seatbeltPreview.style.color = seatbelt ? '#32ff32' : '#ff3232';
}

function updateSensorColor(element, pressure) {
    element.classList.remove('warning', 'critical');

    if (pressure < 28) {
        element.classList.add('critical');
    } else if (pressure > 35) {
        element.classList.add('warning');
    }
}

function updateSeatbeltLabel() {
    const label = document.getElementById('seatbeltLabel');
    const checked = document.getElementById('seatbelt').checked;

    label.textContent = checked ? 'Buckled' : 'Unbuckled';
    label.style.color = checked ? '#32ff32' : '#ff3232';
}

/* ---------------- PRESET DATA ---------------- */
function setNormalData() {
    setData([32, 32, 31, 32], 25, true);
}

function setWarningData() {
    setData([36, 37, 35, 38], 35, false);
}

function setCriticalData() {
    setData([25, 26, 24, 48], 40, false);
}

function setRandomData() {
    const rand = () => (Math.random() * 30 + 20).toFixed(1);
    setData([rand(), rand(), rand(), rand()], (Math.random() * 30 + 15).toFixed(1), Math.random() > 0.5);
}

function setData(tires, temp, seatbelt) {
    ['tire_pressure_1','tire_pressure_2','tire_pressure_3','tire_pressure_4'].forEach((id, i) => {
        document.getElementById(id).value = tires[i];
        document.getElementById(id + 'Slider').value = tires[i];
    });

    document.getElementById('temp').value = temp;
    document.getElementById('tempSlider').value = temp;

    document.getElementById('seatbelt').checked = seatbelt;

    updateSeatbeltLabel();
    updatePreview();
}

/* ---------------- SUBMIT DATA ---------------- */
function submitData() {

    const payload = {
        tire_pressure_1: parseFloat(document.getElementById('tire_pressure_1').value),
        tire_pressure_2: parseFloat(document.getElementById('tire_pressure_2').value),
        tire_pressure_3: parseFloat(document.getElementById('tire_pressure_3').value),
        tire_pressure_4: parseFloat(document.getElementById('tire_pressure_4').value),
        temp: parseFloat(document.getElementById('temp').value),
        seat_belt_status: document.getElementById('seatbelt').checked
    };

    // FIXED: Use correct endpoint matching backend
    fetch(`${API_BASE_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (!res.ok) throw new Error("POST failed");
        return res.json();
    })
    .then(() => {
        showStatus('✅ Data sent successfully', true);
        loadSubmissionHistory();
    })
    .catch(err => {
        console.error(err);
        showStatus('❌ Failed to send data', false);
    });
}


function showStatus(message, success) {
    const status = document.getElementById('statusMessage');
    status.textContent = message;
    status.style.color = success ? '#32ff32' : '#ff3232';
    status.style.display = 'block';

    setTimeout(() => {
        status.textContent = '';
        status.style.display = 'none';
    }, 3000);
}

/* ---------------- HISTORY ---------------- */
function loadSubmissionHistory() {

    fetch(`${API_BASE_URL}/all`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('submissionHistory');
            container.innerHTML = '';

            if (data.length === 0) {
                container.innerHTML = '<p style="color: #888;">No submissions yet</p>';
                return;
            }

            // Show only the last 5 submissions, most recent first
            const recentData = data.slice(-5).reverse();

            recentData.forEach(item => {
                const timestamp = new Date(item.timeOfInput).toLocaleString();
                container.innerHTML += `
                    <div class="submission-item">
                        <div class="submission-time">${timestamp}</div>
                        <div class="submission-data">
                            Tires: FL=${Math.round(item.tire_pressure_1)}, 
                            FR=${Math.round(item.tire_pressure_2)}, 
                            RL=${Math.round(item.tire_pressure_3)}, 
                            RR=${Math.round(item.tire_pressure_4)} PSI | 
                            Temp: ${Math.round(item.temp)}°C | 
                            Seatbelt: ${item.seat_belt_status ? 'Buckled' : 'Unbuckled'}
                        </div>
                    </div>
                `;
            });
        })
        .catch(err => {
            console.error('Error loading history:', err);
            document.getElementById('submissionHistory').innerHTML = 
                '<p style="color: #ff3232;">Failed to load history</p>';
        });
}

/* ---------------- LOGOUT ---------------- */
function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}