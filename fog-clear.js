
var map = L.map('map').setView([22.999919, 120.210703], 13);

L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
}).addTo(map);

var bucketLoc = "location.json";
var bucketRecord = "0809-0816.json";

var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

window.addEventListener('resize', function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  //draw(context);
  return resize;
}(), false);

requestAnimationFrame(function looop() {
  //requestAnimationFrame(looop);
  draw(context);
});

function draw(context, location) {
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the green hulk to clear
  context.beginPath();
  context.fillStyle = 'rgba(0, 0, 0, .2 )';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = '#000';

  $.getJSON(bucketLoc, function(loc) {
    $.getJSON(bucketRecord, function(record) {

      singleRecord = record['bucket-record'].filter(function(d){
        return d.investigate_date == "2017-08-11";
      });

      var locations = singleRecord.map(function(d){
        var latlng = new L.latLng(loc[d.bucket_id]['lat'], loc[d.bucket_id]['lng']);
        var point = map.latLngToLayerPoint(latlng);
        clearArc(context, point.x, point.y, 50);
        return location; // lat, lng, intensity

      });

    });

  });
}

function clearArc(context, x, y, radius) {
  context.save();
  context.globalCompositeOperation = 'destination-out';
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fill();
  context.restore();
}