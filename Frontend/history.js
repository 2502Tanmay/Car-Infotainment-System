const API_BASE_URL = 'http://localhost:8080/api';
let historyData = []; // Store data globally for PDF generation

// Fetch all historical data
async function fetchHistoryData() {
    try {
        const response = await fetch(`${API_BASE_URL}/all`);
        if (!response.ok) {
            throw new Error('Failed to fetch history data');
        }
        const data = await response.json();
        historyData = data; // Store for PDF generation
        populateHistoryTable(data);
    } catch (error) {
        console.error('Error fetching history:', error);
        showError('Unable to fetch history data');
    }
}

// Populate history table with data
function populateHistoryTable(dataArray) {
    const tbody = document.querySelector('.history-table tbody');
    tbody.innerHTML = ''; // Clear existing rows
    
    dataArray.forEach((data) => {
        const row = document.createElement('tr');
        
        // Format timestamp
        const timestamp = new Date(data.timeOfInput);
        const formattedDate = timestamp.toLocaleDateString('en-GB');
        const formattedTime = timestamp.toLocaleTimeString('en-US', { 
            hour12: true, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        
        row.innerHTML = `
            <td>${data.id}</td>
            <td>${Math.round(data.tire_pressure_1)}</td>
            <td>${Math.round(data.tire_pressure_2)}</td>
            <td>${Math.round(data.tire_pressure_3)}</td>
            <td>${Math.round(data.tire_pressure_4)}</td>
            <td>${Math.round(data.temp)}</td>
            <td>${data.seat_belt_status ? 'Yes' : 'No'}</td>
            <td>${formattedDate},<br>${formattedTime}</td>
        `;
        
        tbody.appendChild(row);
    });
}

// Download PDF with BMW logo and header
async function downloadPDF() {
    if (historyData.length === 0) {
        alert('No data available to export');
        return;
    }

    try {
        // Check if jsPDF is available
        if (typeof window.jsPDF === 'undefined') {
            throw new Error('jsPDF library not loaded');
        }
        
        const doc = new window.jsPDF('l', 'mm', 'a4'); // Landscape orientation

        // Add BMW logo (base64 encoded) - Temporarily removed due to format issues
        // TODO: Add proper base64 encoded logo or image URL
        // const bmwLogoBase64 = 'data:image/webp;base64,YOUR_BASE64_DATA_HERE';
        // doc.addImage(bmwLogoBase64, 'WEBP', 240, 10, 30, 30);

        // Add header
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('Car Data History', 20, 20);

        // Add car information
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Car Name: BMW X3', 20, 30);
        doc.text('Car Number: BR 06 GX 5643', 20, 37);

        // Add line separator
        doc.setDrawColor(0, 212, 255);
        doc.setLineWidth(0.5);
        doc.line(20, 42, 277, 42);

        // Prepare table data
        const tableData = historyData.map(item => {
            const timestamp = new Date(item.timeOfInput);
            const formattedTimestamp = timestamp.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });

            return [
                item.id,
                Math.round(item.tire_pressure_1),
                Math.round(item.tire_pressure_2),
                Math.round(item.tire_pressure_3),
                Math.round(item.tire_pressure_4),
                Math.round(item.temp),
                item.seat_belt_status ? 'Yes' : 'No',
                formattedTimestamp
            ];
        });

        // Check if autoTable plugin is available
        if (typeof doc.autoTable === 'undefined') {
            throw new Error('jsPDF autoTable plugin not loaded');
        }

        // Add table using autoTable plugin
        doc.autoTable({
            startY: 48,
            head: [['ID', 'FL (PSI)', 'FR (PSI)', 'RL (PSI)', 'RR (PSI)', 'Temp (°C)', 'Seatbelt', 'Timestamp']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [0, 100, 200],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'center'
            },
            bodyStyles: {
                halign: 'center'
            },
            alternateRowStyles: {
                fillColor: [240, 248, 255]
            },
            margin: { left: 20, right: 20 },
            styles: {
                fontSize: 10,
                cellPadding: 4
            }
        });

        // Add footer with page numbers
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(128);
            doc.text(
                `Page ${i} of ${pageCount}`,
                doc.internal.pageSize.getWidth() / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }

        // Save the PDF
        const today = new Date().toISOString().split('T')[0];
        doc.save(`car-data-history-${today}.pdf`);

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 50, 50, 0.9);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 1000;
    `;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    fetchHistoryData();
    
    // Auto-refresh every 30 seconds
    setInterval(fetchHistoryData, 30000);
});