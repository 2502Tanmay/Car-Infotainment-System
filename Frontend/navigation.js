// Initialize the map
document.addEventListener('DOMContentLoaded', function() {
    // Coordinates for the location shown (appears to be near Pune, India)
    const map = L.map('map').setView([18.8, 73.5], 10);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Add a marker
    const marker = L.marker([18.8, 73.5]).addTo(map);
    marker.bindPopup('Current Location').openPopup();
});