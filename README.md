# OpenStreetMap-Navigation

This web application uses OpenStreetMap to provide real-time routing and area definition functionalities.

## Features

1. Real-Time Routing: Calculate and display the estimated travel time and directions from a moving point to a static destination point.
2. Closed Area Definition: Allow users to define closed areas on the map by drawing shapes like polygons, rectangles, and circles.

## How to Use

### Setting Up

1. Clone this repository or download the files
2. Open `index.html` in a web browser (Chrome, Firefox, etc.)

### Navigation

1. Allow the browser to access your location when prompted
2. Enter destination coordinates in the format "latitude, longitude" (e.g., "19.0760, 72.8777" for Mumbai)
3. Click "Set Destination" to mark the destination on the map
4. Click "Start Navigation" to see the route, estimated travel time, and distance

### Drawing Areas

1. Click "Toggle Draw Mode" to activate drawing tools
2. Use the drawing tools to create shapes on the map:
   - Polygon: Create custom shapes by clicking points on the map
   - Rectangle: Click and drag to create rectangles
   - Circle: Click and drag to create circles
3. After drawing, the shape will display its area in square kilometers
4. Use the edit tools to modify or delete existing shapes

## Technical Details

This application uses:
- Leaflet.js for map rendering
- Leaflet Routing Machine for navigation
- Leaflet.draw for shape drawing capabilities
- OpenStreetMap as the map data source

## Note

Internet connection is required for the application to work properly as it fetches map data from OpenStreetMap servers.
