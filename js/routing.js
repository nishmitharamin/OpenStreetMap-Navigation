// routing.js
// Define variables in this file scope, not globally
let routingControl = null;
let isNavigating = false;

// Make these variables accessible globally
window.isNavigating = false;

// Start navigation between user position and destination
window.startNavigation = function () {
  console.log("Starting navigation..."); // Debugging line

  // Access the global variables from app.js
  console.log(
    "userPosition:",
    window.userPosition,
    "destinationPosition:",
    window.destinationPosition
  );

  if (!window.userPosition) {
    alert("Your location is not available yet.");
    return;
  }

  if (!window.destinationPosition) {
    alert("Please set a destination first.");
    return;
  }

  // Toggle navigation state
  isNavigating = !isNavigating;
  window.isNavigating = isNavigating;

  if (isNavigating) {
    document.getElementById("start-navigation").textContent = "Stop Navigation";
    startRouting();
  } else {
    document.getElementById("start-navigation").textContent =
      "Start Navigation";
    stopRouting();
  }
};

// Initialize routing
function startRouting() {
  // If routing control already exists, remove it first
  if (routingControl) {
    window.map.removeControl(routingControl);
  }

  // Create new routing control
  routingControl = L.Routing.control({
    waypoints: [
      L.latLng(window.userPosition[0], window.userPosition[1]),
      L.latLng(window.destinationPosition[0], window.destinationPosition[1]),
    ],
    routeWhileDragging: true,
    showAlternatives: true,
    lineOptions: {
      styles: [{ color: "#0073FF", opacity: 0.8, weight: 6 }],
    },
    createMarker: function () {
      return null;
    }, // Don't create markers, we already have our own
  }).addTo(window.map);

  // Listen for route calculation results
  routingControl.on("routesfound", function (e) {
    const routes = e.routes;
    const summary = routes[0].summary;

    // Update route information
    document.getElementById(
      "travel-time"
    ).textContent = `Travel time: ${formatTime(summary.totalTime)}`;
    document.getElementById("distance").textContent = `Distance: ${(
      summary.totalDistance / 1000
    ).toFixed(2)} km`;
  });

  routingControl.on("routingerror", function (e) {
    console.error("Routing error:", e);
    alert("Could not find a route.");
  });
}

// Stop routing
function stopRouting() {
  if (routingControl) {
    window.map.removeControl(routingControl);
    routingControl = null;

    // Reset route info
    document.getElementById("travel-time").textContent = "Travel time: --";
    document.getElementById("distance").textContent = "Distance: --";
  }
}

// Update route when user position changes - make it globally accessible
window.updateRoute = function () {
  if (routingControl && isNavigating) {
    routingControl.setWaypoints([
      L.latLng(window.userPosition[0], window.userPosition[1]),
      L.latLng(window.destinationPosition[0], window.destinationPosition[1]),
    ]);
  }
};

// Format time in seconds to human-readable format
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  } else {
    return `${minutes} min`;
  }
}
