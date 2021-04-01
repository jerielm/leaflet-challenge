var query_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// query url
d3.json(query_url, function(data) {

  // variable for earthquake objects
var earthquakeobject = L.geoJSON(data.features, {pointToLayer: function(quakeData, coords) {
  return L.circle(coords, {
    radius: quakeData.properties.mag * 8000,
    color: "black",
    fillColor: markercolor(quakeData.geometry.coordinates[2]),
    fillOpacity: .75,
    opacity: .8,
    weight:.5
  });
},
onEachFeature: onEachFeature
});

    // function for earthquake object colors
    function markercolor(depth) {
        if (depth < 10) {
          return "#FDECEC"}
        else if (depth < 30) {
          return "#FFC1C1"}
        else if (depth < 50) {
          return "#FFA1A1"}
        else if (depth < 70) {
          return "#FF6969"}
        else if (depth < 90) {
          return "#FF3F3F"}
        else {
          return "#FF0000"}
      }

      
    // streetmap layer
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 26,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });

    // map layer and legend variables
    var baseMaps = {"Street Map": streetmap};
    var overlayMaps = {Earthquakes: earthquakeobject};
    var legenddata = L.control({position: "bottomright"});
    
    // initializing the map
    var myMap = L.map("mapid", {
      center: [40, -105],
      zoom: 5.5,
      layers: [streetmap, earthquakeobject]
    });

    
    // legend info
    legenddata.onAdd = function() {
      var div = L.DomUtil.create("div", "legend");
      var depth = ["-10-10","10-30","30-50","50-70","70-90","90+"];
      var colors = ["#FDECEC", "#FFC1C1", "#FFA1A1", "#FF6969", "#FF3F3F", "#FF0000"]
      div.innerHTML += "Earthquake Depth (km)<br><br>"
     
      for (var i = 0; i < depth.length; i++) {
        div.innerHTML += "<div width='50' height='50' style='float:left; background-color:" + colors[i] + "'>&nbsp&nbsp&nbsp&nbsp</div>&nbsp&nbsp" + depth[i] + "<br>";};
        return div;
    };

    // event listener for earthquake objects
    function onEachFeature(feature, layer) {
      layer.bindPopup(
        "Date/Time: " + new Date(feature.properties.time) +
        "<br> Earthquake Magnitude: " + feature.properties.mag +
        "<br> Location: " + feature.properties.place +
        "<br> Depth(km): " + feature.geometry.coordinates[2]);
      }



    

    // legend object to map
    legenddata.addTo(myMap);
  });
