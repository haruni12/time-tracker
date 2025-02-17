// Global variables
let watchID;
let startTime;
let distanceTraveled = 0;
let prevPosition = null;
let timerInterval;

// Get elements from the DOM
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const timeElapsedElement = document.getElementById("timeElapsed");
const distanceTraveledElement = document.getElementById("distanceTraveled");
const errorElement = document.getElementById("error");

// Function to start tracking the root
function startRoot() {
    if (navigator.geolocation) {
        startTime = Date.now();
        distanceTraveled = 0;
        prevPosition = null;
        timerInterval = setInterval(updateTime, 1000);  // Update time every second

        // Disable start button and enable stop button
        startButton.disabled = true;
        stopButton.disabled = false;

        // Start tracking the user's location
        watchID = navigator.geolocation.watchPosition(trackPosition, showError, { enableHighAccuracy: true });
    } else {
        // If geolocation is not supported, show error message
        errorElement.style.display = "block";
    }
}

// Function to stop the root tracking
function stopRoot() {
    clearInterval(timerInterval);  // Stop the timer
    navigator.geolocation.clearWatch(watchID);  // Stop tracking the position

    // Enable the start button again
    startButton.disabled = false;
    stopButton.disabled = true;
}

// Function to update time every second
function updateTime() {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    timeElapsedElement.textContent = timeElapsed;
}

// Function to track the user's position and calculate distance
function trackPosition(position) {
    const currentPosition = position.coords;
    
    if (prevPosition) {
        // Calculate the distance between two points using the Haversine formula
        const R = 6371e3; // Earth radius in meters
        const φ1 = prevPosition.latitude * Math.PI / 180;
        const φ2 = currentPosition.latitude * Math.PI / 180;
        const Δφ = (currentPosition.latitude - prevPosition.latitude) * Math.PI / 180;
        const Δλ = (currentPosition.longitude - prevPosition.longitude) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // in meters
        distanceTraveled += distance;
        distanceTraveledElement.textContent = distanceTraveled.toFixed(2);
    }

    prevPosition = { latitude: currentPosition.latitude, longitude: currentPosition.longitude };
}

// Function to handle errors when geolocation is not available
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

// Event listeners for the buttons
startButton.addEventListener("click", startRoot); // Changed from startJourney to startRoot
stopButton.addEventListener("click", stopRoot);