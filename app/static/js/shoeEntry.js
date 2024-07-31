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
    fetchShoes();
}

export function fetchShoes(searchTerm = '', searchType = 'model_name') {
    fetch(`/api/view_shoes?search=${searchTerm}&type=${searchType}`)
    .then(response => response.json())
    .then(shoes => {
        const app = document.getElementById('app');
        app.innerHTML = `
            ${renderNavBar()}
            <h1>Produced Shoes</h1>
            <div class="search-container">
                <input type="text" id="searchInput" placeholder="Search..." value="${searchTerm}">
                <select id="searchType">
                    <option value="model_name" ${searchType === 'model_name' ? 'selected' : ''}>Model Name</option>
                    <option value="serial_number" ${searchType === 'serial_number' ? 'selected' : ''}>Serial Number</option>
                    <option value="batch_number" ${searchType === 'batch_number' ? 'selected' : ''}>Batch Number</option>
                    <option value="created_by" ${searchType === 'created_by' ? 'selected' : ''}>Created By</option>
                </select>
                <button onclick="searchShoes()">Search</button>
            </div>
            <table id="shoesTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Model Name</th>
                        <th>Serial Number</th>
                        <th>Batch Number</th>
                        <th>Created At</th>
                        <th>Created By</th>
                    </tr>
                </thead>
                <tbody>
                    ${renderShoeRows(shoes)}
                </tbody>
            </table>
        `;

        // Add event listener for real-time search
        document.getElementById('searchInput').addEventListener('input', debounce(searchShoes, 300));
        document.getElementById('searchType').addEventListener('change', searchShoes);
    });
}

// Searches for shoes based on the search term and type
export function searchShoes() {
    const searchInput = document.getElementById('searchInput').value;
    const searchType = document.getElementById('searchType').value;
    fetchShoes(searchInput, searchType);
}

// Debounce function to limit how often searchShoes gets called
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function renderShoeRows(shoes) {
    return shoes.map(shoe => `
        <tr>
            <td>${shoe.id || 'N/A'}</td>
            <td>${shoe.model_name || 'N/A'}</td>
            <td>${shoe.serial_number || 'N/A'}</td>
            <td>${shoe.batch_number || 'N/A'}</td>
            <td>${shoe.created_at || 'N/A'}</td>
            <td>${shoe.created_by || 'N/A'}</td>
        </tr>
    `).join('');
}