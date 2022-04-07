import { centerLocation } from "./main.js";
import { distance } from "./setup.js";
const apiKey = 'pk.eyJ1Ijoic2lkZGhhcnRoYS1zcml2YXN0YXZhIiwiYSI6ImNrdGNpaWkxdjI1dDMyb3BkMWNsbGduZWoifQ.jO-FJUDAtxG9P787NJ2qHA';

var map;
let marker, endRouteButton, mapRoute , markerCircle;
let markerList = [];//array for markers
let circleList = [];//arrray for areaCircles


// function to set the map.
// called from setup.js.
function setMap(centerLocation) {
    map = L.map('map').setView([centerLocation.lat, centerLocation.long], 4);

    //load and display tile layers on the map
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        maxZoom: 100, //The maximum zoom level up to which this layer will be displayed
        id: 'mapbox/streets-v11', //high-contrast colors added in map.
        tileSize: 512, //Width and height of tiles in the grid
        zoomOffset: -1, //The zoom number used in tile will be offset with this value.
        accessToken: apiKey //to associate with Mapbox API resources
    }).addTo(map);
}

//function to instantly find the user and focus there location.
// called from setup.js.
function findMe() {
    L.control.locate({
        keepCurrentZoomLevel: 'false', //to zoom to intial zoom level as it is set false
        flyTo: true, //smoothly pan to intial zoomLevel
        initialZoomLevel: 14, //zoom set when locating
    }).addTo(map);
}

//function to add markers in the map which takes input as json parsed data and category chosen by user
// called from setup.js
function addMarker(values, category) {
    let url;

    //url for different color markers for different category
    if (category === 'restaurants') {
        url = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';
    } else if (category === 'shops') {
        url = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png';
    } else if (category === 'pharmacies') {
        url = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png';
    } else {
        url = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png';
    }

    //iterate over all the objects in the array of category. 
    values[category].forEach(ele => {
        let lat = ele.location[0];
        let long = ele.location[1];

        //if location is within chosen radius, the distance function returns true.
        //distance is defined in setup.js
        if (distance(centerLocation.lat, centerLocation.long, lat, long, 'K')) {

            //create marker
            var markerIcon = new L.Icon({
                iconUrl: url,
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41], // size of the icon
                iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
                popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
                shadowSize: [41, 41] // size of the shadow
            });

            marker = L.marker([lat, long], { icon: markerIcon }).addTo(map);
            markerList.push(marker);//add marker in the markerList array, to remove all markers when needed.

            // PopUp creation
            let template = `
            <ul aria-labelledby="${ele.name}" style="list-style:none;padding:0em">
              <li style="margin:auto;">
                <h2 style="text-align:center;text-decoration:underline">${ele.name}</h2>
              </li>
              <li style="margin:auto;">
                <img width="100%" height="100%" margin="0" src=${ele.image} alt="${ele.name}"  />
              </li>
              <li id="route-button" style="margin:auto;text-align:center;">
              <button style="padding:0.2em;width:100%;" id="${ele.name}" marker-location-lat="${lat}" marker-location-long="${long}" >Find A Route</button>
              </li>
            </ul> 
              `
            marker.bindPopup(template);//binding popup to marker.
        }
    });
}

//function to remove all the markers in markerList.
function removeMarkers() {
    markerList.forEach(ele => {
        ele.remove();
    });
}

//function to create areaCircle w.r.t the radius chosen.
//called from setup.js
function createCircle(areaRadius) {
    markerCircle = L.circle([centerLocation.lat, centerLocation.long], {
        color: '', //color in border (kept as none because by default blue)
        fillColor: '#f03', //color inside the areaCircle
        fillOpacity: 0.2, //opacity in the circle
        radius: areaRadius //radius of circle in metres
    }).addTo(map);
    circleList.push(markerCircle);
}

//function to remove the areaCircle.
function removeCircle() {
    circleList.forEach(ele => {
        ele.remove();
    });
}


//create route function
function getRoute(button) {
    mapRoute = L.Routing.control({
        waypoints: [
            L.latLng(centerLocation.lat, centerLocation.long), //starting location
            L.latLng(button.getAttribute("marker-location-lat"), button.getAttribute("marker-location-long")) //ending location
        ],// 2 locations to route between
        autoRoute: true, //route will automatically be calculated every time waypoints change, otherwise route has to be called.
    }).addTo(map)

    //remove Area circle declared above
    removeCircle();

    //create end route button
    endRouteButton = document.createElement("button");
    endRouteButton.appendChild(document.createTextNode('End Routing'));
    document.getElementById('end-route').appendChild(endRouteButton);
}

//demolish route function
function endRoute() {
    map.removeControl(mapRoute);

    //removing end route button
    endRouteButton.remove();
}

//event delegation to find route when Find A Route button is clicked 
document.getElementById("map").addEventListener("click", function (way) {
    if ((way.target.innerHTML == "Find A Route") && (way.target.matches("button"))) {

        //if previously route is created, then remove that route.
        if (mapRoute) {
            endRoute();
        }
        getRoute(way.target);
    }
});

//event delegation to end routing when End Routing button is clicked 
document.getElementById("map").addEventListener("click", function (way) {
    if ((way.target.innerHTML == "End Routing") && (way.target.matches("button"))) {
        endRoute(way.target);
    }
});


export { setMap, findMe, addMarker, createCircle, removeCircle, removeMarkers };