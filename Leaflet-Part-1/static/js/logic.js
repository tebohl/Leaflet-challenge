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
    maxZoom: 19,
  });


// Define a baseMaps object to hold our base layers
var baseMaps = {
    "Street Map": streetmap
    };
// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
    center: [ 37.09, -95.71 ],
    zoom: 5,
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
L.control.layers(baseMaps, overlayMaps, {
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
               fillColor: magnitudeColor(feature.properties.mag),
               weight: 0.6,
               color: "#C0C0C0",
               fillOpacity: 0.6,
            });
        },
        onEachFeature: popUpMsg
    }).addTo(earthquakes);
    earthquakes.addTo(myMap);
});

//Function to create color scale for magnitude
function magnitudeColor(magnitude){
    if (magnitude <=1) {
        return "#CCFFCC"
    }
    else if (magnitude <=2) {
        return "#339966"
    }
    else if (magnitude <=3) {
        return "#008000"
    }
    else if (magnitude <=4) {
        return "#99CC00"
    }
    else if (magnitude <=5) {
        return "#003300"
    }
    else {return "#333333"}
};

// Create a legend to display information about our map.
var legend = L.control({
    position: "bottomright"
  });
// When the layer control is added, insert a div with the class of "legend".
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Earthquake Magnitude</h4>";
    //assign colors to values

    return div;
};
// Add the info legend to the map.
legend.addTo(myMap);
  