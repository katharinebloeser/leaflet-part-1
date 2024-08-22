
function createMap(earthquakeLayer) {

    //Create tile layer for background
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    //Create a basemaps to hold the streetmap layer
    let baseMaps = {
        "Street Map" : streetmap
    };

    //Create an overlaymaps to hold the earthquakes layer
    let overlayMaps = {
        "Earthquakes": earthquakeLayer
    };

    //Create the map object with options
    let map = L.map("map", {
        center: [40.06, -70.41],
        zoom: 3,
        layers: [streetmap, earthquakeLayer]
    });
    
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}
//Function to create markers for the earthquakes
function createMarkers(earthquakeData){
    let eqMarkers = [];

//Loop through the locations, and create earthquake markers
    for (let i = 0; i < earthquakeData.features.length; i++) {
        let feature = earthquakeData.features[i];
        eqMarkers.push(
            L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                stroke: false,
                fillOpacity: 0.75,
                color: "white",
                fillColor: circleColor(feature.geometry.coordinates[2]),
                radius: markerSize(feature.properties.mag)
        }).bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p>`)
    );
}
    return L.layerGroup(eqMarkers);
}
//Function to detirmine the marker size based on magnitude
function markerSize(magnitude) {
    return magnitude*10000;
}

//Function to detirmine the circle color based on depth
function circleColor(depth) {
    if (depth > 5) {
        return "red";
    } else if (depth > 4) {
        return "orange";
    } else if (depth > 3) {
        return "yellow";
    } else {
        return "green";
    }
}
// Perform an API call to the earthquakes API to get the station information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson").then(function(earthquakeData) {
    let earthquakelayer = createMarkers(earthquakeData);
    createMap(earthquakelayer);
});

