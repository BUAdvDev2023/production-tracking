/**
 * shoeModel.js
 * This file contains functions for managing shoe models,
 * including creating, viewing, editing, and deleting shoe models.
 */

// Renders the page for entering new shoe models
export function renderShoeModelEntryPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        ${renderNavBar()}
        <h1>Enter New Shoe Model</h1>
        <form id="shoeModelEntryForm" style="display: flex; flex-direction: column; gap: 10px;">
            <input type="text" name="model_name" placeholder="Model Name" required>
            <select name="brand" required>
                <option value="">Select Brand</option>
                <option value="Nike">Nike</option>
                <option value="Adidas">Adidas</option>
                <option value="Puma">Puma</option>
                <option value="Reebok">Reebok</option>
            </select>
            <select name="category" required>
                <option value="">Select Category</option>
                <option value="Running">Running</option>
                <option value="Basketball">Basketball</option>
                <option value="Casual">Casual</option>
                <option value="Football">Football</option>
            </select>
            <select name="gender" required>
                <option value="">Select Gender</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
            </select>
            <select name="material" required>
                <option value="">Select Material</option>
                <option value="Leather">Leather</option>
                <option value="Synthetic">Synthetic</option>
                <option value="Canvas">Canvas</option>
                <option value="Knit">Knit</option>
            </select>
            <select name="sole_type" required>
                <option value="">Select Sole Type</option>
                <option value="Rubber">Rubber</option>
                <option value="EVA">EVA</option>
                <option value="PU">PU</option>
                <option value="TPU">TPU</option>
            </select>
            <select name="closure_type" required>
                <option value="">Select Closure Type</option>
                <option value="Lace-up">Lace-up</option>
                <option value="Slip-on">Slip-on</option>
                <option value="Velcro">Velcro</option>
                <option value="Buckle">Buckle</option>
            </select>
            <select name="color" required>
                <option value="">Select Color</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Red">Red</option>
                <option value="Blue">Blue</option>
            </select>
            <input type="number" name="weight_grams" placeholder="Weight (grams)" required>
            <input type="number" name="price" placeholder="Price" step="0.01" required>
            <input type="date" name="release_date" required>
            <button type="submit">Add Shoe Model</button>
        </form>
        <button onclick="renderMainPage()">Back to Main Page</button>
    `;
    document.getElementById('shoeModelEntryForm').addEventListener('submit', (e) => {
        e.preventDefault();
        submitShoeModel(e.target);
    });
}

// Submits a new shoe model
export function submitShoeModel(form) {
    const formData = new FormData(form);
    fetch('/api/add_shoe_model', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            renderMainPage();
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while submitting the shoe model.');
    });
}

// Renders the page for viewing shoe models
export function renderViewShoeModelsPage() {
    Promise.all([
        fetch('/api/shoe_models').then(response => response.json()),
        fetch('/api/users').then(response => response.json()),
        fetch('/api/shoe_models_and_operators').then(response => response.json())
    ])
    .then(([models, users, modelsAndOperators]) => {
        const app = document.getElementById('app');
        app.innerHTML = `
            ${renderNavBar()}
            <h1>Shoe Models</h1>
            <table>
                <thead>
                    <tr>
                        <th>Model Name</th>
                        <th>Brand</th>
                        <th>Category</th>
                        <th>Gender</th>
                        <th>Material</th>
                        <th>Sole Type</th>
                        <th>Closure Type</th>
                        <th>Color</th>
                        <th>Weight (g)</th>
                        <th>Price</th>
                        <th>Release Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${models.map(model => `
                        <tr>
                            <td>${model.model_name}</td>
                            <td>${model.brand}</td>
                            <td>${model.category}</td>
                            <td>${model.gender}</td>
                            <td>${model.material}</td>
                            <td>${model.sole_type}</td>
                            <td>${model.closure_type}</td>
                            <td>${model.color}</td>
                            <td>${model.weight_grams}</td>
                            <td>${model.price}</td>
                            <td>${model.release_date}</td>
                            <td>
                                <!--<button onclick="editShoeModel(${JSON.stringify(model)})">Edit</button>-->
                                <button onclick="deleteShoeModel(${model.id})">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        updateShoeCreationChart();
        document.getElementById('downloadChartBtn').addEventListener('click', downloadChart);
    });
}

// Deletes a shoe model
export function deleteShoeModel(modelId) {
    if (confirm('Are you sure you want to delete this shoe model?')) {
        fetch(`/api/delete_shoe_model/${modelId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                renderViewShoeModelsPage();
            } else {
                alert(data.message);
            }
        });
    }
}

