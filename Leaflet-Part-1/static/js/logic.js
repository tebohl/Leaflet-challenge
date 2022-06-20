// Store our API endpoint inside queryUrl
var queryURL= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Define a function we want to run once for each feature in the features array
// Give each feature a popup describing the place and time of the earthquake
function popUpMsg(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
}
 // Define streetmap layer
var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  });

// Define a baseMaps object to hold our base layers
var baseMaps = {
    "Street Map": streetmap
    };
// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
    center: [ 37.09, -95.71 ],
    zoom: 4,
    layers: [streetmap]
    });
// Create layer; will attach data later on
var earthquakes = L.layerGroup();
// Create overlay object to hold our overlay layer
var overlayMaps = {
  Earthquakes: earthquakes
};
// Create a layer control
// Pass in our baseMaps and overlayMaps
L.control.layers(null, overlayMaps, {
  collapsed: false
}).addTo(myMap);

// Perform a GET request to the query URL
d3.json(queryURL).then(function(data) {    
    // Create a GeoJSON layer containing markers that vary in size based on earthquake magnitude
    // Run the onEachFeature function once for each piece of data in the array for pop up
    L.geoJSON(data, {
        pointToLayer: function(feature, layer){
            return new L.CircleMarker(layer, {
               radius: (feature.properties.mag)*4,
               fillColor: depthColor(feature.geometry.coordinates[2]),
               weight: 0.8,
               color: "#000000",
               fillOpacity: 0.8,
            });
        },
        onEachFeature: popUpMsg
    }).addTo(earthquakes);
    earthquakes.addTo(myMap);
});

//Function to create color scale for depth
function depthColor(depth){
    if (depth <10) {
        return "#CCFFCC";
    }
    else if (depth <20) {
        return "#339966";
    }
    else if (depth <30) {
        return "#008000";
    }
    else if (depth <40) {
        return "#99CC00";
    }
    else if (depth <50) {
        return "#003300";
    }
    else {
        return "#333333";
    }
}
// Create a legend to display information about our map.
var legend = L.control({
    position: "bottomright"
  });
// When the layer control is added, insert a div with the class of "legend".
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");  
    var legendHTML = "<h4>Earthquake Depth (km)</h4>";
    for (var d = 0; d <= 50; d+=10){
        if (d < 10) {
            legendHTML += `<p> &lt; 10: <i style='background: ${depthColor(d)}'></i></p>`;
        }
        else if (d < 50) {
            legendHTML += `<p>${d} - ${d+10}: <i style='background: ${depthColor(d)}'></i></p>`;
        }
        else {
            legendHTML += `<p> &gt; ${d}: <i style='background: ${depthColor(d)}'></i></p>`;
        }
    }
    div.innerHTML += legendHTML;
    return div;
};
// Add the info legend to the map.
legend.addTo(myMap);
