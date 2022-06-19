// Store our API endpoint inside queryUrl
queryURL= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Define a function we want to run once for each feature in the features array
// Give each feature a popup describing the place and time of the earthquake
function popUpMsg(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
}

 // Define streetmap and darkmap layers
var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    tileSize: 514,
    maxZoom: 19,
    zoomOffset: -1
  });

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    maxZoom: 18
  });


// Define a baseMaps object to hold our base layers
var baseMaps = {
    "Street Map": streetmap,
    "Topographic Map": topo
    };

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
    center: [ 37.09, -95.71 ],
    zoom: 5,
    layers: [streetmap]     //default selected layer
    });

// create layer; will attach data later on
var earthquakes = L.layerGroup();

// Create overlay object to hold our overlay layer
var overlayMaps = {
  Earthquakes: earthquakes
};

// Create a layer control
// Pass in our baseMaps and overlayMaps
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);


// Perform a GET request to the query URL
d3.json(queryURL).then(function(data) {
    
    // Create a GeoJSON layer containing markers that vary in size based on earthquake magnitude
    // Run the onEachFeature function once for each piece of data in the array
    L.geoJSON(data, {
        pointToLayer: function(feature, layer){
            return new L.CircleMarker(layer, {
               radius: (feature.properties.mag)*3,
               fillColor: feature.properties.mag,
               weight: 0.6,
            });
        },
        onEachFeature: popUpMsg
    }).addTo(earthquakes);
  
    earthquakes.addTo(myMap);
});