/**
 * app.js
 * This file contains the client-side JavaScript code for the Shoe Database application.
 * It handles rendering different pages, user interactions, and API calls to the server.
 */

// Import modules
import * as auth from './js/auth.js';
import * as navigation from './js/navigation.js';
import * as shoeEntry from './js/shoeEntry.js';
import * as shoeModel from './js/shoeModel.js';
import * as userManagement from './js/userManagement.js';
import * as dataVisualization from './js/dataVisualization.js';
import * as controlPanel from './js/controlPanel.js';

// Global variables
window.currentUser = null;
window.shoeCreationChart = null;

// Assign imported functions to window object
Object.assign(window, auth, navigation, shoeEntry, shoeModel, userManagement, dataVisualization, controlPanel);

// Initial page load logic
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in and render appropriate page
    if (window.currentUser) {
        window.renderMainPage();
    } else {
        window.renderLoginPage();
    }
});