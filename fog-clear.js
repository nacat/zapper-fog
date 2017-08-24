var map = L.map('map').setView([22.999919, 120.210703], 13);
L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
}).addTo(map);

var bucketLoc = "location.json";
var bucketRecord = "0809-0816.json";
var limit = 50;
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

window.addEventListener('resize', function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  return resize;
}(), false);

$.getJSON(bucketLoc, function(loc) {
  $.getJSON(bucketRecord, function(record) {

    singleRecord = record['bucket-record'].filter(function(d){
      return (d.investigate_date == "2017-08-11" && d.egg_count <= limit);
    });
    
    var preZoom = map.getZoom();
    fill(context);
    singleRecord.forEach(function(d){
      var latlng = new L.latLng(loc[d.bucket_id]['lat'], loc[d.bucket_id]['lng']);
      var prePoint = map.latLngToLayerPoint(latlng);
      clear(context,prePoint);
    });

    requestAnimationFrame(function looop() {
      if (map.getZoom() != preZoom){
        preZoom = map.getZoom();
        
        fill(context);
        singleRecord.forEach(function(d){
          var latlng = new L.latLng(loc[d.bucket_id]['lat'], loc[d.bucket_id]['lng']);
          var point = map.latLngToLayerPoint(latlng);
          clear(context,point);
        });
      }
      requestAnimationFrame(looop);
    });
  });
});

function fill(context){
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
  context.fillStyle = 'rgba(0, 0, 0, .2 )';
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function clear(context, location){
  context.fillStyle = '#000';
  clearArc(context, location.x, location.y, 30);
}

function clearArc(context, x, y, radius) {
  context.save();
  context.globalCompositeOperation = 'destination-out';
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fill();
  context.restore();
}