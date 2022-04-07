import { setMap, findMe, addMarker, createCircle, removeCircle } from "./map.js";
import { centerLocation } from "./main.js";
var values, markerCategory, markerRadius;

// Ajax Call
function ajax() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = readyServe;
    xhr.open('GET', 'https://ta-maps-9cc1d-default-rtdb.firebaseio.com/markerLocations.json');
    xhr.send();
    function readyServe() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                values = JSON.parse(xhr.responseText);
                setMap(centerLocation);//defined in map.js
                findMe(centerLocation);//defined in map.js
                initialLayout();//defined in this js file only.
            }
        }
    }
}


function initialLayout() {
    markerRadius = 5;
    for (let places in values) {
        markerCategory = places;
        addMarker(values, markerCategory);//function decared in map.js
    }
}

//function to filter data based on the radius passed from main.js
function filterData(radius, category) {
    markerCategory = category;
    markerRadius = radius;
    addMarker(values, markerCategory);//function declared in map.js
    removeCircle();//function declared in map.js
    createCircle(radius * 1000);//function declared in map.js
}

//function to find distance between 2 locations ( called from map.js )
function distance(lat1, lon1, lat2, lon2, unit) {
    var dist;
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        if (markerRadius >= dist) {
            return true;
        } else {
            return false;
        }
    }

}




export { ajax, filterData,initialLayout, distance };
