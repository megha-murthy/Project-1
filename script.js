// ==========================================================================================================================================
// ==========================================================================================================================================
// ==========================================================================================================================================
// This code fetches the JSON from the API
initMap();
const key = 'This-api-key-is-for-commercial-use-exclusively.Only-entities-with-a-Spotcrime-contract-May-use-this-key.Call-877.410.1607.';
let lat = 0;
//for the US, the longitude will always be negative
let lon = 0;
let radius = 10; // this is in miles
let milesInput = document.getElementById("miles");
if(milesInput.value != ""){
  radius = milesInput.value;
}
function fetchJson(newUrl) {
  $.ajax({
    type: 'GET',
    url: newUrl,
    contentType: 'application/json',
    dataType: 'jsonp',
    responseType: 'application/json',
    xhrFields: {
      withCredentials: false
    },
    headers: {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'application/json',
    },
    success: function (data) {
      rankOffences(data.crimes);
    },
    error: function (error) {
      console.log("FAIL....=================");
    }
  });
}
//fetches the json, and updates the list
// fetchJson();


function makeMap(lat1, lon1, url) {
  fetchJson(url);
  var pos = {
    lat: lat1,
    lng: lon1
  };
  map = new google.maps.Map(document.getElementById("map-canvas"), {
    center: pos,
    zoom: 5
  });
  infoWindow = new google.maps.InfoWindow;
  // Try HTML5 geolocation.
      infoWindow.setPosition(pos);
      var firstmarker = new google.maps.Marker({
        position: {
          lat: lat1,
          lng: lon1
        },
        map: map,
        draggable: false,
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        }
      });
      map.setCenter(pos);
      map.setZoom(10);
    }
// ==========================================================================================================================================
// ==========================================================================================================================================
// ==========================================================================================================================================
// This code should loap the map onto the page
var map, infoWindow;
function initMap() {
  var startingLatLon = { lat: 40, lng: -122 };
  map = new google.maps.Map(document.getElementById("map-canvas"), {
    center: startingLatLon,
    zoom: 10
  });
  infoWindow = new google.maps.InfoWindow;
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      let url = `https://api.spotcrime.com/crimes.json?&lat=${pos.lat}&lon=${pos.lng}&radius=${radius}&key=${key}`;
      // start the whole process of fetching json, and moving map, adding markers, etc.
      fetchJson(url);
      infoWindow.setPosition(pos);
      var firstmarker = new google.maps.Marker({
        position: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        map: map,
        draggable: false,
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        }
      });
      map.setCenter(pos);
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}
var marker = new google.maps.Marker({
  position: {
    lat: lat,
    lng: lon
  },
  map: map,
  draggable: false,
  icon: {
    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
  }
});
var cityCircle = new google.maps.Circle({
  strokeColor: '#FF0000',
  strokeOpacity: 1,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.35,
  map: map,
  center: {
    lat: lat,
    lng: lon
  },
  radius: 100000
});

var search = new google.maps.places.SearchBox(document.getElementById("search"));
var searchButton = document.getElementById("search-button");
var searchBox = new google.maps.places.SearchBox(document.getElementById("mapsearch"));
var box = document.getElementById("mapsearch");
// google.maps.event.addListener("click", function() {
searchButton.addEventListener("click", function(event) {
  event.preventDefault();
  var places = searchBox.getPlaces();
  var bounds = new google.maps.LatLngBounds();

  var latlng = places[0].geometry.location;
  bounds.extend(places[0].geometry.location);
  marker.setPosition(places[0].geometry.location);
  // this gets the coordinates of the place in the search box
  let temp = JSON.stringify(latlng);
  let coordsObj = JSON.parse(temp);
  let lat1 = coordsObj.lat;
  let lon1 = coordsObj.lng;
  // constructs url to fetch json
  let url = `https://api.spotcrime.com/crimes.json?&lat=${lat1}&lon=${lon1}&radius=${radius}&key=${key}`;
  // removes previous markers
  if (markers.length > 0) {
    removeMarkers();
  }
  // start the whole process of fetching json, and moving map, adding markers, etc.
  dataCashe = [];
  sortedData = [];
  makeMap(lat1, lon1, url);
});