// Renders the page for editing a shoe model
export function editShoeModel(model) {
    const app = document.getElementById('app');
    app.innerHTML = `
        ${renderNavBar()}
        <h1>Edit Shoe Model</h1>
        <form id="editShoeModelForm" style="display: flex; flex-direction: column; gap: 10px;">
            <input type="text" name="model_name" placeholder="Model Name" value="${model.model_name}" required>
            <select name="brand" required>
                <option value="Nike" ${model.brand === 'Nike' ? 'selected' : ''}>Nike</option>
                <option value="Adidas" ${model.brand === 'Adidas' ? 'selected' : ''}>Adidas</option>
                <option value="Puma" ${model.brand === 'Puma' ? 'selected' : ''}>Puma</option>
                <option value="Reebok" ${model.brand === 'Reebok' ? 'selected' : ''}>Reebok</option>
            </select>
            <select name="category" required>
                <option value="Running" ${model.category === 'Running' ? 'selected' : ''}>Running</option>
                <option value="Basketball" ${model.category === 'Basketball' ? 'selected' : ''}>Basketball</option>
                <option value="Casual" ${model.category === 'Casual' ? 'selected' : ''}>Casual</option>
                <option value="Football" ${model.category === 'Football' ? 'selected' : ''}>Football</option>
            </select>
            <select name="gender" required>
                <option value="Men" ${model.gender === 'Men' ? 'selected' : ''}>Men</option>
                <option value="Women" ${model.gender === 'Women' ? 'selected' : ''}>Women</option>
                <option value="Unisex" ${model.gender === 'Unisex' ? 'selected' : ''}>Unisex</option>
            </select>
            <select name="material" required>
                <option value="Leather" ${model.material === 'Leather' ? 'selected' : ''}>Leather</option>
                <option value="Synthetic" ${model.material === 'Synthetic' ? 'selected' : ''}>Synthetic</option>
                <option value="Canvas" ${model.material === 'Canvas' ? 'selected' : ''}>Canvas</option>
                <option value="Knit" ${model.material === 'Knit' ? 'selected' : ''}>Knit</option>
            </select>
            <select name="sole_type" required>
                <option value="Rubber" ${model.sole_type === 'Rubber' ? 'selected' : ''}>Rubber</option>
                <option value="EVA" ${model.sole_type === 'EVA' ? 'selected' : ''}>EVA</option>
                <option value="PU" ${model.sole_type === 'PU' ? 'selected' : ''}>PU</option>
                <option value="TPU" ${model.sole_type === 'TPU' ? 'selected' : ''}>TPU</option>
            </select>
            <select name="closure_type" required>
                <option value="Lace-up" ${model.closure_type === 'Lace-up' ? 'selected' : ''}>Lace-up</option>
                <option value="Slip-on" ${model.closure_type === 'Slip-on' ? 'selected' : ''}>Slip-on</option>
                <option value="Velcro" ${model.closure_type === 'Velcro' ? 'selected' : ''}>Velcro</option>
                <option value="Buckle" ${model.closure_type === 'Buckle' ? 'selected' : ''}>Buckle</option>
            </select>
            <select name="color" required>
                <option value="Black" ${model.color === 'Black' ? 'selected' : ''}>Black</option>
                <option value="White" ${model.color === 'White' ? 'selected' : ''}>White</option>
                <option value="Red" ${model.color === 'Red' ? 'selected' : ''}>Red</option>
                <option value="Blue" ${model.color === 'Blue' ? 'selected' : ''}>Blue</option>
            </select>
            <input type="number" name="weight_grams" placeholder="Weight (grams)" value="${model.weight_grams}" required>
            <input type="number" name="price" placeholder="Price" step="0.01" value="${model.price}" required>
            <input type="date" name="release_date" value="${model.release_date}" required>
            <button type="submit">Update Shoe Model</button>
        </form>
        <button onclick="renderViewShoeModelsPage()">Back to Shoe Models</button>
    `;
    document.getElementById('editShoeModelForm').addEventListener('submit', (e) => {
        e.preventDefault();
        updateShoeModel(model.id, e.target);
    });
}
