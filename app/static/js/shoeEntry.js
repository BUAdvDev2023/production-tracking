/**
 * shoeEntry.js
 * This file contains functions for rendering the shoe entry page,
 * submitting shoe entries, and viewing shoe data.
 */

// Renders the shoe entry page
export function renderShoeEntryPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        ${renderNavBar()}
        <h1>Enter Shoe Details</h1>
        <form id="shoeEntryForm" style="display: grid; grid-template-columns: auto 1fr; gap: 10px; align-items: center;">
            <label for="modelSelect">Model Name:</label>
            <select id="modelSelect" name="model_name" required>
                <option value="">Select Model</option>
                <!-- This will be populated dynamically -->
            </select>
            <label for="serialNumber">Serial Number:</label>
            <input type="text" id="serialNumber" name="serial_number" required>
            <label for="batchNumber">Batch Number:</label>
            <input type="text" id="batchNumber" name="batch_number" required>
            <label for="brand">Brand:</label>
            <input type="text" id="brand" readonly>
            <label for="category">Category:</label>
            <input type="text" id="category" readonly>
            <label for="gender">Gender:</label>
            <input type="text" id="gender" readonly>
            <label for="material">Material:</label>
            <input type="text" id="material" readonly>
            <label for="soleType">Sole Type:</label>
            <input type="text" id="sole_type" readonly>
            <label for="closureType">Closure Type:</label>
            <input type="text" id="closure_type" readonly>
            <label for="color">Color:</label>
            <input type="text" id="color" readonly>
            <label for="weightGrams">Weight (grams):</label>
            <input type="text" id="weight_grams" readonly>
            <div style="grid-column: span 2; justify-self: center;">
                <button type="submit">Send</button>
            </div>
        </form>
        <p>
            <a href="#" onclick="renderMainPage()">Home</a>
            <a href="#" onclick="renderViewDataPage()">View Database Contents</a>
            <a href="#" onclick="logout()">Logout</a>
        </p>
    `;

    // Populate model dropdown
    fetch('/api/shoe_models')
    .then(response => response.json())
    .then(models => {
        const select = document.getElementById('modelSelect');
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model.model_name;
            option.textContent = model.model_name;
            select.appendChild(option);
        });
    });

    // Add event listener for model selection
    document.getElementById('modelSelect').addEventListener('change', function(e) {
        const selectedModel = e.target.value;
        fetch(`/api/shoe_model_details/${selectedModel}`)
        .then(response => response.json())
        .then(modelDetails => {
            document.getElementById('brand').value = modelDetails.brand;
            document.getElementById('category').value = modelDetails.category;
            document.getElementById('gender').value = modelDetails.gender;
            document.getElementById('material').value = modelDetails.material;
            document.getElementById('sole_type').value = modelDetails.sole_type;
            document.getElementById('closure_type').value = modelDetails.closure_type;
            document.getElementById('color').value = modelDetails.color;
            document.getElementById('weight_grams').value = modelDetails.weight_grams;
        });
    });

    document.getElementById('shoeEntryForm').addEventListener('submit', (e) => {
        e.preventDefault();
        submitShoeEntry(e.target);
    });
}

// Submits the shoe entry form data
export function submitShoeEntry(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    fetch('/api/shoe_entry', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert(result.message);
            form.reset();
        } else {
            alert('Error: ' + result.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while submitting the form.');
    });
}

// Renders the page for viewing shoe data
export function renderViewDataPage() {
    fetch('/api/view_shoes')
    .then(response => response.json())
    .then(shoes => {
        const app = document.getElementById('app');
        app.innerHTML = `
            ${renderNavBar()}
            <h1>Shoe Database Contents</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Model Name</th>
                        <th>Serial Number</th>
                        <th>Batch Number</th>
                        <th>Shoe Type</th>
                        <th>Size</th>
                        <th>Brand</th>
                        <th>Shoe Model ID</th>
                        <th>Created At</th>
                        <th>Created By</th>
                    </tr>
                </thead>
                <tbody>
                    ${shoes.map(shoe => `
                        <tr>
                            <td>${shoe.id}</td>
                            <td>${shoe.model_name}</td>
                            <td>${shoe.serial_number}</td>
                            <td>${shoe.batch_number}</td>
                            <td>${shoe.shoe_type}</td>
                            <td>${shoe.size}</td>
                            <td>${shoe.brand}</td>
                            <td>${shoe.shoe_model_id || 'N/A'}</td>
                            <td>${shoe.created_at || 'N/A'}</td>
                            <td>${shoe.created_by || 'N/A'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <button onclick="renderMainPage()">Back to Main Page</button>
            <button onclick="renderShoeEntryPage()">Back to Shoe Entry</button>
            <button onclick="logout()">Logout</button>
        `;
    });
}