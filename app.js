var args = getArgs();
if (args.lng & args.lat){
  var map = L.map('map').setView([args.lat, args.lng], 13);
}
else{
  var map = L.map('map').setView([22.999919, 120.210703], 13);
}
mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18,
  id: 'your.mapbox.project.id',
  accessToken: 'pk.eyJ1IjoiY2hpbmc1NiIsImEiOiJjaXNiZmYydGMwMTN1MnpwbnNqNWVqM2plIn0.k7h-PUGX7Tl5xLwDH3Qpsg'
}).addTo(map);

/* Initialize the SVG layer */
map._initPathRoot();
//L.svg().addTo(map);
/* We simply pick up the SVG from the map object */
var svg = d3.select("#map").select("svg");
g = svg.append("g");

var zapperData = "zapper_data.json";
var bucketList = "location.json";//"https://s3-ap-northeast-1.amazonaws.com/dengue-report-dest/bucket-list.json";
var bucketRecord = "0809-0816.json";//"bucket_record_717_721.json";
var eventRecord = "http://140.116.247.113:12130/api/mcc?start=2017-07-17&end=2017-07-26";
//var bucketRecord = "http://report.denguefever.tw/bucket-record/?start=2017-07-17&end=2017-07-21&county=台南";

queue()
  .defer(d3.json, bucketList)
  .defer(d3.json, bucketRecord)
  .await(makeMyMap);

function makeMyMap(error, list, record) {
  var radius = 25;

  //var color = ["83D7FF", "88E893", "FFFD88", "E8BF77", "FF9F8D"];
  //var color = ["62FF6A", "DBE86E", "FFE288", "E8A877", "FF8581"];
  //var color = ["65FF29", "E8DF2E", "FFC440", "E8732E", "FF3333"];
  var color = ["rgba(0,0,0,0)", "rgba(0,0,0,0)", "rgba(0,0,0,0)", "rgba(0,0,0,0)", "rgba(0,0,0,0)"];
  var count = [0, 20, 40, 60, 80];
  //console.log(list);
  //console.log(record['bucket-record']);
  var feature = g.selectAll("circle")
    .data(record['bucket-record'])
    .enter()
    .append("circle")
    .style("opacity", 0)
    /*.style("fill", function(d) {
      //console.log(d.egg_count);
      if(d.egg_count >= count[0] && d.egg_count < count[1]) {
          d.color = color[0];//"65FF29";
      }
      else if(d.egg_count >= count[1] && d.egg_count < count[2]) {
          d.color = color[1];//"E8DF2E";
      }
      else if(d.egg_count >= count[2] && d.egg_count < count[3]) {
          d.color = color[2];//"FFC440";
      }
      else if(d.egg_count >= count[3] && d.egg_count < count[4]) {
          d.color = color[3];//"E8732E";
      }
      else if(d.egg_count >= count[4]) {
          d.color = color[4];//"FF3333";
      }
      else{
          d.color = color[0];//"65FF29";
      }
      //console.log(d.color);
      return d.color;
    })*/
    //.style("stroke", function(d) {
    //  return d.color
    //})
    //.attr("stroke-width", 20)
    /*.attr("transform",function(d) {
      //console.log(d.bucket_id);
      //console.log(list[d.bucket_id]['bucket_lng']);
      //console.log(list[d.bucket_id]['bucket_lat']);
      d.LatLng = new L.LatLng(list[d.bucket_id]['bucket_lng'], list[d.bucket_id]['bucket_lat']);
      //console.log(d.LatLng);
      return "translate(" +
        map.latLngToLayerPoint(d.LatLng).x + "," +
        map.latLngToLayerPoint(d.LatLng).y + ")";

    })*/
    .attr("r", radius)
    .attr('id', function(d) {
      return d.bucket_id;
    })
    .each(pulse);

  map.on("viewreset", update);
  update();

  function update() {
    feature.attr("transform",
      function(d) {
        //console.log(d.bucket_id)
        //console.log(list[d.bucket_id]);
        d.LatLng = new L.LatLng(list[d.bucket_id]['lat'], list[d.bucket_id]['lng']);
        
        //console.log(d.LatLng);
        return "translate(" +
          map.latLngToLayerPoint(d.LatLng).x + "," +
          map.latLngToLayerPoint(d.LatLng).y + ")";

      }
    )
  }

  function pulse() {
    var circle = d3.select(this);
    circle = circle.transition()
      .duration(1000)
      //.attr("stroke-width", 20)
      .attr("r", function(d) {
        //return 5;
        if (d.size == "1" || d.size == "2")
          return 30;
        else if (d.size == "-1" || d.size == "-2")
          return 15;
        else
          return 25;
      })
      .ease('sine');
  }

  repeat();

  function repeat() {
    setInterval(function() {
      var circle = d3.selectAll("circle");
      circle = circle.transition()
        .duration(1000)
        //.attr("stroke-width", 20)
        .attr("r", function(d) {
          return Math.floor((Math.random() * 10) + 5)
        })
        .ease('sine');
    }, 3000);
  }
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
