// areas.js
// Define variables in this file scope, not globally
let drawControl = null;
let drawnItems = null;
let isDrawModeActive = false;

// Initialize draw control
function initDrawControl() {
  // Initialize the FeatureGroup to store editable layers
  drawnItems = new L.FeatureGroup();
  window.map.addLayer(drawnItems);

  // Initialize draw control
  drawControl = new L.Control.Draw({
    draw: {
      marker: false,
      circlemarker: false,
      polyline: false,
      circle: true,
      rectangle: true,
      polygon: {
        allowIntersection: false,
        drawError: {
          color: "#e1e100",
          message: "<strong>Error:</strong> Polygon edges cannot intersect!",
        },
        shapeOptions: {
          color: "#f06eaa",
        },
      },
    },
    edit: {
      featureGroup: drawnItems,
      remove: true,
    },
  });
}

// Toggle draw mode - make it globally accessible
window.toggleDrawMode = function () {
  isDrawModeActive = !isDrawModeActive;

  if (isDrawModeActive) {
    document.getElementById("toggle-draw").textContent = "Exit Draw Mode";

    // Initialize draw control if not already initialized
    if (!drawControl) {
      initDrawControl();
    }

    window.map.addControl(drawControl);

    // Add draw event handler
    window.map.on(L.Draw.Event.CREATED, onDrawCreated);
    window.map.on(L.Draw.Event.EDITED, onDrawEdited);
    window.map.on(L.Draw.Event.DELETED, onDrawDeleted);
  } else {
    document.getElementById("toggle-draw").textContent = "Toggle Draw Mode";

    if (drawControl) {
      window.map.removeControl(drawControl);

      // Remove draw event handlers
      window.map.off(L.Draw.Event.CREATED, onDrawCreated);
      window.map.off(L.Draw.Event.EDITED, onDrawEdited);
      window.map.off(L.Draw.Event.DELETED, onDrawDeleted);
    }
  }
};

// Handle draw created event
function onDrawCreated(e) {
  const layer = e.layer;
  drawnItems.addLayer(layer);

  // Get area info
  let areaInfo = "";
  if (layer instanceof L.Polygon) {
    const latlngs = layer.getLatLngs()[0];
    const area = L.GeometryUtil.geodesicArea(latlngs);
    areaInfo = `Area: ${(area / 1000000).toFixed(2)} km²`;
  } else if (layer instanceof L.Circle) {
    const radius = layer.getRadius();
    const area = Math.PI * radius * radius;
    areaInfo = `Area: ${(area / 1000000).toFixed(2)} km²`;
  } else if (layer instanceof L.Rectangle) {
    const bounds = layer.getBounds();
    const latlngs = [
      bounds.getSouthWest(),
      bounds.getNorthWest(),
      bounds.getNorthEast(),
      bounds.getSouthEast(),
    ];
    const area = L.GeometryUtil.geodesicArea(latlngs);
    areaInfo = `Area: ${(area / 1000000).toFixed(2)} km²`;
  }

  // Add a popup with area information
  if (areaInfo) {
    layer.bindPopup(areaInfo).openPopup();
  }
}

// Handle edit event
function onDrawEdited(e) {
  const layers = e.layers;

  layers.eachLayer(function (layer) {
    // Update area information
    let areaInfo = "";

    if (layer instanceof L.Polygon) {
      const latlngs = layer.getLatLngs()[0];
      const area = L.GeometryUtil.geodesicArea(latlngs);
      areaInfo = `Area: ${(area / 1000000).toFixed(2)} km²`;
    } else if (layer instanceof L.Circle) {
      const radius = layer.getRadius();
      const area = Math.PI * radius * radius;
      areaInfo = `Area: ${(area / 1000000).toFixed(2)} km²`;
    } else if (layer instanceof L.Rectangle) {
      const bounds = layer.getBounds();
      const latlngs = [
        bounds.getSouthWest(),
        bounds.getNorthWest(),
        bounds.getNorthEast(),
        bounds.getSouthEast(),
      ];
      const area = L.GeometryUtil.geodesicArea(latlngs);
      areaInfo = `Area: ${(area / 1000000).toFixed(2)} km²`;
    }

    // Update popup with new area information
    if (areaInfo) {
      layer.setPopupContent(areaInfo);
      if (layer.isPopupOpen()) {
        layer.openPopup();
      }
    }
  });
}

// Handle delete event
function onDrawDeleted(e) {
  // No need for specific handling here as the layer gets removed automatically
}
