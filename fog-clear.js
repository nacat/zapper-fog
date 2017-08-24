var args = getArgs();
if (args.lng & args.lat){
  var map = L.map('map').setView([args.lat, args.lng], 13);
}
else{
  var map = L.map('map').setView([22.999919, 120.210703], 13);
}
L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
}).addTo(map);
/*L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18,
  id: 'your.mapbox.project.id',
  accessToken: 'pk.eyJ1IjoiY2hpbmc1NiIsImEiOiJjaXNiZmYydGMwMTN1MnpwbnNqNWVqM2plIn0.k7h-PUGX7Tl5xLwDH3Qpsg'
}).addTo(map);*/

var bucketLoc = "location.json";
var bucketRecord = "0809-0816.json";

var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');
var mouse = { x: 0, y: 0 };
var greenIcon = L.icon({
    iconUrl: 'leaf-green.png',
    //shadowUrl: 'leaf-shadow.png',

    iconSize:     [38, 95], // size of the icon
    //shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    //shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

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
      L.marker([loc[d.bucket_id]['lat'], loc[d.bucket_id]['lng']], {icon: greenIcon}).addTo(map);
      return location; // e.g. [50.5, 30.5, 0.2], // lat, lng, intensity

    });

    //console.log(locations);
    var heat = L.heatLayer(locations, { radius: 35 }); 
    map.addLayer(heat);

  });

});



document.addEventListener('mousemove', function(e) {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
}, false);

window.addEventListener('resize', function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  return resize;
}(), false);

requestAnimationFrame(function looop() {
  requestAnimationFrame(looop);
  draw(context);
});

function draw(context, location) {
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the green hulk to clear
  context.beginPath();
  context.fillStyle = 'rgba(0, 0, 0, .2 )';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = '#000';
  clearArc(context, mouse.x, mouse.y, 50);
}

// http://stackoverflow.com/a/12895687/1250044
function clearArc(context, x, y, radius) {
  context.save();
  context.globalCompositeOperation = 'destination-out';
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fill();
  context.restore();
}

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