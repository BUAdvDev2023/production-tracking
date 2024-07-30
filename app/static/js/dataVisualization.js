/**
 * dataVisualization.js
 * This file contains functions for creating and managing data visualizations,
 * including rendering the graphs page, updating charts, and downloading chart images.
 */

// Renders the page for creating graphs
export function renderCreateGraphsPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        ${renderNavBar()}
        <h1>Create Graphs</h1>
        <div style="width: 80%; margin: 20px auto;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <select id="modelSelect">
                    <option value="all">All Models</option>
                    <!-- This will be populated dynamically -->
                </select>
                <select id="operatorSelect">
                    <option value="all">All Operators</option>
                    <!-- This will be populated dynamically -->
                </select>
                <input type="date" id="startDate">
                <input type="date" id="endDate">
                <button onclick="updateShoeCreationChart()">Update Chart</button>
            </div>
            <canvas id="shoeCreationChart"></canvas>
            <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                <button id="downloadChartBtn">Download Chart</button>
            </div>
        </div>
    `;

    // Populate model and operator dropdowns
    Promise.all([
        fetch('/api/shoe_models').then(response => response.json()),
        fetch('/api/users').then(response => response.json())
    ])
    .then(([models, users]) => {
        const modelSelect = document.getElementById('modelSelect');
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = model.name;
            modelSelect.appendChild(option);
        });

        const operatorSelect = document.getElementById('operatorSelect');
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.username;
            option.textContent = user.username;
            operatorSelect.appendChild(option);
        });
    });

    document.getElementById('downloadChartBtn').addEventListener('click', downloadChart);
    updateShoeCreationChart();
}

// Updates an existing shoe model
export function updateShoeModel(modelId, form) {
    const formData = new FormData(form);
    fetch(`/api/edit_shoe_model/${modelId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            renderViewShoeModelsPage();
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the shoe model.');
    });
}

// Creates a chart showing shoe creation data
export function createShoeCreationChart(data) {
    const ctx = document.getElementById('shoeCreationChart').getContext('2d');
    
    if (shoeCreationChart) {
        shoeCreationChart.destroy();
    }
    
    shoeCreationChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => item.date),
            datasets: [{
                label: 'Shoes Created',
                data: data.map(item => item.count),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Shoes'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Shoes Created Over Time'
                }
            }
        }
    });
}

// Downloads the current chart as an image
export function downloadChart() {
    const canvas = document.getElementById('shoeCreationChart');
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'shoe_creation_chart.png';
    link.href = dataURL;
    link.click();
}

// Updates the shoe creation chart based on selected filters
export function updateShoeCreationChart() {
    const modelId = document.getElementById('modelSelect').value;
    const operator = document.getElementById('operatorSelect').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    const url = new URL('/api/shoe_creation_data', window.location.origin);
    url.searchParams.append('model_id', modelId);
    url.searchParams.append('operator', operator);
    if (startDate) url.searchParams.append('start_date', startDate);
    if (endDate) url.searchParams.append('end_date', endDate);

    fetch(url)
        .then(response => response.json())
        .then(data => createShoeCreationChart(data));
}