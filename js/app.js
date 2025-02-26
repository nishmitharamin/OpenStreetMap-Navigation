// app.js
// Global variables that will be shared across files
let map;
let userMarker;
let destinationMarker;
let userPosition = null;
let destinationPosition = null;

// Make these variables available globally so they can be accessed from other files
window.map = null;
window.userPosition = null;
window.destinationPosition = null;

// Initialize the application
function initApp() {
  console.log("Initializing application...");
  try {
    // Initialize map with a fallback view if geolocation fails
    map = L.map("map").setView([20.5937, 78.9629], 5); // Default view centered on India
    window.map = map; // Make map globally available

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add a locate control to the map
    L.control
      .locate({
        position: "topright",
        strings: {
          title: "Show my location",
        },
        locateOptions: {
          enableHighAccuracy: true,
        },
      })
      .addTo(map);

    console.log("Map initialized successfully");

    // Set up event listeners
    document
      .getElementById("set-destination")
      .addEventListener("click", setDestination);
    document
      .getElementById("start-navigation")
      .addEventListener("click", function () {
        // Call the startNavigation function from routing.js
        window.startNavigation();
      });
    document
      .getElementById("toggle-draw")
      .addEventListener("click", function () {
        // Call the toggleDrawMode function from areas.js
        window.toggleDrawMode();
      });
    console.log("Event listeners set up");

    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(
            "Got user position:",
            position.coords.latitude,
            position.coords.longitude
          );
          userPosition = [position.coords.latitude, position.coords.longitude];
          window.userPosition = userPosition; // Make userPosition globally available
          map.setView(userPosition, 13);

          // Create user marker
          userMarker = L.marker(userPosition, {
            icon: L.icon({
              iconUrl:
                "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
            }),
          }).addTo(map);
          userMarker.bindPopup("Your Location").openPopup();
        },
        (error) => {
          console.error("Error getting location:", error.message);
          alert("Could not get your location. Using default view.");
        }
      );

      // Watch position for real-time updates
      navigator.geolocation.watchPosition(
        (position) => {
          userPosition = [position.coords.latitude, position.coords.longitude];
          window.userPosition = userPosition; // Update global userPosition
          if (userMarker) {
            userMarker.setLatLng(userPosition);

            // If we have a destination and are in navigation mode, update the route
            if (destinationPosition && window.isNavigating) {
              window.updateRoute();
            }
          }
        },
        (error) => {
          console.error("Error watching position:", error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  } catch (error) {
    console.error("Error initializing app:", error);
    alert(
      "There was an error initializing the application. Please check console for details."
    );
  }
}

// Set destination from input
function setDestination() {
  console.log("Setting destination...");
  const input = document.getElementById("destination").value;

  // Use a regular expression to match latitude and longitude format
  const regex = /^[-+]?\d+(\.\d+)?,\s*[-+]?\d+(\.\d+)?$/;

  if (regex.test(input)) {
    const coordinates = input
      .split(",")
      .map((coord) => parseFloat(coord.trim()));
    console.log("Valid coordinates:", coordinates);
    destinationPosition = coordinates;
    window.destinationPosition = destinationPosition; // Make destinationPosition globally available

    // If there's already a destination marker, update it
    if (destinationMarker) {
      destinationMarker.setLatLng(destinationPosition);
    } else {
      // Create a new destination marker
      destinationMarker = L.marker(destinationPosition, {
        icon: L.icon({
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        }),
      }).addTo(map);
    }

    destinationMarker.bindPopup("Destination").openPopup();

    // Adjust map view to show both user and destination
    if (userPosition) {
      const bounds = L.latLngBounds(userPosition, destinationPosition);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView(destinationPosition, 13);
    }
  } else {
    alert(
      "Please enter valid coordinates in the format 'latitude, longitude'."
    );
  }
}

// Initialize when the DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);
