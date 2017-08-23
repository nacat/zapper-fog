var args = getArgs();
if (args.lng & args.lat){
  var map = L.map('map').setView([args.lat, args.lng], 13);
}
else{
  var map = L.map('map').setView([22.999919, 120.210703], 13);
}

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18,
  id: 'your.mapbox.project.id',
  accessToken: 'pk.eyJ1IjoiY2hpbmc1NiIsImEiOiJjaXNiZmYydGMwMTN1MnpwbnNqNWVqM2plIn0.k7h-PUGX7Tl5xLwDH3Qpsg'
}).addTo(map);

var bucketLoc = "location.json";
var bucketRecord = "0809-0816.json";

$.getJSON(bucketLoc, function(loc) {
  $.getJSON(bucketRecord, function(record) {

    singleRecord = record['bucket-record'].filter(function(d){
      return d.investigate_date == "2017-08-11";
    });
    

    var locations = singleRecord.map(function(d){
      var location = [loc[d.bucket_id]['lat'], loc[d.bucket_id]['lng'], d.egg_count/20];
      return location; // lat, lng, intensity
    });

    var heat = L.heatLayer(locations, { radius: 35 }); 
    map.addLayer(heat);

  });

});

function getArgs() { 
  var args = new Object(); 
  var query = location.search.substring(1);
  var pairs = query.split("&"); 
  for(var i=0;i<pairs.length;i++) { 
    var pos = pairs[i].indexOf("="); 
    if (pos == -1) continue; 
    var argname = pairs[i].substring(0,pos); 
    var value = pairs[i].substring(pos+1); 
    args[argname] = decodeURIComponent(value); 
  } 
  return args; 
}