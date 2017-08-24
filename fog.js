var args = getArgs();
if (args.lng & args.lat){
  var map = L.map('map').setView([args.lat, args.lng], 13);
}
else{
  var map = L.map('map').setView([22.999919, 120.210703], 13);
}
//var map = L.map('map').setView([42.35, -71.08], 13);
 
// load a tile layer
/*L.tileLayer('http://tiles.mapc.org/basemap/{z}/{x}/{y}.png',
  {
    attribution: 'Tiles by <a href="http://mapc.org">MAPC</a>, Data by <a href="http://mass.gov/mgis">MassGIS</a>',
    maxZoom: 17,
    minZoom: 9
  }).addTo(map);*/ 
//map.setZoom(12);

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18,
  id: 'your.mapbox.project.id',
  accessToken: 'pk.eyJ1IjoiY2hpbmc1NiIsImEiOiJjaXNiZmYydGMwMTN1MnpwbnNqNWVqM2plIn0.k7h-PUGX7Tl5xLwDH3Qpsg'
}).addTo(map);

var bucketLoc = "location.json";
var bucketRecord = "0809-0816.json";

$.getJSON(bucketLoc, function(loc) {
   //var locations = [];// lat, lng, intensity

  $.getJSON(bucketRecord, function(record) {

    singleRecord = record['bucket-record'].filter(function(d){
      return d.investigate_date == "2017-08-11";
    });

    /*singleRecord.forEach(function(d){
      //console.log(d.bucket_id);
      //console.log(loc[d.bucket_id]['lng']);
      //console.log(loc[d.bucket_id]['lat']);
      //console.log(d.egg_count);      
      var location = [loc[d.bucket_id]['lat'], loc[d.bucket_id]['lng'], d.egg_count];
      locations = locations.concat(location);
    });*/

    var locations = singleRecord.map(function(d){
      var location = [loc[d.bucket_id]['lat'], loc[d.bucket_id]['lng'], d.egg_count/20];
      //console.log(location);
      return location; // e.g. [50.5, 30.5, 0.2], // lat, lng, intensity
    });

    //console.log(locations);
    var heat = L.heatLayer(locations, { radius: 35 }); 
    map.addLayer(heat);

  });

});

/*$.getJSON(bucketRecord, function(record) {

  //var locations // lat, lng, intensity
  record = record['bucket-record'].filter(function(d){
      return d.investigate_date == "2017-08-11";
    });
  //console.log(locations);

  $.getJSON(bucketLoc, function(list) {

    console.log(list[record]);

    //console.log(list[d.bucket_id]);
    //point.push(list[]);
    //list.forEach(function(d){
      //var point = [record[bucket_id]['lat'],record[bucket_id]['lng']];
      //console.log(point);
      //console.log(record[d.bucket_id]['lat']); 

    //});

  });

  //var heat = L.heatLayer(locations, { radius: 35 }); 
  //map.addLayer(heat);
});*/

/*queue()
  .defer(d3.json, bucketLoc)
  .defer(d3.json, bucketRecord)
  .await(heapMap);


function heapMap(error, location, record) {

  $.getJSON(location, function(data) {
    console.log(data);

    /*locations = data['bucket-record'].filter(function(d){
      return d.investigate_date == "2017-08-11"
    });
    console.log(locations);
    locations.forEach(function(data){
      console.log(data[lat]); 
    });

  });
  
  $.getJSON(record, function(data) {
    console.log(data['bucket-record']);

    /*locations = data['bucket-record'].filter(function(d){
      return d.investigate_date == "2017-08-11"
    });
    console.log(locations);
    locations.forEach(function(data){
      console.log(data[lat]); 
    });

  });

}*/

/*$.getJSON("rodents.geojson",function(data){
  var locations = data.features.map(function(rat) {
    // the heatmap plugin wants an array of each location
    var location = rat.geometry.coordinates.reverse();
    location.push(0.5);
    return location; // e.g. [50.5, 30.5, 0.2], // lat, lng, intensity
  });

  var heat = L.heatLayer(locations, { radius: 35 });
  map.addLayer(heat);
});*/

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